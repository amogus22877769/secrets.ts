import { Finding, RiskLevel } from "../types/Finding";

const HIGH_RISK_TYPES = [
  "AWS_ACCESS_KEY",
  "AWS_SECRET_KEY",
  "GITHUB_TOKEN",
  "GITHUB_OAUTH",
  "PRIVATE_KEY",
  "JWT_TOKEN",
];

const MEDIUM_RISK_TYPES = [
  "GENERIC_API_KEY",
  "KEYWORD_MATCH",
];

function classifyRisk(type: string): RiskLevel {
  if (HIGH_RISK_TYPES.includes(type)) return "HIGH";
  if (MEDIUM_RISK_TYPES.includes(type)) return "MEDIUM";
  return "LOW";
}

export function analyzeRisk(findings: Finding[]): Finding[] {
  return findings.map((f) => ({
    ...f,
    risk: classifyRisk(f.type),
  }));
}

export function summarize(findings: Finding[]) {
  const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const f of findings) {
    counts[f.risk]++;
  }
  return counts;
}
