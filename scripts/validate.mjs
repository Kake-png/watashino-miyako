import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ATLAS_DATA } from "../public/assets/data.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(projectRoot, "public");
const routeGeometrySource = JSON.parse(fs.readFileSync(path.join(publicRoot, "assets", "route-display-geometry.json"), "utf8"));
const { stations, sources, tagLabels, tagCriteria, filterGroups, themePresets, routeGroups, routeLabels, routeGeometry } = ATLAS_DATA;
const errors = [];
const slugs = new Set();

const wrangler = JSON.parse(fs.readFileSync(path.join(projectRoot, "wrangler.jsonc"), "utf8"));
if (wrangler.name !== "machierabi-annai") errors.push("Wrangler targets the wrong Worker name");
if (wrangler.assets?.directory !== "./public") errors.push("Wrangler must deploy ./public as static assets");
if (wrangler.main) errors.push("Static-only Worker must not define a main script");
if (wrangler.assets?.binding) errors.push("Static-only Worker must not define an assets binding");

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
    if (route.available !== false && !route.mapOnly && !stations.some((station) => station.routes.includes(route.id))) errors.push(`${route.id}: route has no matching station`);
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

for (const file of ["index.html", "compare/index.html", "about/index.html", "privacy/index.html", "site-policy/index.html", "deployment-version.txt", "_headers", "assets/interface-v34.css", "vendor/leaflet.js", "vendor/leaflet.css"]) {
  if (!fs.existsSync(path.join(publicRoot, file))) errors.push(`Missing publish asset: ${file}`);
}

const indexHtml = fs.readFileSync(path.join(publicRoot, "index.html"), "utf8");
const appSource = fs.readFileSync(path.join(publicRoot, "assets", "app.js"), "utf8");
const revisionCss = fs.readFileSync(path.join(publicRoot, "assets", "interface-v34.css"), "utf8");
const cssBraceBalance = [...revisionCss].reduce((balance, character) => balance + (character === "{" ? 1 : character === "}" ? -1 : 0), 0);
if (cssBraceBalance !== 0) errors.push(`Revision CSS has unbalanced braces: ${cssBraceBalance}`);
if (!revisionCss.includes(".search-first .route-drawer { border-bottom: 0; }")) errors.push("Route/condition separator removal is missing");
if (!revisionCss.includes("width: 3px;")) errors.push("Section heading rail is missing");
if (!revisionCss.includes(".search-first .condition-drawer > summary { margin-top: 7px; }")) errors.push("Condition section spacing is missing");
if (indexHtml.includes("unpkg.com/maplibre") || indexHtml.includes("maplibre-gl-csp")) errors.push("Home still references MapLibre assets");
if (!indexHtml.includes('src="/vendor/leaflet.js?v=1.9.4"')) errors.push("Home is missing local Leaflet browser bundle");
if (!indexHtml.includes('href="/assets/interface-v34.css?v=60"')) errors.push("Home is missing the versioned interface stylesheet");
if (!indexHtml.includes('type="module" src="/assets/app.js?v=60"')) errors.push("Home is missing versioned module app script");
if (!indexHtml.includes('id="rent-max"')) errors.push("Home is missing the 1K rent filter");
if (!indexHtml.includes('id="criteria-list"')) errors.push("Home is missing the criteria guide");
if (!indexHtml.includes('id="route-list"')) errors.push("Home is missing the route filter list");
if (!indexHtml.includes('id="route-match-mode"')) errors.push("Home is missing the route match mode");
if (!appSource.includes('from "/assets/data.js?v=59"')) errors.push("App is missing the versioned data module import");
for (const retiredCss of ["revision.css", "interface-v31.css", "interface-v32.css", "interface-v33.css"]) {
  if (fs.existsSync(path.join(publicRoot, "assets", retiredCss))) errors.push(`Retired stylesheet is still present: ${retiredCss}`);
}
if (!revisionCss.includes("/* 2026-09 calm hierarchy: neutral surfaces, two restrained accents. */")) errors.push("Calm hierarchy theme is missing");
if (!revisionCss.includes(".compare-title {\n  border-bottom: 1px solid var(--rule);\n  background: #fff;")) errors.push("Compare title still uses a large color field");
if (!revisionCss.includes(".station-lenses {\n  border-block: 1px solid var(--rule);\n  background: #fff;")) errors.push("Station navigation still uses a large color field");
if (!appSource.includes('map.getPane("tilePane").style.filter')) errors.push("Map is missing the light tile treatment");
if (!appSource.includes('leaflet.LineUtil.simplify')) errors.push("Route display is missing low-zoom simplification");

if (!appSource.includes('Route display fallback')) errors.push("Route display is missing a safe fallback");
if (appSource.includes("const casing =")) errors.push("Route display still draws a separate white casing line");
if (!appSource.includes("layoutRoutes(projected,")) errors.push("Route display is missing local corridor layout");
if (!appSource.includes('from "/assets/route-layout.js?v=59"')) errors.push("Route display is missing versioned fixed display lanes");
if (!appSource.includes("mergeConnectedLines")) errors.push("Route display is missing connected-line merging");

if (appSource.includes('fetch("/assets/route-geometry')) errors.push("Route geometry must not be a required external fetch");

for (const station of stations) {
  for (const tag of Object.keys(tagLabels)) {
    const record = station.evidence?.[tag];
    if (!record || record.value !== station.tags.includes(tag)) errors.push(`${station.slug}/${tag}: evidence disagrees with filter tag`);
    if (record?.status === "verified" && (!record.checkedAt || !record.sourceIds.length)) errors.push(`${station.slug}/${tag}: verified fact is missing provenance`);
    for (const sourceId of record?.sourceIds || []) {
      const source = ATLAS_DATA.factSources[sourceId];
      if (!source || !source.url.startsWith("https://") || !source.checkedAt) errors.push(`${station.slug}/${tag}: invalid source ${sourceId}`);
    }
  }
}

const htmlFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name.endsWith(".html")) htmlFiles.push(target);
  }
}
walk(publicRoot);
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relative = path.relative(publicRoot, file);
  if (/\{\{[A-Z_]+\}\}/.test(html)) errors.push(`${relative}: unexpanded template token`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) errors.push(`${relative}: expected exactly one static h1`);
  if ((html.match(/rel="canonical"/g) || []).length !== 1) errors.push(`${relative}: expected exactly one canonical`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  if (ids.length !== new Set(ids).size) errors.push(`${relative}: duplicate DOM id`);
  for (const match of html.matchAll(/\b(?:src|href)="(\/[^"#?]*)(?:[^\"]*)"/g)) {
    const urlPath = decodeURIComponent(match[1]);
    if (!urlPath) continue;
    const target = path.join(publicRoot, urlPath);
    if (!fs.existsSync(target) && !fs.existsSync(path.join(target, "index.html"))) errors.push(`${relative}: missing local link ${urlPath}`);
  }
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const schema = JSON.parse(match[1]);
      const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
      if (schema.url !== canonical) errors.push(`${relative}: JSON-LD URL does not match canonical`);
    } catch { errors.push(`${relative}: invalid JSON-LD`); }
  }
}
for (const file of ["themes/index.html", "routes/index.html", "stations/index.html", "criteria/index.html", "404.html", "sitemap.xml", "assets/evidence.js", "assets/search.js"]) {
  if (!fs.existsSync(path.join(publicRoot, file))) errors.push(`Missing release asset: ${file}`);
}
const sitemap = fs.readFileSync(path.join(publicRoot, "sitemap.xml"), "utf8");
for (const match of sitemap.matchAll(/<loc>https:\/\/machierabi-annai\.kake-web\.workers\.dev([^<]+)<\/loc>/g)) {
  if (!fs.existsSync(path.join(publicRoot, match[1], "index.html"))) errors.push(`Sitemap points to missing page: ${match[1]}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`OK: ${stations.length} stations, ${themePresets.length} lifestyle themes, ${Object.keys(sources).length} licensed photos, ${Object.keys(tagLabels).length} filters, ${routeIds.size} routes; ${htmlFiles.length} HTML pages and local links checked.`);
