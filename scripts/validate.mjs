import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ATLAS_DATA } from "../public/assets/data.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(projectRoot, "public");
const routeGeometrySource = JSON.parse(fs.readFileSync(path.join(publicRoot, "assets", "route-geometry.json"), "utf8"));
const { stations, sources, tagLabels, tagCriteria, filterGroups, themePresets, routeGroups, routeLabels, routeGeometry } = ATLAS_DATA;
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
  if (!station.directRoutes?.length) errors.push(`${station.slug}: missing direct routes`);
  for (const route of station.routes || []) {
    if (!routeLabels[route]) errors.push(`${station.slug}: unknown route ${route}`);
  }
  for (const route of station.nearbyRoutes || []) {
    if (!station.routes.includes(route)) errors.push(`${station.slug}: nearby route is not searchable: ${route}`);
  }
  if (!Number.isFinite(station.rent1k) || station.rent1k <= 0) errors.push(`${station.slug}: invalid 1K rent`);
  if (!station.rentSource) errors.push(`${station.slug}: missing rent source note`);
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
  for (const tag of group.tags) {
    if (!tagLabels[tag]) errors.push(`${group.id}: unknown filter tag ${tag}`);
    if (!tagCriteria[tag]) errors.push(`${group.id}: missing criterion for ${tag}`);
  }
}

const routeIds = new Set();
for (const group of routeGroups) {
  for (const route of group.routes) {
    if (routeIds.has(route.id)) errors.push(`Duplicate route id: ${route.id}`);
    routeIds.add(route.id);
    if (!route.label || !route.color) errors.push(`${route.id}: missing route label or color`);
    if (route.available !== false && !stations.some((station) => station.routes.includes(route.id))) errors.push(`${route.id}: route has no matching station`);
    if (route.available !== false && !routeGeometry[route.id]?.features?.length) errors.push(`${route.id}: missing embedded route geometry`);
    if (route.available !== false && routeGeometry[route.id]?.features?.length !== routeGeometrySource[route.id]?.features?.length) errors.push(`${route.id}: embedded route geometry is stale`);
  }
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

for (const file of ["index.html", "compare/index.html", "about/index.html", "privacy/index.html", "site-policy/index.html", "_headers", "assets/revision.css", "vendor/leaflet.js", "vendor/leaflet.css"]) {
  if (!fs.existsSync(path.join(publicRoot, file))) errors.push(`Missing publish asset: ${file}`);
}

const indexHtml = fs.readFileSync(path.join(publicRoot, "index.html"), "utf8");
const appSource = fs.readFileSync(path.join(publicRoot, "assets", "app.js"), "utf8");
if (indexHtml.includes("unpkg.com/maplibre") || indexHtml.includes("maplibre-gl-csp")) errors.push("Home still references MapLibre assets");
if (!indexHtml.includes('src="/vendor/leaflet.js?v=1.9.4"')) errors.push("Home is missing local Leaflet browser bundle");
if (!indexHtml.includes('type="module" src="/assets/app.js?v=21"')) errors.push("Home is missing versioned module app script");
if (!indexHtml.includes('id="rent-max"')) errors.push("Home is missing the 1K rent filter");
if (!indexHtml.includes('id="criteria-list"')) errors.push("Home is missing the criteria guide");
if (!indexHtml.includes('id="route-list"')) errors.push("Home is missing the route filter list");
if (!indexHtml.includes('id="route-match-mode"')) errors.push("Home is missing the route match mode");
if (!appSource.includes('from "/assets/data.js?v=21"')) errors.push("App is missing the versioned data module import");
if (appSource.includes('fetch("/assets/route-geometry')) errors.push("Route geometry must not be a required external fetch");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`OK: ${stations.length} stations, ${themePresets.length} lifestyle themes, ${Object.keys(sources).length} licensed photos, ${Object.keys(tagLabels).length} filters, ${routeIds.size} routes.`);
