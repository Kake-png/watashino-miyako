import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { ATLAS_DATA as data } from "../public/assets/data.js";
import { parseCsv } from "../scripts/sync-audit.mjs";
import { filterStations } from "../public/assets/search.js";
const publicRoot = new URL("../public/", import.meta.url);

test("night scenery includes public terraces and uses the seven adopted stations", () => {
  assert.equal(data.tagLabels.view, "夜景");
  assert.deepEqual(data.stations.filter(s => s.tags.includes("view")).map(s => s.slug), ["oimachi", "osaki", "gotanda", "jiyugaoka", "kawasaki", "musashikosugi", "yokohama"]);
  assert.match(data.stations.find(s => s.slug === "jiyugaoka").evidence.view.text, /屋上/);
  assert.match(data.stations.find(s => s.slug === "musashikosugi").evidence.view.text, /17時/);
});

test("long cycling routes use the four adopted stations, not ordinary street tours", () => {
  assert.deepEqual(data.stations.filter(s => s.tags.includes("cycle")).map(s => s.slug), ["kamata", "keikyu-kamata", "kawasaki", "musashikosugi"]);
  assert.match(data.tagCriteria.cycle, /一般車道/);
});

test("bookstore and entrance decisions reach search and every reviewed row is classified", () => {
  assert(data.stations.find(s => s.slug === "osaki").tags.includes("large_bookstore"));
  assert(data.stations.find(s => s.slug === "keikyu-kamata").tags.includes("large_bookstore"));
  assert(data.stations.find(s => s.slug === "ookayama").tags.includes("library"));
  for (const slug of ["musashikoyama", "togoshiginza", "nakanobu", "hatanodai", "ookayama", "jiyugaoka"]) assert(!data.stations.find(s => s.slug === slug).tags.includes("large_bookstore"));
  assert.equal(data.auditSummary.positive, 193);
  assert.equal(data.auditSummary.negative, 77);
  assert.equal(data.auditSummary.pending, 0);
});

test("CSV import preserves BOM, Japanese, quoted commas, quotes and embedded newlines", () => {
  assert.deepEqual(parseCsv('\uFEFFid,text\r\na,"図書館,駅前\n入口は""東"""\r\n'), [{ id: "a", text: '図書館,駅前\n入口は"東"' }]);
  assert.throws(() => parseCsv('id,text\na,"unfinished'), /quote/);
  assert.throws(() => parseCsv('id,text\na,b,c'), /column/);
});

test("all 270 reviewed decisions control the public tags; holds never become a negative decision", () => {
  const rows = parseCsv(fs.readFileSync(new URL("../research/audit/condition_records_merged.csv", import.meta.url), "utf8"));
  assert.equal(rows.length, 270);
  for (const row of rows) {
    const station = data.stations.find((s) => s.slug === row.station_slug);
    const expected = row.review_status === "確認済み" && row.review_judgment === "該当";
    assert.equal(station.tags.includes(row.condition_id), expected, row.record_id);
    const evidence = station.evidence[row.condition_id];
    if (row.review_judgment === "判断保留") {
      assert.equal(evidence.status, "pending");
      assert.equal(evidence.judgment, "判断保留");
    }
  }
});

test("cinema has the four reviewed matches, and Yokohama's closed cinema is not an active source", () => {
  const matches = filterStations(data.stations, data.routeLabels, data.themePresets, { tags: ["cinema"] });
  assert.deepEqual(matches.map((s) => s.slug), ["oimachi", "omori", "kawasaki", "yokohama"]);
  const yokohama = data.stations.find((s) => s.slug === "yokohama");
  assert.match(yokohama.evidence.cinema.text, /T・ジョイ横浜/);
  assert(!yokohama.evidence.cinema.sourceIds.some((id) => data.factSources[id].url.includes("movil/access")));
});

test("all 15 rent values have individual 1K sources, method and check date", () => {
  for (const station of data.stations) {
    assert.equal(station.rentStatus, "verified");
    assert.match(station.rentSourceUrl, /^https:\/\/www\.homes\.co\.jp\/chintai\/.*-st\/price\/$/);
    assert.equal(station.rentCheckedAt, "2026-10-17");
    assert.match(station.rentMethod, /独自/);
    assert.match(station.rentMethod, /成約/);
  }
});

test("new access findings reach both specific conditions and line filtering", () => {
  const omori = data.stations.find((s) => s.slug === "omori");
  assert(omori.tags.includes("multi"));
  assert(omori.nearbyRoutes.includes("keikyu-main"));
  const gotanda = data.stations.find((s) => s.slug === "gotanda");
  assert(gotanda.tags.includes("expressway"));
  assert.match(gotanda.evidence.expressway.text, /ETC専用/);
  assert.match(gotanda.evidence.expressway.text, /渋滞を含まない/);
  const musashikoyama = data.stations.find((s) => s.slug === "musashikoyama");
  assert(musashikoyama.tags.includes("late"));
});

test("static station pages include the same reviewed reasons as the live UI", () => {
  for (const station of data.stations) {
    const html = fs.readFileSync(new URL(`station/${station.slug}/index.html`, publicRoot), "utf8");
    for (const tag of station.tags) assert(html.includes(station.evidence[tag].text), `${station.slug}/${tag}`);
    assert(!html.includes("候補には含めています"));
    assert(html.includes(station.rentSourceUrl));
  }
});

test("empty theme pages stay usable but are excluded from search indexing and sitemap", () => {
  const sitemap = fs.readFileSync(new URL("sitemap.xml", publicRoot), "utf8");
  for (const theme of data.themePresets) {
    const candidates = data.stations.filter((station) => theme.tags.some((tag) => station.tags.includes(tag)));
    if (candidates.length) continue;
    const html = fs.readFileSync(new URL(`themes/${theme.id}/index.html`, publicRoot), "utf8");
    assert(html.includes('name="robots" content="noindex,follow"'));
    assert(!sitemap.includes(`/themes/${theme.id}/`));
  }
});
