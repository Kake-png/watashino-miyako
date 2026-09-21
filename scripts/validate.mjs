import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ATLAS_DATA } from "../public/assets/data.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(projectRoot, "public");
const { stations, sources, tagLabels, filterGroups, themePresets } = ATLAS_DATA;
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
  if (!station.practical) errors.push(`${station.slug}: missing practical notes`);
  if (!fs.existsSync(path.join(publicRoot, "station", station.slug, "index.html"))) errors.push(`${station.slug}: missing physical station page`);
}

for (const [key, source] of Object.entries(sources)) {
  for (const field of ["file", "alt", "caption", "date", "author", "license", "licenseUrl", "sourceUrl", "changes"]) {
    if (!source[field]) errors.push(`${key}: missing ${field}`);
  }
  if (!fs.existsSync(path.join(publicRoot, source.file))) errors.push(`${key}: missing file ${source.file}`);
  if (!source.sourceUrl.startsWith("https://commons.wikimedia.org/")) errors.push(`${key}: unexpected source host`);
  if (!source.licenseUrl.startsWith("https://creativecommons.org/")) errors.push(`${key}: unexpected license host`);
}

for (const group of filterGroups) {
  for (const tag of group.tags) if (!tagLabels[tag]) errors.push(`${group.id}: unknown filter tag ${tag}`);
}

const themeIds = new Set();
for (const theme of themePresets) {
  if (themeIds.has(theme.id)) errors.push(`Duplicate theme id: ${theme.id}`);
  themeIds.add(theme.id);
  for (const field of ["id", "navLabel", "label", "title", "description", "matchMode"]) {
    if (!theme[field]) errors.push(`${theme.id || "unknown theme"}: missing ${field}`);
  }
  for (const tag of theme.tags || []) if (!tagLabels[tag]) errors.push(`${theme.id}: unknown theme tag ${tag}`);
  if (!fs.existsSync(path.join(publicRoot, "themes", theme.id, "index.html"))) errors.push(`${theme.id}: missing physical theme page`);
}

for (const file of ["index.html", "compare/index.html", "about/index.html", "privacy/index.html", "site-policy/index.html", "_headers", "assets/revision.css", "vendor/maplibre-gl-csp.js", "vendor/maplibre-gl-csp-worker.js", "vendor/maplibre-gl.css"]) {
  if (!fs.existsSync(path.join(publicRoot, file))) errors.push(`Missing publish asset: ${file}`);
}

const indexHtml = fs.readFileSync(path.join(publicRoot, "index.html"), "utf8");
if (indexHtml.includes("unpkg.com/maplibre")) errors.push("Home still references external MapLibre bundle");
if (!indexHtml.includes('src="/vendor/maplibre-gl-csp.js?v=5.24.0"')) errors.push("Home is missing local CSP-safe MapLibre browser bundle");
if (!indexHtml.includes('type="module" src="/assets/app.js?v=10"')) errors.push("Home is missing versioned module app script");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`OK: ${stations.length} stations, ${themePresets.length} lifestyle themes, ${Object.keys(sources).length} licensed photos, ${Object.keys(tagLabels).length} filters.`);
