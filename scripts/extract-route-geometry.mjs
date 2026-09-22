import fs from "node:fs";

const sourcePath = process.argv[2];
const outputPath = process.argv[3];
if (!sourcePath || !outputPath) {
  console.error("Usage: node scripts/extract-route-geometry.mjs SOURCE.geojson OUTPUT.js");
  process.exit(1);
}

const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const bbox = { west: 139.54, south: 35.40, east: 139.84, north: 35.72 };
const definitions = {
  "jr-keihin-tohoku": [["東海道線", "東日本旅客鉄道"]],
  "jr-yamanote": [["山手線", "東日本旅客鉄道"]],
  "jr-saikyo": [["山手線", "東日本旅客鉄道"]],
  "jr-shonan-shinjuku": [["山手線", "東日本旅客鉄道"], ["東海道線", "東日本旅客鉄道"]],
  "jr-tokaido": [["東海道線", "東日本旅客鉄道"]],
  "jr-yokosuka": [["東海道線", "東日本旅客鉄道"], ["横須賀線", "東日本旅客鉄道"]],
  "jr-nambu": [["南武線", "東日本旅客鉄道"]],
  "tokyu-oimachi": [["大井町線", "東急電鉄"]],
  "tokyu-ikegami": [["池上線", "東急電鉄"]],
  "tokyu-tamagawa": [["東急多摩川線", "東急電鉄"]],
  "tokyu-meguro": [["目黒線", "東急電鉄"]],
  "tokyu-toyoko": [["東横線", "東急電鉄"]],
  "keikyu-main": [["本線", "京浜急行電鉄"]],
  "keikyu-airport": [["空港線", "京浜急行電鉄"]],
  "toei-asakusa": [["1号線浅草線", "東京都"]],
  rinkai: [["臨海副都心線", "東京臨海高速鉄道"]],
  "sotetsu-main": [["相鉄本線", "相模鉄道"]],
  "yokohama-blue": [["1号線", "横浜市"], ["3号線", "横浜市"]]
};

const coordinateInside = ([lng, lat]) => lng >= bbox.west && lng <= bbox.east && lat >= bbox.south && lat <= bbox.north;
const geometryInside = (geometry) => {
  const lines = geometry.type === "MultiLineString" ? geometry.coordinates : [geometry.coordinates];
  return lines.some((line) => line.some(coordinateInside));
};

const output = {};
for (const [routeId, matches] of Object.entries(definitions)) {
  output[routeId] = {
    type: "FeatureCollection",
    features: source.features
      .filter((feature) => matches.some(([line, operator]) => feature.properties.N02_003 === line && feature.properties.N02_004 === operator))
      .filter((feature) => geometryInside(feature.geometry))
      .map((feature) => ({ type: "Feature", properties: {}, geometry: feature.geometry }))
  };
}

const header = `// Generated from MLIT National Land Numerical Information N02 railway data (2025, CC BY 4.0).\n`;
fs.writeFileSync(outputPath, `${header}const ROUTE_GEOMETRY = ${JSON.stringify(output)};\n\nexport { ROUTE_GEOMETRY };\n`);
console.log(`Wrote ${Object.keys(output).length} route geometries to ${outputPath}`);
