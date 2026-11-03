import "dotenv/config";
import express from "express";
import pg from "pg";
import { placeDetails, withRetry } from "./places.js";

const { Pool } = pg;
const required = ["DATABASE_URL", "GOOGLE_PLACES_API_KEY", "GOOGLE_MAPS_BROWSER_KEY"];
for (const key of required) if (!process.env[key]) throw new Error(`Missing environment variable: ${key}`);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false },
  max: 8,
  idleTimeoutMillis: 30000
});
const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", async (_req, res) => {
  try { await pool.query("select 1"); res.json({ ok: true }); }
  catch { res.status(503).json({ ok: false }); }
});

app.get("/api/config", (_req, res) => {
  res.set("Cache-Control", "public, max-age=3600");
  res.json({ mapsBrowserKey: process.env.GOOGLE_MAPS_BROWSER_KEY });
});

app.get("/api/hotels", async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 30);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const values = [];
    const conditions = ["is_hidden = false"];
    for (const [param, column] of [["region","region_override"],["city","city_override"],["village","village_override"],["category","category_override"]]) {
      if (req.query[param]) { values.push(String(req.query[param]).slice(0, 120)); conditions.push(`${column} = $${values.length}`); }
    }
    if (req.query.q) {
      values.push(`%${String(req.query.q).slice(0, 100)}%`);
      // Search text belongs to Google; do not persist it. Querying Places text is intentionally
      // not implemented here; Saqo-owned aliases may be added as a separate field.
      conditions.push("place_id ilike $"+values.length);
    }
    const where = conditions.join(" and ");
    const count = await pool.query(`select count(*)::int as total from public.hotel_places where ${where}`, values);
    values.push(limit, offset);
    const rows = await pool.query(
      `select place_id, region_override, city_override, village_override, category_override
       from public.hotel_places where ${where}
       order by created_at desc limit $${values.length - 1} offset $${values.length}`, values
    );

    // Google content is fetched live. It is not written to PostgreSQL or cached here.
    const places = await Promise.all(rows.rows.map(async row => {
      try {
        const detail = await withRetry(() => placeDetails(row.place_id, process.env.GOOGLE_PLACES_API_KEY, process.env.PLACES_LANGUAGE_CODE || "ka"));
        return {
          ...detail,
          region: row.region_override || detail.region || "რეგიონი დაუზუსტებელია",
          city: row.city_override || detail.city || "ქალაქი დაუზუსტებელია",
          village: row.village_override || detail.village || "",
          category: row.category_override || detail.category
        };
      } catch (error) {
        return { placeId: row.place_id, unavailable: true, error: error.message };
      }
    }));
    res.set("Cache-Control", "no-store");
    res.json({ total: count.rows[0].total, limit, offset, places });
  } catch (error) {
    console.error("GET /api/hotels", error);
    res.status(500).json({ error: "სასტუმროების ჩატვირთვა ვერ მოხერხდა" });
  }
});

app.get("/api/places/:placeId/photo", async (req, res) => {
  try {
    const photoName = String(req.query.name || "");
    if (!/^places\/[^/]+\/photos\/[^/]+$/.test(photoName)) return res.status(400).end();
    const url = new URL(`https://places.googleapis.com/v1/${photoName}/media`);
    url.searchParams.set("maxWidthPx", "800");
    const upstream = await fetch(url, { headers: { "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY } });
    if (!upstream.ok) return res.status(upstream.status).end();
    res.set("Cache-Control", "no-store");
    res.set("Content-Type", upstream.headers.get("content-type") || "image/jpeg");
    const bytes = Buffer.from(await upstream.arrayBuffer());
    res.send(bytes);
  } catch (error) {
    console.error("Photo proxy failed", error);
    res.status(502).end();
  }
});

app.post("/api/admin/sync", async (req, res) => {
  if (!process.env.SYNC_TOKEN || req.get("authorization") !== `Bearer ${process.env.SYNC_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.status(202).json({ message: "Run the backend sync command as a Render Cron Job: npm run sync" });
});

const port = Number(process.env.PORT || 10000);
app.listen(port, () => console.log(`Saqo Places API listening on ${port}`));
