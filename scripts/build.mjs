import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { syncAudit } from "./sync-audit.mjs";
import { matchesTheme } from "../public/assets/search.js";
import { evidenceHtml } from "../public/assets/evidence-view.js";
import { createHash } from "node:crypto";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
syncAudit(root);
const { ATLAS_DATA } = await import("../public/assets/data.js");
const siteOrigin = (process.env.SITE_ORIGIN || "https://watashino-miyako.kake-web.workers.dev").replace(/\/$/, "");
const originUrl = new URL(siteOrigin);
if (originUrl.protocol !== "https:" || originUrl.pathname !== "/" || originUrl.search || originUrl.hash) throw new Error("SITE_ORIGIN must be a plain HTTPS origin");
const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
})[character]);
const escapeJson = (value) => JSON.stringify(value).replace(/</g, "\\u003c");
const source = path.join(root, "node_modules", "leaflet", "dist");
const destination = path.join(root, "public", "vendor");

// 上書き展開された古い配布物が公開対象に残らないよう、廃止済みアセットを除去する。
for (const staleAsset of ["assets/revision.css", "assets/interface-v31.css", "assets/interface-v32.css", "assets/interface-v33.css"]) {
  fs.rmSync(path.join(root, "public", staleAsset), { force: true });
}

fs.mkdirSync(destination, { recursive: true });
for (const file of ["maplibre-gl.mjs", "maplibre-gl.js", "maplibre-gl-csp.js", "maplibre-gl-csp-worker.js", "maplibre-gl.css"]) {
  fs.rmSync(path.join(destination, file), { force: true });
}
for (const file of ["leaflet.js", "leaflet.css"]) {
  fs.copyFileSync(path.join(source, file), path.join(destination, file));
}
fs.cpSync(path.join(source, "images"), path.join(destination, "images"), { recursive: true });

import { applyMonetization, settings } from './monetization.mjs';
import { enhanceSeo } from "./seo.mjs";

const templates = path.join(root, "templates");
const publishedPages = new Map();
function finalizeHtml(html, relativePath) {
  const url = `${siteOrigin}/${relativePath ? `${relativePath.replaceAll(path.sep, "/")}/` : ""}`;
  html = html.replaceAll("?v=44", "?v=45").replaceAll("?v=40", "?v=45").replaceAll("?v=34", "?v=45")
    .replace('href="/assets/interface-v34.css"', 'href="/assets/interface-v34.css?v=45"')
    .replaceAll("https://tiles.openfreemap.org", "https://tile.openstreetmap.org");
  html = html.replace("制定・最終更新：2026年9月21日", "制定：2026年9月21日・最終更新：2026年10月17日")
    .replace("駅徒歩10分以内・管理費等を除く平均", "HOME’Sの1K参考相場・管理費等を除く")
    .replace("家賃は2026年9月22日に確認。店舗・運行・賃料は変わるため、最終確認は各公式情報で行ってください。", "確認済みの条件だけを検索に使います。根拠と確認状況は各駅ページに掲載しています。");
  if ((html.includes('data-page="home"') || html.includes('data-page="compare"')) && !html.includes("<noscript>")) {
    html = html.replace('<main ', '<noscript><p class="data-note">地図・絞り込み・比較にはJavaScriptが必要です。<a href="/stations/">駅一覧</a>と駅の本文・出典はそのまま読めます。</p></noscript><main ');
  }
  // One consistent navigation and footer on every route.
  html = html.replace(/<nav class="site-nav"[\s\S]*?<\/nav>/, `<nav class="site-nav" id="site-nav" aria-label="主要メニュー"><a href="/"${!relativePath ? ' aria-current="page"' : ""}>地図から探す</a><a href="/themes/"${relativePath.startsWith("themes") ? ' aria-current="page"' : ""}>暮らし別</a><a href="/routes/"${relativePath.startsWith("routes") ? ' aria-current="page"' : ""}>路線別</a><a href="/compare/"${relativePath === "compare" ? ' aria-current="page"' : ""}>駅を比べる <span class="compare-count" data-compare-count>0</span></a></nav>`);
  html = html.replace(/<div class="footer-links">[\s\S]*?<\/div>/, '<div class="footer-links"><a href="/stations/">駅一覧</a><a href="/criteria/">判定基準</a><a href="/about/">運営・出典</a><a href="/site-policy/">サイトポリシー</a><a href="/privacy/">プライバシー</a></div>');
  html = html.replace(/\s*<link rel="canonical"[^>]*>/g, "")
    .replace(/\s*<meta property="og:[^"]+"[^>]*>/g, "");
  const title = html.match(/<title>(.*?)<\/title>/)?.[1] || "街えらび案内所";
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] || "南東京〜横浜の駅を暮らしの条件で探す生活地図帳。";
  // Theme/route pages copy the home shell, never the home's identity.
  if (!relativePath.startsWith("station/")) html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "");
  html = html.replace(/\s*<\/head>/, "\n</head>");
  if (!html.includes('type="application/ld+json"')) {
    const schema = { "@context": "https://schema.org", "@type": relativePath ? "WebPage" : "WebSite", name: title.replaceAll("&amp;", "&"), url };
    html = html.replace("</head>", `<script type="application/ld+json">${escapeJson(schema)}</script>\n</head>`);
  }
  html = html.replace("</head>", `<link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${url}">${relativePath === "compare" ? '<meta name="robots" content="noindex,follow">' : ""}\n</head>`);
  return applyMonetization(enhanceSeo(html, relativePath, url), relativePath, ATLAS_DATA.stations.map(s => s.slug));
}
const writePage = (relativePath, html) => {
  const output = path.join(root, "public", relativePath, "index.html");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, finalizeHtml(html, relativePath));
  publishedPages.set(relativePath, output);
};

const stationTemplate = fs.readFileSync(path.join(templates, "station.html"), "utf8");
const stationSeoHtml = (station) => {
  const themes = ATLAS_DATA.themePresets
    .filter((theme) => matchesTheme(station, theme))
    .slice(0, 4);
  const facts = [
    ["交通", station.notes?.transport || `${station.lines.join("、")}を利用できる駅です。`],
    ["日常", station.notes?.daily || station.summary],
    ["街の確認点", station.notes?.atmosphere || station.cautions?.join("。")]
  ];
  return `<article class="static-seo-content" aria-label="${escapeHtml(station.name)}駅の概要">
    <nav class="breadcrumb" aria-label="パンくず"><a href="/">南東京の駅</a> / <span>${escapeHtml(station.area)}</span> / <strong>${escapeHtml(station.name)}</strong></nav>
    <p class="section-kicker">Station guide</p>
    <h1>${escapeHtml(station.name)}駅</h1>
    <p class="static-seo-lead">${escapeHtml(station.summary)}</p>
    <p class="static-seo-meta">${escapeHtml(station.area)} · ${escapeHtml(station.lines.join(" / "))}</p>
    <section><h2>${escapeHtml(station.name)}駅の特徴</h2><ul>${(station.strengths || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
    <section><h2>住む前に確認したいこと</h2><ul>${(station.cautions || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
    <section><h2>生活条件から見た${escapeHtml(station.name)}駅</h2><dl>${facts.map(([label, copy]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(copy)}</dd></div>`).join("")}</dl></section>
    ${evidenceHtml(station, ATLAS_DATA)}
    <section><h2>写真と撮影時期</h2><div class="photo-walk">${(station.images || []).map((id) => { const photo = ATLAS_DATA.sources[id]; return `<figure class="photo-item"><img src="/${escapeHtml(photo.file)}" alt="${escapeHtml(photo.alt)}" loading="lazy" width="1200" height="900"><figcaption>${escapeHtml(photo.caption)}<small>${escapeHtml(photo.date)}撮影 · ${escapeHtml(photo.author)} · <a href="${escapeHtml(photo.licenseUrl)}">${escapeHtml(photo.license)}</a> · <a href="${escapeHtml(photo.sourceUrl)}">出典</a> · ${escapeHtml(photo.changes)}</small></figcaption></figure>`; }).join("")}</div><p class="data-note">過去の写真は撮影時点の記録です。店舗・建物が現在も同じとは限りません。</p></section>
    ${themes.length ? `<nav class="static-seo-links" aria-label="${escapeHtml(station.name)}駅に関連する条件"><h2>関連する条件</h2>${themes.map((theme) => `<a href="/themes/${encodeURIComponent(theme.id)}/">${escapeHtml(theme.navLabel)}</a>`).join("")}</nav>` : ""}
    <p class="static-seo-note">掲載情報は駅周辺の候補を探すための整理です。家賃・店舗・運行状況は変わるため、契約や訪問の前に各公式情報をご確認ください。</p>
  </article>`;
};
for (const station of ATLAS_DATA.stations) {
  const description = `${station.name}駅周辺の住みやすさ・街の特徴。交通・買い物・休日の条件を出典付きで確認。${station.summary}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${station.name}駅｜街えらび案内所`,
    description,
    url: `${siteOrigin}/station/${station.slug}/`,
    isPartOf: { "@type": "WebSite", name: "街えらび案内所", url: `${siteOrigin}/` },
    breadcrumb: { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "駅を探す", item: `${siteOrigin}/` },
      { "@type": "ListItem", position: 2, name: station.name, item: `${siteOrigin}/station/${station.slug}/` }
    ] }
  };
  writePage(path.join("station", station.slug), stationTemplate
    .replaceAll("{{STATION_SLUG}}", station.slug)
    .replaceAll("{{STATION_NAME}}", station.name)
    .replaceAll("{{STATION_DESCRIPTION}}", escapeHtml(description))
    .replaceAll("{{STATION_CANONICAL}}", `${siteOrigin}/station/${station.slug}/`)
    .replaceAll("{{STATION_JSONLD}}", escapeJson(jsonLd))
    .replace('<div id="station-page"></div>', `<div id="station-page">${stationSeoHtml(station)}</div>`));
}

writePage("compare", fs.readFileSync(path.join(templates, "compare.html"), "utf8"));
writePage("about", fs.readFileSync(path.join(templates, "about.html"), "utf8"));
writePage("privacy", fs.readFileSync(path.join(templates, "privacy.html"), "utf8"));
writePage("site-policy", fs.readFileSync(path.join(templates, "site-policy.html"), "utf8"));

const homeTemplate = fs.readFileSync(path.join(root, "public", "index.html"), "utf8");
const stationLinks = (items) => items.map((station) => `<li><a href="/station/${escapeHtml(station.slug)}/"><strong>${escapeHtml(station.name)}駅</strong><span>${escapeHtml(station.descriptor)}</span></a></li>`).join("");
for (const theme of ATLAS_DATA.themePresets) {
  const candidates = ATLAS_DATA.stations.filter((station) => matchesTheme(station, theme));
  const html = homeTemplate
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(theme.title)}｜街えらび案内所</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeHtml(theme.description)}">`)
    .replace('<link rel="canonical" href="https://watashino-miyako.kake-web.workers.dev/">', `<link rel="canonical" href="${siteOrigin}/themes/${encodeURIComponent(theme.id)}/">`)
    .replace('<meta property="og:url" content="https://watashino-miyako.kake-web.workers.dev/">', `<meta property="og:url" content="${siteOrigin}/themes/${encodeURIComponent(theme.id)}/">`)
    .replace('id="atlas-title">好きなことを、続けやすい街へ。', `id="atlas-title">${escapeHtml(theme.title)}`)
    .replace("<!--THEME_STATIC-->", `<section class="theme-static-copy" aria-labelledby="theme-static-title"><h2 id="theme-static-title">${escapeHtml(theme.title)}：候補と確認点</h2><p>${escapeHtml(theme.description)}</p><p>次のいずれかに該当する駅を表示します：${escapeHtml(theme.criteria.join("、"))}。複数の「求める生活」を選んだ場合は、各テーマの条件をそれぞれ満たす駅に絞ります。</p><ul class="directory-list">${stationLinks(candidates)}</ul><p><a href="/criteria/">具体的な判定基準</a> · <a href="/themes/">暮らし別の一覧</a></p></section>`)
    .replace('<body data-page="home">', `<body data-page="home" data-theme-id="${escapeHtml(theme.id)}">`)
    .replace(/<!--DIRECTORY_START-->[\s\S]*?<!--DIRECTORY_END-->/, "");
  writePage(path.join("themes", theme.id), candidates.length ? html : html.replace("</head>", '<meta name="robots" content="noindex,follow"></head>'));
}

const directoryTemplate = fs.readFileSync(path.join(templates, "directory.html"), "utf8");
const writeDirectory = (relativePath, title, description, content) => writePage(relativePath, directoryTemplate
  .replaceAll("{{TITLE}}", escapeHtml(title)).replaceAll("{{DESCRIPTION}}", escapeHtml(description)).replace("{{CONTENT}}", content));
writeDirectory("themes", "暮らし別に駅を探す", "休日や普段の過ごし方から候補駅を探せます。選んだ後でも、路線や具体的な条件で絞り込めます。", `<div class="entry-grid">${ATLAS_DATA.themePresets.map((theme) => `<a href="/themes/${theme.id}/"><h2>${escapeHtml(theme.navLabel)}</h2><p>${escapeHtml(theme.description)}</p><span>${ATLAS_DATA.stations.filter((station) => matchesTheme(station, theme)).length}駅の候補 →</span></a>`).join("")}</div><p class="data-note">確認済みの条件だけを検索に使います。確認中の条件も残っており、各駅ページと確認表に掲載しています。</p>`);
writeDirectory("stations", "掲載駅一覧", "南東京〜横浜の15駅を掲載しています。交通・買い物・散歩先・夜の帰宅などを同じ項目で確認できます。", `<ul class="directory-list">${stationLinks(ATLAS_DATA.stations)}</ul>`);
writeDirectory("routes", "路線別に駅を探す", "使いたい路線から掲載駅を探せます。徒歩10分以内の近隣駅も含み、駅ページでは直接乗れる路線と分けています。", ATLAS_DATA.routeGroups.map((group) => `<section><h2>${escapeHtml(group.label)}</h2><ul class="route-directory">${group.routes.map((route) => route.available === false ? `<li><span>${escapeHtml(route.label)}（掲載駅なし）</span></li>` : `<li><a href="/routes/${route.id}/"><span class="route-swatch" style="--route-color:${route.color}"></span>${escapeHtml(route.label)}<small>${ATLAS_DATA.stations.filter((station) => station.routes.includes(route.id)).length}駅 →</small></a></li>`).join("")}</ul></section>`).join(""));
for (const route of ATLAS_DATA.routeGroups.flatMap((group) => group.routes).filter((route) => route.available !== false)) {
  const candidates = ATLAS_DATA.stations.filter((station) => station.routes.includes(route.id));
  const title = `${route.label}から住む駅を探す`;
  writePage(path.join("routes", route.id), homeTemplate
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}｜街えらび案内所</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeHtml(route.label)}を使える掲載駅の候補。駅の交通・買い物・休日の条件を比べられます。">`)
    .replace('id="atlas-title">好きなことを、続けやすい街へ。', `id="atlas-title">${escapeHtml(title)}`)
    .replace('<body data-page="home">', `<body data-page="home" data-route-id="${route.id}">`)
    .replace('id="route-drawer"', 'id="route-drawer" open')
    .replace("<!--THEME_STATIC-->", `<section class="theme-static-copy"><h2>${escapeHtml(route.label)}を使える掲載駅</h2><p>路線全体の駅一覧ではなく、このサイトで掲載している候補駅です。駅名が異なる近隣駅から乗る場合も含みます。</p><ul class="directory-list">${stationLinks(candidates)}</ul><p><a href="/routes/">他の路線から探す</a></p></section>`)
    .replace(/<!--DIRECTORY_START-->[\s\S]*?<!--DIRECTORY_END-->/, ""));
}
writeDirectory("criteria", "条件の判定基準", "全18条件の距離・規模・時間の基準です。確認済みの情報だけを検索に使います。", `<section><h2>組み合わせ方</h2><p>具体的な条件は「すべて満たす」が初期設定です。「どれか満たす」に切り替えられます。各暮らしテーマ内はいずれか、複数テーマ・路線・家賃の間はそれぞれANDで組み合わせます。</p></section>${ATLAS_DATA.filterGroups.map((group) => `<section><h2>${escapeHtml(group.label)}</h2><dl class="evidence-list">${group.tags.map((tag) => `<div><dt>${escapeHtml(ATLAS_DATA.tagLabels[tag])}</dt><dd>${escapeHtml(ATLAS_DATA.tagCriteria[tag])}</dd></div>`).join("")}</dl></section>`).join("")}<section><h2>時間と範囲のそろえ方</h2><p>徒歩は施設・運営者の公式案内を優先し、地図サービスが示す出口別の徒歩分数は、そのサービスの目安として記載します。独自に測距する場合は駅の出口から施設入口までの経路を80m/分で切り上げます。住所の代表点までの距離だけで境界上の判定は確定しません。</p><p>自転車は走行200m/分、押し歩き80m/分で計算する距離からの目安です。信号待ち・休憩は含みません。海・港には海に接する河口・運河の公開遊歩道を含め、公園内の人工池だけは含めません。</p><p>高速道路は車で出発できる駅前地点から方向別の入口までの、渋滞を含まない経路推計です。実際の所要時間とは異なります。</p><p>競馬場は開催時間帯の具体便で、乗車・乗換徒歩・接続待ち・最後の徒歩を合計します。最初の乗車前の待ち時間は除きます。すべての時刻で同じ時間とは限りません。</p></section><section><h2>確認済み・条件外・確認待ち</h2><p>対象・規模・アクセスなどがそろって確認できた「該当」だけを検索に含めます。条件外と確認待ちは別に記録し、各駅ページでも区別します。確認待ちを施設が存在しないという判断に置き換えません。</p><p><a href="/data-status/">15駅×18条件の確認状況</a></p></section><section><h2>1K家賃の目安</h2><p>2026年10月17日に、LIFULL HOME’Sの各駅「家賃相場」ページの1K欄を確認しました。駅徒歩10分以内の賃貸物件の平均賃料（管理費・駐車場代等を除く）を軸に、同社の過去データと独自ロジックで算出した参考値です。単純平均を当サイトで再集計した値や、実際の成約額ではありません。</p><p>個別の出典は各駅ページと比較表に掲載しています。築年数・面積・出口・物件の状況で賃料は変わるため、この額以下の物件が必ず見つかるという意味ではありません。</p></section>`);
const conditionIds = Object.keys(ATLAS_DATA.tagLabels);
const summary = ATLAS_DATA.auditSummary;
writeDirectory("data-status", "条件データの確認状況", `${summary.total}件のうち${summary.confirmed}件を判定、${summary.pending}件を確認中です。家賃は全15駅の出典を確認しました。`, `<p>○：条件に該当　—：調べた範囲で条件外　確認中：判定に必要な情報が不足。各駅名から根拠と出典を確認できます。</p><div class="audit-table-wrap" tabindex="0" role="region" aria-label="駅と条件の確認表。横にスクロールできます"><table class="audit-table"><thead><tr><th scope="col">駅</th>${conditionIds.map((tag) => `<th scope="col">${escapeHtml(ATLAS_DATA.tagLabels[tag])}</th>`).join("")}</tr></thead><tbody>${ATLAS_DATA.stations.map((station) => `<tr><th scope="row"><a href="/station/${station.slug}/#evidence">${escapeHtml(station.name)}</a></th>${conditionIds.map((tag) => { const record = station.evidence[tag]; const label = record.status === "pending" ? "確認中" : record.value ? "該当" : "調査範囲で条件外"; return `<td><span class="audit-state ${record.status === "pending" ? "is-pending" : record.value ? "is-positive" : "is-negative"}" aria-label="${escapeHtml(label)}">${record.status === "pending" ? "確認中" : record.value ? "○" : "—"}</span></td>`; }).join("")}</tr>`).join("")}</tbody></table></div><p>「調べた範囲で条件外」は、施設や経路の完全な不存在を意味しません。未確認の候補を検索結果に混ぜないため、以前と候補数が変わる場合があります。</p>`);

// The home retains these markers; generated content is replaced, not appended.
const entryLinks = `<nav class="entry-links" aria-label="他の探し方"><a href="/themes/">暮らし別に探す</a><a href="/routes/">路線別に探す</a><a href="/stations/">駅名から探す</a></nav>`;
let home = homeTemplate.replace(/<!--ENTRY_START-->[\s\S]*?<!--ENTRY_END-->/, `<!--ENTRY_START-->${entryLinks}<!--ENTRY_END-->`)
  .replace(/<!--DIRECTORY_START-->[\s\S]*?<!--DIRECTORY_END-->/, `<!--DIRECTORY_START--><section class="theme-static-copy"><h2>掲載駅のガイド</h2><ul class="directory-list">${stationLinks(ATLAS_DATA.stations)}</ul></section><!--DIRECTORY_END-->`);
writePage("", home);
const notFound = directoryTemplate.replaceAll("{{TITLE}}", "ページが見つかりません").replaceAll("{{DESCRIPTION}}", "URLを確認するか、地図・暮らし別・駅一覧から探してください。").replace("{{CONTENT}}", '<p><a class="button" href="/">地図から探す</a> <a href="/stations/">駅一覧へ</a></p>');
fs.writeFileSync(path.join(root, "public", "404.html"), finalizeHtml(notFound.replace("</head>", '<meta name="robots" content="noindex,follow"></head>'), "404"));

for (const staleTheme of ["riverside", "books-culture", "night-life", "family-daily"]) {
  fs.rmSync(path.join(root, "public", "themes", staleTheme), { recursive: true, force: true });
}

for (const legacy of ["station.html", "compare.html", "credits.html", "_redirects"]) {
  fs.rmSync(path.join(root, "public", legacy), { force: true });
}

const sitemapPaths = [
  "/", "/themes/", "/routes/", "/stations/", "/criteria/", "/data-status/", "/about/", "/privacy/", "/site-policy/",
  ...ATLAS_DATA.stations.map((station) => `/station/${station.slug}/`),
  ...ATLAS_DATA.themePresets.filter((theme) => ATLAS_DATA.stations.some((station) => matchesTheme(station, theme))).map((theme) => `/themes/${theme.id}/`),
  ...ATLAS_DATA.routeGroups.flatMap((group) => group.routes.filter((route) => route.available !== false).map((route) => `/routes/${route.id}/`))
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths.map((url) => `  <url><loc>${siteOrigin}${url}</loc></url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(root, "public", "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(root, "public", "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap.xml\n`);
fs.writeFileSync(path.join(root, "public", "deployment-version.txt"), "ekimachi-zufu-v45\n2026-10-26\n");

const fingerprints = Object.fromEntries(["assets/app.js", "assets/data.js", "assets/evidence.js", "assets/audit-data.js", "assets/evidence-view.js", "assets/search.js", "assets/style.css", "assets/interface-v34.css", "index.html"].map((file) => [file, createHash("sha256").update(fs.readFileSync(path.join(root, "public", file))).digest("hex")]));
fs.writeFileSync(path.join(root, "public", "release.json"), JSON.stringify({ version: "ekimachi-zufu-v45", date: "2026-10-26", stationCount: ATLAS_DATA.stations.length, audit: ATLAS_DATA.auditSummary, fingerprints }, null, 2) + "\n");

console.log(`Built ${ATLAS_DATA.stations.length} station pages, ${ATLAS_DATA.themePresets.length} theme pages, and copied Leaflet browser assets.`);
