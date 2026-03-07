import fs from "fs";
import path from "path";
import { Finding } from "../types/Finding";

export interface JsonReport {
  scannedAt: string;
  totalFindings: number;
  summary: { HIGH: number; MEDIUM: number; LOW: number };
  findings: Finding[];
}

export function buildJsonReport(findings: Finding[]): JsonReport {
  const summary = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const f of findings) {
    summary[f.risk]++;
  }

  return {
    scannedAt: new Date().toISOString(),
    totalFindings: findings.length,
    summary,
    findings,
  };
}

export function printJsonReport(findings: Finding[]) {
  const report = buildJsonReport(findings);
  console.log(JSON.stringify(report, null, 2));
}

export const REPORTS_DIR = "reports";
export const REPORT_DATA_PATH = path.join(REPORTS_DIR, "report-data.json");

export function writeJsonReport(findings: Finding[]): string {
  const report = buildJsonReport(findings);
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(REPORT_DATA_PATH, JSON.stringify(report, null, 2), "utf-8");
  return REPORT_DATA_PATH;
}
