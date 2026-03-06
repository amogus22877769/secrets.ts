import chalk from "chalk";
import { Finding } from "../types/Finding";

const riskColor = {
  HIGH: chalk.red.bold,
  MEDIUM: chalk.yellow.bold,
  LOW: chalk.cyan.bold,
};

function printFinding(f: Finding) {
  const risk = riskColor[f.risk];
  console.log(chalk.gray("─".repeat(60)));
  console.log(`${chalk.bold("File:")}  ${chalk.white(f.filePath)}`);
  console.log(`${chalk.bold("Line:")}  ${chalk.white(f.line)}`);
  console.log(`${chalk.bold("Type:")}  ${chalk.white(f.type)}`);
  console.log(`${chalk.bold("Risk:")}  ${risk(f.risk)}`);
  console.log(`${chalk.bold("Code:")}  ${chalk.dim(f.content.slice(0, 120))}`);
  if (f.recommendation) {
    console.log(`${chalk.bold("Fix:")}   ${chalk.green(f.recommendation)}`);
  }
}

function printSummary(findings: Finding[]) {
  const high = findings.filter((f) => f.risk === "HIGH").length;
  const medium = findings.filter((f) => f.risk === "MEDIUM").length;
  const low = findings.filter((f) => f.risk === "LOW").length;

  console.log(chalk.gray("─".repeat(60)));
  console.log(chalk.bold("\nSummary"));
  console.log(`  ${chalk.red.bold("HIGH  ")} ${high}`);
  console.log(`  ${chalk.yellow.bold("MEDIUM")} ${medium}`);
  console.log(`  ${chalk.cyan.bold("LOW   ")} ${low}`);
  console.log(`  ${chalk.white.bold("TOTAL ")} ${findings.length}\n`);
}

export function printReport(findings: Finding[]) {
  if (findings.length === 0) {
    console.log(chalk.green.bold("\nNo secrets found. Looks clean!\n"));
    return;
  }

  console.log(chalk.bold(`\nFound ${findings.length} potential secret(s):\n`));
  for (const f of findings) {
    printFinding(f);
  }
  printSummary(findings);
}
