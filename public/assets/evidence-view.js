const escape = (value = "") => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
export function evidenceHtml(station, data) {
  const verified = station.tags;
  const pending = Object.keys(data.tagLabels).filter((tag) => station.evidence[tag].status === "pending");
  const negative = Object.keys(data.tagLabels).filter((tag) => station.evidence[tag].status === "verified" && !station.evidence[tag].value);
  return `<section class="content-section evidence-section" id="evidence"><h2>条件に合う理由・出典</h2>
    <p>検索に使っている条件と、その根拠です。確認待ちの条件は検索に含めていません。</p>
    ${verified.length ? `<dl class="evidence-list">${verified.map((tag) => {
      const record = station.evidence[tag];
      return `<div><dt>${escape(data.tagLabels[tag])}<small>確認 ${escape(record.checkedAt)}</small></dt><dd><p>${escape(record.text)}</p>${record.sourceIds.map((id) => `<a href="${escape(data.factSources[id].url)}" rel="external noopener">${escape(data.factSources[id].title)}</a>`).join(" / ")}</dd></div>`;
    }).join("")}</dl>` : "<p>この駅の条件別出典は再確認中です。</p>"}
    ${negative.length ? `<details class="pending-evidence"><summary>調べた範囲で条件外（${negative.length}件）</summary><dl>${negative.map((tag) => `<div><dt>${escape(data.tagLabels[tag])}</dt><dd>${escape(station.evidence[tag].text)} <small>確認 ${escape(station.evidence[tag].checkedAt)}</small></dd></div>`).join("")}</dl><p>新設・小規模施設までの完全な網羅を保証するものではありません。</p></details>` : ""}
    ${pending.length ? `<details class="pending-evidence"><summary>確認待ちの条件（${pending.length}件）</summary><p>${pending.map((tag) => escape(data.tagLabels[tag])).join("・")}</p><p>施設の規模や入口までの経路などを確認中です。候補に含まれないことは、その施設が存在しないという意味ではありません。</p></details>` : ""}
    <p class="data-note">1K参考相場：<strong>${station.rent1k.toFixed(2)}万円</strong>（${escape(station.rentCheckedAt)}確認）。${escape(station.rentMethod)} <a href="${escape(station.rentSourceUrl)}" rel="external noopener">HOME’Sの駅別出典</a> · <a href="/criteria/">判定基準</a> · <a href="/data-status/">全駅の確認状況</a></p>
  </section>`;
}
