import { cp, mkdir, rm, access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
const requiredFiles = ["index.html", "styles.css", "app.js", "data/tours.json", "data/flights.json"];

for (const relativePath of requiredFiles) {
  const absolutePath = path.join(root, relativePath);
  try {
    await access(absolutePath, constants.R_OK);
  } catch {
    throw new Error(`Required static-site file is missing: ${relativePath}`);
  }
}

for (const relativePath of ["data/tours.json", "data/flights.json"]) {
  const contents = await readFile(path.join(root, relativePath), "utf8");
  const parsed = JSON.parse(contents);
  if (!Array.isArray(parsed)) {
    throw new Error(`${relativePath} must contain a JSON array`);
  }
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const relativePath of ["index.html", "styles.css", "app.js", "data"]) {
  await cp(path.join(root, relativePath), path.join(output, relativePath), { recursive: true });
}

console.log("Static site built successfully in dist/");
console.log("Validated: index.html, styles.css, app.js, data/tours.json, data/flights.json");
