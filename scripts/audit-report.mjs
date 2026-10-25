import fs from "node:fs";
import path from "node:path";
import { ATLAS_DATA as data } from "../public/assets/data.js";
const root = path.resolve(import.meta.dirname, "..");
const tags = Object.keys(data.tagLabels);
const rows = data.stations.map((station) => ({ station,
  positive: tags.filter((tag) => station.evidence[tag].status === "verified" && station.evidence[tag].value),
  negative: tags.filter((tag) => station.evidence[tag].status === "verified" && !station.evidence[tag].value),
  pending: tags.filter((tag) => station.evidence[tag].status === "pending")
}));
const s = data.auditSummary;
const report = `# 条件データの確認状況

生成基準：v39 / 2026-10-24

全${s.total}件。判定済み${s.confirmed}件（該当${s.positive}、調査範囲で条件外${s.negative}）、確認待ち${s.pending}件。検索には該当${s.positive}件だけを使います。家賃は全15駅の1K相場・個別URL・算出方法を確認済みです。

機能テストの合格と現地の情報の正確さは別です。確認待ちを条件外とは判定しません。

| 駅 | 該当 | 調査範囲で条件外 | 確認待ち |
|---|---:|---:|---:|
${rows.map(({station,positive,negative,pending}) => `| ${station.name} | ${positive.length} | ${negative.length} | ${pending.length} |`).join("\n")}

## 残る確認

${rows.map(({station,pending}) => `- ${station.name}：${pending.map((tag) => data.tagLabels[tag]).join("、") || "なし"}`).join("\n")}

## 更新方法

research/audit/condition_records_merged.csv のレビュー欄を更新し、採用する該当には public_notes.csv に利用者向けの短い説明を追加します。npm run build が270件を検査し、検索用データ・駅本文・確認表・SEOページへ同じ判定を反映します。rawの調査提案とレビュー結果は別の欄を維持します。
`;
fs.writeFileSync(path.join(root,"docs/data-audit.md"),report);
console.log(`Audit: ${s.confirmed} decisions, ${s.positive} matches, ${s.pending} holds; 15 reviewed rents.`);
