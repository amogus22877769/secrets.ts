export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export interface Finding {
  filePath: string;
  line: number;
  content: string;
  type: string;
  risk: RiskLevel;
  recommendation?: string;
}
