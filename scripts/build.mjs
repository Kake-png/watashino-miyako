import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ATLAS_DATA } from "../public/assets/data.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "node_modules", "maplibre-gl", "dist");
const destination = path.join(root, "public", "vendor");

fs.mkdirSync(destination, { recursive: true });
for (const file of ["maplibre-gl.mjs", "maplibre-gl.css"]) {
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

const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
})[character]);
const homeTemplate = fs.readFileSync(path.join(root, "public", "index.html"), "utf8");
for (const theme of ATLAS_DATA.themePresets) {
  const story = `<section class="theme-story" aria-labelledby="theme-story-title"><div><p class="section-kicker">A selected point of view</p><h2 id="theme-story-title">${escapeHtml(theme.title)}</h2><p>${escapeHtml(theme.description)}</p></div><ol>${theme.criteria.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol><a href="/#atlas">視点を外して、すべてから探す →</a></section>`;
  const html = homeTemplate
    .replace("<title>駅まち図譜（仮）｜街の特色から住む駅を探す</title>", `<title>${escapeHtml(theme.title)}｜駅まち図譜（仮）</title>`)
    .replace('content="物件ではなく、駅と街の特色から住む場所を探す南東京の生活圏アトラス。"', `content="${escapeHtml(theme.description)}"`)
    .replace('<body data-page="home">', `<body data-page="home" data-theme-id="${escapeHtml(theme.id)}">`)
    .replace("<p class=\"kicker\">Choose a town before a room</p>", "<p class=\"kicker\">A lifestyle lens for the city</p>")
    .replace("<h1>駅から、<br><em>暮らしを選ぶ。</em></h1>", `<h1>${escapeHtml(theme.title)}</h1>`)
    .replace(/<p class="intro-lead">[\s\S]*?<\/p>/, `<p class="intro-lead">${escapeHtml(theme.description)}条件は入口です。地図を開いたあとで、別の条件を足したり、すべて外したりできます。</p>`)
    .replace('<div id="theme-story-slot"></div>', `<div id="theme-story-slot">${story}</div>`);
  writePage(path.join("themes", theme.id), html);
}

for (const legacy of ["station.html", "compare.html", "credits.html", "_redirects"]) {
  fs.rmSync(path.join(root, "public", legacy), { force: true });
}

console.log(`Built ${ATLAS_DATA.stations.length} station pages, ${ATLAS_DATA.themePresets.length} theme pages, and copied MapLibre browser assets.`);
