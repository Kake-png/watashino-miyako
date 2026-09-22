import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(root, "public", "assets", "data.js");
const geometryPath = path.join(root, "public", "assets", "route-geometry.json");
const marker = /\/\* ROUTE_GEOMETRY_START \*\/[\s\S]*?\/\* ROUTE_GEOMETRY_END \*\//;
const source = fs.readFileSync(dataPath, "utf8");
if (!marker.test(source)) throw new Error("Route geometry markers are missing from data.js");
const geometry = JSON.parse(fs.readFileSync(geometryPath, "utf8"));
const replacement = `/* ROUTE_GEOMETRY_START */ ${JSON.stringify(geometry)} /* ROUTE_GEOMETRY_END */`;
fs.writeFileSync(dataPath, source.replace(marker, replacement));
console.log(`Embedded ${Object.keys(geometry).length} route geometries into data.js`);
