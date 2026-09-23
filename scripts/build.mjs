import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ATLAS_DATA } from "../public/assets/data.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "node_modules", "leaflet", "dist");
const destination = path.join(root, "public", "vendor");

// 上書き展開された古い配布物が公開対象に残らないよう、廃止済みアセットを除去する。
for (const staleAsset of ["assets/revision.css", "assets/interface-v31.css", "assets/interface-v32.css"]) {
  fs.rmSync(path.join(root, "public", staleAsset), { force: true });
}

fs.mkdirSync(destination, { recursive: true });
for (const file of ["maplibre-gl.mjs", "maplibre-gl.js", "maplibre-gl-csp.js", "maplibre-gl-csp-worker.js", "maplibre-gl.css"]) {
  fs.rmSync(path.join(destination, file), { force: true });
}
for (const file of ["leaflet.js", "leaflet.css"]) {
  fs.copyFileSync(path.join(source, file), path.join(destination, file));
}

const templates = path.join(root, "templates");
const writePage = (relativePath, html) => {
  const output = path.join(root, "public", relativePath, "index.html");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, html);
};

const stationTemplate = fs.readFileSync(path.join(templates, "station.html"), "utf8");
for (const station of ATLAS_DATA.stations) {
  writePage(path.join("station", station.slug), stationTemplate
    .replaceAll("{{STATION_SLUG}}", station.slug)
    .replaceAll("{{STATION_NAME}}", station.name));
}

writePage("compare", fs.readFileSync(path.join(templates, "compare.html"), "utf8"));
writePage("about", fs.readFileSync(path.join(templates, "about.html"), "utf8"));
writePage("privacy", fs.readFileSync(path.join(templates, "privacy.html"), "utf8"));
writePage("site-policy", fs.readFileSync(path.join(templates, "site-policy.html"), "utf8"));

const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
})[character]);
const homeTemplate = fs.readFileSync(path.join(root, "public", "index.html"), "utf8");
for (const theme of ATLAS_DATA.themePresets) {
  const html = homeTemplate
    .replace("<title>駅まち図譜（仮）｜暮らしの条件から駅を探す</title>", `<title>${escapeHtml(theme.title)}｜駅まち図譜（仮）</title>`)
    .replace('content="通勤時間だけでなく、街の環境や休日の過ごし方から住む駅を探せる南東京の駅検索。"', `content="${escapeHtml(theme.description)}"`)
    .replace('<body data-page="home">', `<body data-page="home" data-theme-id="${escapeHtml(theme.id)}">`);
  writePage(path.join("themes", theme.id), html);
}

for (const staleTheme of ["riverside", "books-culture", "night-life", "family-daily"]) {
  fs.rmSync(path.join(root, "public", "themes", staleTheme), { recursive: true, force: true });
}

for (const legacy of ["station.html", "compare.html", "credits.html", "_redirects"]) {
  fs.rmSync(path.join(root, "public", legacy), { force: true });
}

console.log(`Built ${ATLAS_DATA.stations.length} station pages, ${ATLAS_DATA.themePresets.length} theme pages, and copied Leaflet browser assets.`);
