import chalk from "chalk";
import { Finding, RiskLevel } from "../types/Finding";

export interface ScanSummary {
  filesScanned: number;
  findings: Finding[];
  elapsedMs: number;
  reportPath?: string;
}

function pad(str: string, len: number): string {
  return str + " ".repeat(Math.max(0, len - str.length));
}

export function printSummary({ filesScanned, findings, elapsedMs, reportPath }: ScanSummary) {
  const elapsed = (elapsedMs / 1000).toFixed(2);

  const counts: Record<RiskLevel, number> = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const f of findings) counts[f.risk]++;

  console.log(chalk.bold("Scan Summary"));
  console.log(chalk.dim("─".repeat(40)));
  console.log(`Scan completed in   ${chalk.cyan(elapsed + "s")}`);
  console.log(`Files scanned:      ${chalk.cyan(String(filesScanned))}`);
  console.log(`Secrets found:      ${findings.length > 0 ? chalk.red.bold(String(findings.length)) : chalk.green("0")}`);

  if (findings.length > 0) {
    console.log();
    console.log(chalk.bold("Severity breakdown:"));
    console.log(`  ${pad("HIGH", 8)} ${chalk.red.bold(String(counts.HIGH))}`);
    console.log(`  ${pad("MEDIUM", 8)} ${chalk.yellow(String(counts.MEDIUM))}`);
    console.log(`  ${pad("LOW", 8)} ${chalk.gray(String(counts.LOW))}`);
  }

  if (reportPath) {
    console.log();
    console.log(`Report generated:   ${chalk.cyan(reportPath)}`);
  }

  console.log();
}
