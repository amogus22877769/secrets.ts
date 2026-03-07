import { Finding, RiskLevel } from "../types/Finding";

export type DiagnosticSeverity = "error" | "warning" | "info";

export interface DiagnosticFix {
  before: string;
  after: string;
}

export interface Diagnostic {
  filePath: string;
  line: number;
  column?: number;
  matchLength?: number;
  severity: DiagnosticSeverity;
  rule: string;
  message: string;
  sourceLines: string[];
  explanation?: string;
  fix?: DiagnosticFix;
}

const RISK_TO_SEVERITY: Record<RiskLevel, DiagnosticSeverity> = {
  HIGH: "error",
  MEDIUM: "warning",
  LOW: "info",
};

function ruleId(type: string): string {
  return "secret/" + type.toLowerCase().replace(/_/g, "-");
}

function formatMessage(type: string): string {
  const words = type.replace(/_/g, " ").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1) + " detected.";
}

export function findingToDiagnostic(finding: Finding, sourceLines: string[]): Diagnostic {
  return {
    filePath: finding.filePath,
    line: finding.line,
    severity: RISK_TO_SEVERITY[finding.risk],
    rule: ruleId(finding.type),
    message: formatMessage(finding.type),
    sourceLines,
    explanation: finding.recommendation,
  };
}
