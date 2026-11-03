import "dotenv/config";
import pg from "pg";
import { PLACE_TYPES, textSearch, withRetry } from "./places.js";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
  max: 3
});
const key = process.env.GOOGLE_PLACES_API_KEY;
if (!key || !process.env.DATABASE_URL) throw new Error("DATABASE_URL and GOOGLE_PLACES_API_KEY are required");

// Approximate Georgia coverage envelope. Grid cells are subdivided automatically
// whenever Google returns the 60-result Text Search ceiling for a type/cell.
const BOUNDS = { south: 41.0, north: 43.7, west: 40.0, east: 46.8 };
const CELL_KM = 8;
const DEG_LAT = CELL_KM / 111;
const DEG_LNG = CELL_KM / (111 * Math.cos(42.2 * Math.PI / 180));
const MAX_DEPTH = 5;
const sleep = ms => new Promise(r => setTimeout(r, ms));

function makeCells(bounds, depth = 0) {
  const cells = [];
  for (let south = bounds.south; south < bounds.north; south += DEG_LAT) {
    for (let west = bounds.west; west < bounds.east; west += DEG_LNG) {
      cells.push({ south, west, north: Math.min(south + DEG_LAT, bounds.north), east: Math.min(west + DEG_LNG, bounds.east), depth });
    }
  }
  return cells;
}
function split(cell) {
  const midLat = (cell.south + cell.north) / 2;
  const midLng = (cell.west + cell.east) / 2;
  const d = cell.depth + 1;
  return [
    { south: cell.south, west: cell.west, north: midLat, east: midLng, depth: d },
    { south: cell.south, west: midLng, north: midLat, east: cell.east, depth: d },
    { south: midLat, west: cell.west, north: cell.north, east: midLng, depth: d },
    { south: midLat, west: midLng, north: cell.north, east: cell.east, depth: d }
  ];
}
async function searchCell(cell, type, found) {
  let token;
  let count = 0;
  do {
    const body = {
      textQuery: type.replaceAll("_", " "),
      includedType: type,
      strictTypeFiltering: true,
      languageCode: "ka",
      pageSize: 20,
      locationBias: { rectangle: {
        low: { latitude: cell.south, longitude: cell.west },
        high: { latitude: cell.north, longitude: cell.east }
      }}
    };
    if (token) body.pageToken = token;
    const result = await withRetry(() => textSearch(body, key));
    for (const place of result.places || []) if (place.id) found.add(place.id);
    count += (result.places || []).length;
    token = result.nextPageToken;
    await sleep(120);
  } while (token && count < 60);

  if (count >= 60 && cell.depth < MAX_DEPTH) {
    for (const child of split(cell)) await searchCell(child, type, found);
  }
}

async function main() {
  const job = await pool.query(
    "insert into public.places_sync_jobs(status,cursor_json) values('running',$1) returning id",
    [JSON.stringify({ phase: "discover", typeIndex: 0, completedTypes: [] })]
  );
  const jobId = job.rows[0].id;
  const found = new Set();
  try {
    const cells = makeCells(BOUNDS);
    let completed = 0;
    for (let ti = 0; ti < PLACE_TYPES.length; ti++) {
      const type = PLACE_TYPES[ti];
      for (const cell of cells) {
        await searchCell(cell, type, found);
        completed++;
        if (completed % 25 === 0) {
          await pool.query(
            "update public.places_sync_jobs set discovered_count=$1,cursor_json=$2,updated_at=now() where id=$3",
            [found.size, JSON.stringify({ type, typeIndex: ti, cellsCompleted: completed }), jobId]
          );
          console.log(`Progress: ${completed}/${cells.length * PLACE_TYPES.length} type/cells; unique IDs: ${found.size}`);
        }
      }
    }

    // Only place IDs are persisted from Google. Upsert never overwrites Saqo-owned fields.
    const ids = [...found];
    for (let i = 0; i < ids.length; i += 500) {
      const batch = ids.slice(i, i + 500);
      await pool.query(
        `insert into public.hotel_places(place_id) select unnest($1::text[])
         on conflict(place_id) do update set updated_at=now()`,
        [batch]
      );
    }
    await pool.query(
      "update public.places_sync_jobs set status='completed',discovered_count=$1,completed_at=now(),updated_at=now() where id=$2",
      [ids.length, jobId]
    );
    console.log(`Sync completed: ${ids.length} unique place IDs`);
  } catch (error) {
    await pool.query(
      "update public.places_sync_jobs set status='failed',last_error=$1,updated_at=now() where id=$2",
      [String(error).slice(0, 2000), jobId]
    );
    throw error;
  } finally {
    await pool.end();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
