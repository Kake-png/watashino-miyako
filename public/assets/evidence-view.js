import {EVIDENCE_SUMMARIES} from "./evidence-summaries.js?v=54";
const escape = (value = "") => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
export function evidenceHtml(station, data) {
  const verified = station.tags;
  const pending = Object.keys(data.tagLabels).filter((tag) => station.evidence[tag].status === "pending");
  const negative = Object.keys(data.tagLabels).filter((tag) => station.evidence[tag].status === "verified" && !station.evidence[tag].value);
  return `<section class="content-section evidence-section" id="evidence"><h2>条件に合う理由・出典</h2>
    ${verified.length ? `<div class="evidence-list compact-evidence">${verified.map((tag) => {
      const record=station.evidence[tag];
      const brief = EVIDENCE_SUMMARIES[`${station.slug}::${tag}`] || record.text.split(/(?<=。)/u)[0];
      const preview = brief.length > 100 ? `${brief.slice(0, 99)}…` : brief;
      return `<div class="condition-reason"><div class="condition-reason-heading"><h3>${escape(data.tagLabels[tag])}</h3><p>${escape(preview)}</p></div><details class="evidence-full evidence-condition"><summary aria-label="${escape(data.tagLabels[tag])}の詳しい理由と出典"><span class="sr-only">詳しい理由と出典</span></summary><div class="evidence-body"><p>${escape(record.text)}</p><p class="evidence-date">確認 ${escape(record.checkedAt)}</p><ul>${record.sourceIds.map(id=>`<li><a href="${escape(data.factSources[id].url)}" rel="external noopener">${escape(data.factSources[id].title)}</a></li>`).join('')}</ul></div></details></div>`;
    }).join('')}</div>` : '<p>条件別の出典は確認中です。</p>'}
    ${negative.length ? `<details class="pending-evidence"><summary>調べた範囲で条件外（${negative.length}件）</summary><dl>${negative.map((tag) => `<div><dt>${escape(data.tagLabels[tag])}</dt><dd>${escape(station.evidence[tag].text)} <small>確認 ${escape(station.evidence[tag].checkedAt)}</small></dd></div>`).join("")}</dl><p>新設・小規模施設までの完全な網羅を保証するものではありません。</p></details>` : ""}
    ${pending.length ? `<details class="pending-evidence"><summary>確認待ちの条件（${pending.length}件）</summary><p>${pending.map((tag) => escape(data.tagLabels[tag])).join("・")}</p><p>施設の規模や入口までの経路などを確認中です。候補に含まれないことは、その施設が存在しないという意味ではありません。</p></details>` : ""}
    <div class="data-note">1K参考相場：<strong>${station.rent1k.toFixed(2)}万円</strong>（${escape(station.rentCheckedAt)}確認）。<a href="${escape(station.rentSourceUrl)}" rel="external noopener">HOME’Sの駅別出典</a> <details class="rent-method"><summary>相場の算出方法</summary><p>${escape(station.rentMethod)}</p></details> · <a href="/criteria/">判定基準</a> · <a href="/data-status/">全駅の確認状況</a></div>
  </section>`;
}
