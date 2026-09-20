import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "scripts", "commons-photo-manifest.json"), "utf8"));
const outputDirectory = path.join(root, "public", "images");
const metadataPath = path.join(root, "scripts", "commons-photo-metadata.generated.json");
const allowedLicenses = new Set(["CC0", "CC BY 4.0", "CC BY-SA 4.0", "CC BY-SA 3.0", "CC BY 3.0"]);

const plainText = (value = "") => value
  .replace(/<br\s*\/?>/gi, " ")
  .replace(/<[^>]+>/g, "")
  .replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/\s+/g, " ")
  .trim();

fs.mkdirSync(outputDirectory, { recursive: true });
const generated = {};

for (const item of manifest) {
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.search = new URLSearchParams({
    action: "query",
    titles: item.title,
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "1600",
    format: "json",
    origin: "*"
  });
  const response = await fetch(api);
  if (!response.ok) throw new Error(`${item.title}: Commons API ${response.status}`);
  const json = await response.json();
  const page = Object.values(json.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) throw new Error(`${item.title}: image information not found`);

  const meta = info.extmetadata || {};
  const license = plainText(meta.LicenseShortName?.value);
  if (!allowedLicenses.has(license)) throw new Error(`${item.title}: unsupported license ${license}`);

  const imageResponse = await fetch(info.thumburl || info.url);
  if (!imageResponse.ok) throw new Error(`${item.title}: image download ${imageResponse.status}`);
  const temporaryPath = path.join(outputDirectory, `${item.key}.source`);
  fs.writeFileSync(temporaryPath, Buffer.from(await imageResponse.arrayBuffer()));
  const outputPath = path.join(outputDirectory, `${item.key}.webp`);
  execFileSync("convert", [temporaryPath, "-auto-orient", "-resize", "1600x1600>", "-strip", "-quality", "82", outputPath]);
  fs.unlinkSync(temporaryPath);

  generated[item.key] = {
    file: `images/${item.key}.webp`,
    alt: item.alt,
    caption: item.caption,
    date: plainText(meta.DateTimeOriginal?.value || meta.DateTime?.value || "撮影時期不明"),
    author: plainText(meta.Artist?.value || "作者情報は元ページ参照"),
    license,
    licenseUrl: plainText(meta.LicenseUrl?.value),
    sourceUrl: info.descriptionurl,
    changes: "縮小・WebP変換・表示時にトリミング"
  };
  console.log(`Fetched ${item.key}: ${license}`);
}

fs.writeFileSync(metadataPath, `${JSON.stringify(generated, null, 2)}\n`);
console.log(`Wrote ${metadataPath}`);
