import test from "node:test";
import assert from "node:assert/strict";
import { ATLAS_DATA as data } from "../public/assets/data.js";
import { filterStations, matchesTheme, readSearchState, searchParamsFor } from "../public/assets/search.js";
const filter = (state) => filterStations(data.stations, data.routeLabels, data.themePresets, state);
test("unfiltered search includes all stations", () => assert.equal(filter({}).length, 15));
test("every individual condition returns precisely its tagged stations", () => {
  for (const tag of Object.keys(data.tagLabels)) assert.deepEqual(filter({ tags: [tag] }), data.stations.filter((s) => s.tags.includes(tag)));
});
test("all pairs of conditions obey AND and OR", () => {
  for (const a of Object.keys(data.tagLabels)) for (const b of Object.keys(data.tagLabels)) {
    assert.deepEqual(filter({ tags: [a, b], matchMode: "all" }), data.stations.filter((s) => s.tags.includes(a) && s.tags.includes(b)));
    assert.deepEqual(filter({ tags: [a, b], matchMode: "any" }), data.stations.filter((s) => s.tags.includes(a) || s.tags.includes(b)));
  }
});
test("route pairs obey AND and OR, including nearby stations", () => {
  for (const a of Object.keys(data.routeLabels)) for (const b of Object.keys(data.routeLabels)) {
    assert.deepEqual(filter({ routes: [a, b], routeMode: "all" }), data.stations.filter((s) => s.routes.includes(a) && s.routes.includes(b)));
    assert.deepEqual(filter({ routes: [a, b], routeMode: "any" }), data.stations.filter((s) => s.routes.includes(a) || s.routes.includes(b)));
  }
});
test("theme defaults and combined themes use the common matching rule", () => {
  for (const theme of data.themePresets) assert.deepEqual(filter({ themes: [theme.id] }), data.stations.filter((s) => matchesTheme(s, theme)));
  assert.deepEqual(filter({ themes: ["books", "cycling"] }), data.stations.filter((s) => ["books", "cycling"].every((id) => matchesTheme(s, data.themePresets.find((t) => t.id === id)))));
});
test("rent is an independent AND constraint", () => {
  for (const rentMax of [10.5, 11.5, 12.5]) {
    assert(filter({ tags: ["library", "cinema"], matchMode: "any", rentMax }).every((s) => s.rent1k <= rentMax && (s.tags.includes("library") || s.tags.includes("cinema"))));
  }
});
test("search handles kana and nearby-route names", () => {
  assert.equal(filter({ query: "おおいまち" })[0].slug, "oimachi");
  assert(filter({ query: "浅草線" }).some((s) => s.slug === "togoshiginza"));
});
test("URLs round-trip and an explicitly cleared theme stays cleared", () => {
  const state = { query: "川崎", tags: ["library"], routes: ["jr-nambu"], themes: [], matchMode: "any", routeMode: "all", rentMax: 10.5 };
  assert.deepEqual(readSearchState(searchParamsFor(state), data, { themes: ["cycling"] }), state);
  const cleared = { ...state, routes: [] };
  assert.deepEqual(readSearchState(searchParamsFor(cleared), data, { themes: ["cycling"], routes: ["jr-nambu"] }), cleared);
  assert.deepEqual(readSearchState(new URLSearchParams("tags=bogus&routes=bogus&rent=-1&themes=bogus"), data).tags, []);
});
test("evidence corrections propagate to all entrances", () => {
  assert(filter({ tags: ["cinema"] }).some((s) => s.slug === "oimachi"));
  assert(!filter({ tags: ["cinema"] }).some((s) => s.slug === "musashikosugi"));
  assert(filter({ tags: ["airport"] }).some((s) => s.slug === "musashikoyama"));
});
