import chalk from "chalk";
import path from "path";
import { Finding, RiskLevel } from "../types/Finding";

const SEVERITY_LABEL: Record<RiskLevel, string> = {
  HIGH: "error",
  MEDIUM: "warning",
  LOW: "info",
};

const SEVERITY_COLOR: Record<RiskLevel, chalk.Chalk> = {
  HIGH: chalk.red,
  MEDIUM: chalk.yellow,
  LOW: chalk.gray,
};

const RULE_PREFIX = "secret/";

function ruleId(type: string): string {
  return RULE_PREFIX + type.toLowerCase().replace(/_/g, "-");
}

function pad(str: string, len: number): string {
  return str + " ".repeat(Math.max(0, len - str.length));
}

function groupByFile(findings: Finding[]): Map<string, Finding[]> {
  const map = new Map<string, Finding[]>();
  for (const f of findings) {
    const group = map.get(f.filePath) ?? [];
    group.push(f);
    map.set(f.filePath, group);
  }
  return map;
}

export function printReport(findings: Finding[], filesScanned = 0, elapsedMs = 0) {
  if (findings.length === 0) {
    console.log(chalk.green.bold("\n✔ No secrets found. Looks clean!\n"));
    return;
  }

  const grouped = groupByFile(findings);
  console.log();

  for (const [filePath, group] of grouped) {
    console.log(chalk.underline(path.relative(process.cwd(), filePath)));

    const maxLineLen = Math.max(...group.map((f) => String(f.line).length));

    for (const f of group) {
      const loc = chalk.dim(pad(String(f.line), maxLineLen) + ":1");
      const sev = SEVERITY_COLOR[f.risk](pad(SEVERITY_LABEL[f.risk], 7));
      const msg = chalk.white(pad(f.type.replace(/_/g, " ").toLowerCase(), 34));
      const rule = chalk.dim(ruleId(f.type));
      console.log(`  ${loc}  ${sev}  ${msg}  ${rule}`);
    }

    console.log();
  }

  const errors = findings.filter((f) => f.risk === "HIGH").length;
  const warnings = findings.filter((f) => f.risk === "MEDIUM").length;
  const infos = findings.filter((f) => f.risk === "LOW").length;

  const total = findings.length;
  const icon = errors > 0 ? chalk.red.bold("✖") : chalk.yellow.bold("⚠");

  const parts: string[] = [];
  if (errors > 0) parts.push(chalk.red(`${errors} error${errors !== 1 ? "s" : ""}`));
  if (warnings > 0) parts.push(chalk.yellow(`${warnings} warning${warnings !== 1 ? "s" : ""}`));
  if (infos > 0) parts.push(chalk.gray(`${infos} info`));

  console.log(`${icon} ${chalk.bold(total + " problem" + (total !== 1 ? "s" : ""))} (${parts.join(", ")})`);

  if (filesScanned > 0 || elapsedMs > 0) {
    const elapsed = (elapsedMs / 1000).toFixed(2);
    console.log(chalk.dim(`\nFiles scanned: ${filesScanned}  ·  Completed in ${elapsed}s`));
  }

  console.log();
}
