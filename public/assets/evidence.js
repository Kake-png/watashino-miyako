import { AUDIT_RECORDS, AUDIT_SOURCES, AUDIT_RENTS, AUDIT_CRITERIA, AUDIT_SUMMARY } from "./audit-data.js?v=40";
export const FACT_SOURCES = AUDIT_SOURCES;
export { AUDIT_CRITERIA, AUDIT_SUMMARY };
export function applyEvidence(station, tagLabels) {
  const evidence = AUDIT_RECORDS[station.slug];
  if (!evidence || Object.keys(tagLabels).some((tag) => !evidence[tag])) throw new Error(`Incomplete evidence: ${station.slug}`);
  const rent = AUDIT_RENTS[station.slug];
  if (!rent) throw new Error(`Missing rent: ${station.slug}`);
  return { ...station, evidence,
    tags: Object.keys(tagLabels).filter((tag) => evidence[tag].status === "verified" && evidence[tag].value === true),
    rent1k: rent.value, rentStatus: "verified", rentCheckedAt: rent.checkedAt,
    rentSource: `LIFULL HOME’S・1K参考相場（${rent.checkedAt}確認）`,
    rentSourceUrl: rent.url, rentMethod: rent.method
  };
}
