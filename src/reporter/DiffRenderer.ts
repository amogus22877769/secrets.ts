import chalk from "chalk";

export function renderDiff(before: string, after: string): string {
  return [
    chalk.dim("  Suggested fix:"),
    chalk.red("  - " + before),
    chalk.green("  + " + after),
  ].join("\n");
}
