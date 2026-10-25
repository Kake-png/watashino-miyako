import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { JSDOM, VirtualConsole } from "jsdom";
import { ATLAS_DATA } from "../public/assets/data.js";
import * as search from "../public/assets/search.js";
import { evidenceHtml } from "../public/assets/evidence-view.js";
const publicRoot = path.resolve(import.meta.dirname, "../public");
const app = fs.readFileSync(path.join(publicRoot, "assets/app.js"), "utf8").replace(/^import .*;\n/gm, "");
const leaflet = fs.readFileSync(path.join(publicRoot, "vendor/leaflet.js"), "utf8");
const tick = () => new Promise((resolve) => setTimeout(resolve, 35));

async function openPage(route, { map = true } = {}) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("jsdomError", (error) => errors.push(error.message));
  const dom = new JSDOM(fs.readFileSync(path.join(publicRoot, route, "index.html"), "utf8"), {
    url: `https://atlas.test/${route ? `${route}/` : ""}`, runScripts: "outside-only", pretendToBeVisual: true, virtualConsole
  });
  const window = dom.window;
  window.matchMedia = () => ({ matches: true });
  window.scrollTo = () => {};
  window.ATLAS_DATA = ATLAS_DATA;
  Object.assign(window, search, { evidenceHtml });
  Object.defineProperties(window.HTMLElement.prototype, {
    clientWidth: { get() { return this.id.includes("map") ? 900 : 490; } },
    clientHeight: { get() { return 700; } }
  });
  if (map) {
    window.eval(leaflet);
    window.L.Browser.svg = true;
  }
  window.eval(app);
  await tick();
  assert.deepEqual(errors, [], `${route}: JS errors`);
  return { dom, window, document: window.document };
}

test("home builds every filter, route and station marker", async () => {
  const { dom, document } = await openPage("");
  assert.equal(document.querySelectorAll("[data-tag]").length, 18);
  assert.equal(document.querySelectorAll("[data-route]").length, 20);
  assert.equal(document.querySelectorAll(".station-row").length, 15);
  assert.equal(document.querySelectorAll(".leaflet-marker-icon").length, 15);
  document.querySelector('[data-tag="cinema"]').click();
  await tick();
  assert.equal(document.querySelectorAll(".station-row").length, 4);
  assert.equal(document.querySelectorAll(".leaflet-marker-icon").length, 4);
  dom.window.close();
});

test("all available railway buttons render paths; paired JR routes remain drawn", async () => {
  const { dom, document } = await openPage("");
  for (const button of document.querySelectorAll("[data-route]:not(:disabled)")) {
    button.click();
    assert(document.querySelectorAll(".leaflet-overlay-pane path").length > 0, button.dataset.route);
    button.click();
  }
  document.querySelector('[data-route="jr-keihin-tohoku"]').click();
  const original = [...document.querySelectorAll(".leaflet-overlay-pane path")].map((p) => p.getAttribute("d"));
  document.querySelector('[data-route="jr-shonan-shinjuku"]').click();
  const paired = [...document.querySelectorAll(".leaflet-overlay-pane path")];
  assert(paired.length > original.length);
  assert(original.every((d) => paired.some((p) => p.getAttribute("d") === d)), "First route moved when second route selected");
  assert(paired.every((p) => !/NaN|Infinity/.test(p.getAttribute("d"))));
  dom.window.close();
});

test("each theme entrance initializes correct candidates", async () => {
  for (const theme of ATLAS_DATA.themePresets) {
    const { dom, document } = await openPage(`themes/${theme.id}`, { map: false });
    assert.equal(document.querySelectorAll(".station-row").length, ATLAS_DATA.stations.filter((s) => search.matchesTheme(s, theme)).length);
    document.querySelector(`#perspective-list [data-perspective="${theme.id}"]`).click();
    assert.equal(document.querySelector("#theme-context").hidden, false);
    assert.equal(document.querySelector("#theme-context").textContent, "選択中：なし");
    assert.equal(document.querySelectorAll(".station-row").length, 15);
    assert(dom.window.location.search.includes("themes="));
    dom.window.close();
  }
});

test("route entrances preselect their line and initialize correct candidates", async () => {
  for (const route of ATLAS_DATA.routeGroups.flatMap((g) => g.routes).filter((r) => r.available !== false)) {
    const { dom, document } = await openPage(`routes/${route.id}`, { map: false });
    assert.equal(document.querySelector(`[data-route="${route.id}"]`).getAttribute("aria-pressed"), "true");
    assert.equal(document.querySelectorAll(".station-row").length, ATLAS_DATA.stations.filter((s) => s.routes.includes(route.id)).length);
    dom.window.close();
  }
});

test("all station pages render evidence and comparison actions", async () => {
  for (const station of ATLAS_DATA.stations) {
    const { dom, document } = await openPage(`station/${station.slug}`, { map: false });
    assert.equal(document.querySelectorAll("h1").length, 1);
    assert(document.querySelector("#evidence"));
    const button = document.querySelector("[data-compare-toggle]");
    button.click();
    assert.equal(button.getAttribute("aria-pressed"), "true");
    button.click();
    assert.equal(button.getAttribute("aria-pressed"), "false");
    dom.window.close();
  }
});

test("comparison handles two/three stations and rejects duplicate-only choices", async () => {
  const { dom, document } = await openPage("compare", { map: false });
  assert.equal(document.querySelectorAll(".compare-table thead th").length, 4);
  document.querySelector("#compare-3").value = "";
  document.querySelector("#compare-form").dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));
  assert.equal(document.querySelectorAll(".compare-table thead th").length, 3);
  document.querySelector("#compare-2").value = document.querySelector("#compare-1").value;
  document.querySelector("#compare-form").dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));
  assert(document.querySelector(".compare-warning"));
  dom.window.close();
});

test("without Leaflet the fallback and filters still work", async () => {
  const { dom, document } = await openPage("", { map: false });
  assert(document.querySelector("#map-fallback").classList.contains("is-visible"));
  document.querySelector('[data-tag="cinema"]').click();
  assert.equal(document.querySelectorAll(".station-row").length, 4);
  dom.window.close();
});
