import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
const root = path.resolve(import.meta.dirname, "..");
function snapshot(directory, prefix = "") {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.join(prefix, entry.name);
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? snapshot(file, relative)
      : [[relative, createHash("sha256").update(fs.readFileSync(file)).digest("hex")]];
  }).sort(([a], [b]) => a.localeCompare(b));
}
const before = snapshot(path.join(root, "public"));
execFileSync(process.execPath, [path.join(root, "scripts/build.mjs")], { cwd: root });
const after = snapshot(path.join(root, "public"));
if (JSON.stringify(before) !== JSON.stringify(after)) throw new Error("Rebuilding changed published bytes without source changes");
console.log(`OK: rebuilding preserves all ${after.length} published file fingerprints.`);
