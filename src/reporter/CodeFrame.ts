import chalk from "chalk";

const CONTEXT = 2;

export function renderCodeFrame(
  sourceLines: string[],
  targetLine: number, 
  column?: number,
  matchLength?: number,
): string {
  if (sourceLines.length === 0) return "";

  const totalLines = sourceLines.length;
  const numWidth = String(totalLines).length;
  const start = Math.max(1, targetLine - CONTEXT);
  const end = Math.min(totalLines, targetLine + CONTEXT);

  const out: string[] = [];

  for (let ln = start; ln <= end; ln++) {
    const raw = sourceLines[ln - 1] ?? "";
    const num = String(ln).padStart(numWidth, " ");
    const isTarget = ln === targetLine;

    if (isTarget) {
      out.push(
        chalk.cyan(">") + chalk.dim(num) + " " + chalk.dim("│") + " " + chalk.white(raw),
      );

      const prefixWidth = 1 + numWidth + 1 + 1 + 1;
      const indent = column !== undefined
        ? column - 1
        : raw.length - raw.trimStart().length;
      const caretLen = matchLength ?? Math.max(1, raw.trim().length);
      out.push(" ".repeat(prefixWidth + indent) + chalk.red("^".repeat(caretLen)));
    } else {
      out.push(
        " " + chalk.dim(num) + " " + chalk.dim("│") + " " + chalk.dim(raw),
      );
    }
  }

  return out.join("\n");
}
