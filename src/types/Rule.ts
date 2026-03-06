import { RiskLevel } from "./Finding";

export interface Rule {
  id: string;
  type: string;
  pattern: RegExp;
  risk: RiskLevel;
}
