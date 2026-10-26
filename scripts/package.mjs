import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
const root = path.resolve(import.meta.dirname, "..");
const entries = ["public", "scripts", "templates", "tests", "docs", "research", ".github", "package.json", "package-lock.json", "wrangler.jsonc", "README.md", "LICENSE", "CONTRIBUTING.md", ".gitignore", ".gitattributes", ".editorconfig"];
const files = [];
function collect(relative) {
  const target = path.join(root, relative);
  if (!fs.existsSync(target)) throw new Error(`Required source missing: ${relative}`);
  if (fs.statSync(target).isDirectory()) for (const entry of fs.readdirSync(target).sort()) collect(path.join(relative, entry));
  else if (!relative.endsWith(".DS_Store")) files.push(relative);
}
entries.forEach(collect);
const manifest = files.map((file) => `${createHash("sha256").update(fs.readFileSync(path.join(root, file))).digest("hex")}  ${file}`).join("\n") + "\n";
fs.writeFileSync(path.join(root, "SOURCE-MANIFEST.sha256"), manifest);
const archive = path.resolve(root, "../ekimachi-zufu-source-v52.zip");
if (fs.existsSync(archive)) throw new Error(`Output exists; choose a fresh release filename: ${archive}`);
const result = spawnSync("zip", ["-q", archive, ...files, "SOURCE-MANIFEST.sha256"], { cwd: root, stdio: "inherit" });
if (result.status !== 0) process.exit(result.status || 1);
console.log(`Packaged ${files.length + 1} files: ${archive}`);
