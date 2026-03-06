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
