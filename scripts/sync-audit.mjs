import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

export function parseCsv(text) {
  const rows = []; let row = [], field = "", quoted = false;
  text = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"' && !field) quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); if (row.some(Boolean)) rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (quoted) throw new Error("Unclosed CSV quote");
  if (field || row.length) { row.push(field); rows.push(row); }
  const headers = rows.shift();
  if (!headers?.length || new Set(headers).size !== headers.length) throw new Error("Invalid CSV header");
  return rows.map((values) => {
    if (values.length !== headers.length) throw new Error("CSV column mismatch");
    return Object.fromEntries(headers.map((key, i) => [key, values[i]]));
  });
}

export function syncAudit(root) {
  const dir = path.join(root, "research/audit");
  const read = (file) => parseCsv(fs.readFileSync(path.join(dir, file), "utf8"));
  const rows = read("condition_records_merged.csv"), criteria = read("criteria.csv"), rents = read("rent_review.csv");
  const notes = Object.fromEntries(read("public_notes.csv").map((r) => [r.record_id, r.public_text]));
  const stationIds = [...new Set(rows.map((r) => r.station_slug))], conditionIds = criteria.map((r) => r.condition_id);
  if (stationIds.length !== 15 || conditionIds.length !== 18 || rows.length !== 270 || new Set(rows.map((r) => r.record_id)).size !== 270) throw new Error("Audit must contain exactly 15 × 18 unique records");
  const sources = {}, records = Object.fromEntries(stationIds.map((slug) => [slug, {}]));
  for (const row of rows) {
    if (!conditionIds.includes(row.condition_id) || row.record_id !== `${row.station_slug}::${row.condition_id}`) throw new Error(`Invalid audit record: ${row.record_id}`);
    const confirmed = row.review_status === "確認済み" && ["該当", "非該当"].includes(row.review_judgment), positive = confirmed && row.review_judgment === "該当";
    const urls = [...new Set(row.review_source_urls.split(" | ").filter(Boolean))];
    if (confirmed && (!row.review_checked_at || !urls.length)) throw new Error(`Missing evidence: ${row.record_id}`);
    if (positive && !notes[row.record_id]) throw new Error(`Missing public explanation: ${row.record_id}`);
    const sourceIds = urls.map((url) => {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Invalid evidence URL");
      const id = `src_${createHash("sha256").update(url).digest("hex").slice(0, 16)}`;
      sources[id] = { title: parsed.hostname.replace(/^www\./, ""), url, checkedAt: row.review_checked_at };
      return id;
    });
    records[row.station_slug][row.condition_id] = { value: positive, status: confirmed ? "verified" : "pending", judgment: confirmed ? row.review_judgment : "判断保留", text: notes[row.record_id] || (confirmed ? "調べた候補と経路では、この条件を満たす施設・サービスを確認できませんでした。" : "施設や経路など、判定に必要な情報を確認中です。検索候補には含めていません。"), reviewNote: row.review_reason, sourceIds, checkedAt: row.review_checked_at || null };
  }
  for (const slug of stationIds) if (Object.keys(records[slug]).length !== 18) throw new Error(`Incomplete station: ${slug}`);
  if (rents.length !== 15 || new Set(rents.map((r) => r.station_slug)).size !== 15) throw new Error("Incomplete rent review");
  const rentData = {};
  for (const rent of rents) {
    if (!records[rent.station_slug] || rent.review_status !== "確認済み" || !(Number(rent.rent1k_man_yen) > 0) || !rent.source_url.startsWith("https://") || !rent.checked_at) throw new Error("Invalid rent review");
    rentData[rent.station_slug] = { value: Number(rent.rent1k_man_yen), url: rent.source_url, checkedAt: rent.checked_at, method: rent.method_summary };
  }
  const confirmed = rows.filter((r) => r.review_status === "確認済み" && ["該当", "非該当"].includes(r.review_judgment));
  const summary = { total: rows.length, confirmed: confirmed.length, positive: confirmed.filter((r) => r.review_judgment === "該当").length, negative: confirmed.filter((r) => r.review_judgment === "非該当").length, pending: rows.length - confirmed.length };
  const exports = { AUDIT_SOURCES: sources, AUDIT_RECORDS: records, AUDIT_RENTS: rentData, AUDIT_CRITERIA: Object.fromEntries(criteria.map((r) => [r.condition_id, r.current_criterion])), AUDIT_SUMMARY: summary };
  fs.writeFileSync(path.join(root, "public/assets/audit-data.js"), "// Generated from research/audit CSVs by scripts/sync-audit.mjs. Do not edit.\n" + Object.entries(exports).map(([key, value]) => `export const ${key} = ${JSON.stringify(value, null, 2)};`).join("\n") + "\n");
  return summary;
}
