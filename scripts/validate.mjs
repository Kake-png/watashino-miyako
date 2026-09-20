import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(projectRoot, "public");
const dataCode = fs.readFileSync(path.join(publicRoot, "assets", "data.js"), "utf8");
const context = { window: {} };
vm.runInNewContext(dataCode, context, { filename: "data.js" });

const { stations, sources, tagLabels } = context.window.ATLAS_DATA;
const errors = [];
const slugs = new Set();

for (const station of stations) {
  if (slugs.has(station.slug)) errors.push(`Duplicate station slug: ${station.slug}`);
  slugs.add(station.slug);
  for (const field of ["slug", "name", "kana", "area", "descriptor", "summary"]) {
    if (!station[field]) errors.push(`${station.slug || "unknown"}: missing ${field}`);
  }
  for (const tag of station.tags || []) {
    if (!tagLabels[tag]) errors.push(`${station.slug}: unknown tag ${tag}`);
  }
  for (const sourceKey of station.images || []) {
    if (!sources[sourceKey]) errors.push(`${station.slug}: unknown image source ${sourceKey}`);
  }
}

for (const [key, source] of Object.entries(sources)) {
  for (const field of ["file", "alt", "caption", "date", "author", "license", "licenseUrl", "sourceUrl", "changes"]) {
    if (!source[field]) errors.push(`${key}: missing ${field}`);
  }
  if (!fs.existsSync(path.join(publicRoot, source.file))) errors.push(`${key}: missing file ${source.file}`);
  if (!source.sourceUrl.startsWith("https://commons.wikimedia.org/")) errors.push(`${key}: unexpected source host`);
  if (!source.licenseUrl.startsWith("https://creativecommons.org/")) errors.push(`${key}: unexpected license host`);
}

for (const file of ["index.html", "station.html", "compare.html", "credits.html", "_redirects", "_headers"]) {
  if (!fs.existsSync(path.join(publicRoot, file))) errors.push(`Missing publish asset: ${file}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`OK: ${stations.length} stations, ${Object.keys(sources).length} licensed photos, ${Object.keys(tagLabels).length} filters.`);
