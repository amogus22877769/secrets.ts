import chalk from "chalk";
import path from "path";
import * as fs from "fs";
import { Finding } from "../types/Finding";
import { Diagnostic, DiagnosticSeverity, findingToDiagnostic } from "./Diagnostic";
import { renderCodeFrame } from "./CodeFrame";
import { renderDiff } from "./DiffRenderer";

const SEVERITY_ICON: Record<DiagnosticSeverity, string> = {
  error: chalk.red("✖"),
  warning: chalk.yellow("⚠"),
  info: chalk.blue("ℹ"),
};

const STATUS_LABEL: Record<DiagnosticSeverity, string> = {
  error: "ERROR",
  warning: "WARNING",
  info: "INFO",
};

function severityColor(s: DiagnosticSeverity) {
  if (s === "error") return chalk.red;
  if (s === "warning") return chalk.yellow;
  return chalk.blue;
}

function loadSourceLines(filePath: string): string[] {
  try {
    return fs.readFileSync(filePath, "utf-8").split("\n");
  } catch {
    return [];
  }
}

function renderDiagnostic(d: Diagnostic): string {
  const parts: string[] = [];
  const color = severityColor(d.severity);
  const relPath = path.relative(process.cwd(), d.filePath);
  const loc = d.column ? `${d.line}:${d.column}` : `${d.line}`;
  parts.push(
    chalk.gray(relPath + ":" + loc) +
    "  " + chalk.dim(d.rule) +
    "  " + color.bold("[" + STATUS_LABEL[d.severity] + "]"),
  );
  parts.push("");

  parts.push("  " + SEVERITY_ICON[d.severity] + "  " + color(d.message));

  if (d.sourceLines.length > 0) {
    parts.push("");
    const frame = renderCodeFrame(d.sourceLines, d.line, d.column, d.matchLength);
    parts.push(frame.split("\n").map((l) => "  " + l).join("\n"));
  }

  if (d.explanation) {
    parts.push("");
    parts.push("  " + chalk.blue("ℹ") + "  " + chalk.dim(d.explanation));
  }

  if (d.fix) {
    parts.push("");
    parts.push(renderDiff(d.fix.before, d.fix.after));
  }

  return parts.join("\n");
}

export function printReport(findings: Finding[]): void {
  if (findings.length === 0) {
    console.log(chalk.green.bold("\n✔ No secrets found. Looks clean!\n"));
    return;
  }

  const byFile = new Map<string, Finding[]>();
  for (const f of findings) {
    const group = byFile.get(f.filePath) ?? [];
    group.push(f);
    byFile.set(f.filePath, group);
  }

  console.log();

  for (const [filePath, group] of byFile) {
    const relPath = path.relative(process.cwd(), filePath);
    console.log(chalk.underline.bold.white(relPath));
    console.log(chalk.dim("─".repeat(Math.min(relPath.length + 4, 60))));
    console.log();

    const sourceLines = loadSourceLines(filePath);

    for (const finding of group) {
      const diagnostic = findingToDiagnostic(finding, sourceLines);
      console.log(renderDiagnostic(diagnostic));
      console.log();
    }
  }

  const errors = findings.filter((f) => f.risk === "HIGH").length;
  const warnings = findings.filter((f) => f.risk === "MEDIUM").length;
  const infos = findings.filter((f) => f.risk === "LOW").length;
  const total = findings.length;

  const icon = errors > 0 ? chalk.red.bold("✖") : chalk.yellow.bold("⚠");
  const counts: string[] = [];
  if (errors > 0) counts.push(chalk.red(`${errors} error${errors !== 1 ? "s" : ""}`));
  if (warnings > 0) counts.push(chalk.yellow(`${warnings} warning${warnings !== 1 ? "s" : ""}`));
  if (infos > 0) counts.push(chalk.blue(`${infos} info`));

  console.log(chalk.dim("─".repeat(50)));
  console.log(
    `${icon}  ${chalk.bold(total + " problem" + (total !== 1 ? "s" : ""))}  (${counts.join(", ")})`,
  );
  console.log();
}
