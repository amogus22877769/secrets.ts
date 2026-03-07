import { Command } from "commander";
import ora from "ora";
import { scanFiles } from "../scanner/fileScanner";
import { loadFile } from "../scanner/fileLoader";
import { runRegexDetector } from "../detectors/regexDetector";
import { runKeywordDetector } from "../detectors/keywordDetector";
import { runEntropyDetector } from "../detectors/entropyDetector";
import { analyzeRisk } from "../analysis/riskAnalyzer";
import { attachRecommendations } from "../analysis/recommendationEngine";
import { printReport } from "../reporter/ConsoleReporter";
import { printJsonReport, writeJsonReport } from "../report/jsonReporter";
import { printSummary } from "../report/summary";
import { copyBuiltReport } from "../report/htmlReport";
import { Finding } from "../types/Finding";

const program = new Command();
const FAIL_ON_LEVELS = ["none", "low", "medium", "high"] as const;
type FailOnLevel = (typeof FAIL_ON_LEVELS)[number];
const FAIL_ON_RANK: Record<FailOnLevel, number> = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
};
const RISK_RANK = { LOW: 1, MEDIUM: 2, HIGH: 3 } as const;

function parseFailOnLevel(value: string): FailOnLevel {
  const normalized = value.toLowerCase() as FailOnLevel;
  if (!FAIL_ON_LEVELS.includes(normalized)) {
    throw new Error(`Invalid --fail-on value "${value}". Use: ${FAIL_ON_LEVELS.join(", ")}`);
  }
  return normalized;
}

program
  .name("secret-scanner")
  .description("Scan a project for accidentally committed secrets")
  .version("0.1.0");

program
  .command("scan <path>")
  .description("Scan a directory for secret leaks")
  .option("--json", "output results as JSON")
  .option("--verbose", "show extra detail for each finding")
  .option("--rules <path>", "path to custom rules file")
  .option("--fail-on <level>", "exit with code 1 on findings at or above level: none|low|medium|high", "high")
  .action(async (scanPath, options) => {
    const spinner = ora({ text: `Scanning ${scanPath}...`, stream: process.stderr }).start();
    const startTime = Date.now();

    try {
      const files = await scanFiles(scanPath);
      spinner.text = `Found ${files.length} file(s), analyzing...`;

      const allFindings: Finding[] = [];

      for (const filePath of files) {
        const loaded = loadFile(filePath);
        if (!loaded) continue;

        const findings = [
          ...runRegexDetector(loaded),
          ...runKeywordDetector(loaded),
          ...runEntropyDetector(loaded),
        ];

        allFindings.push(...findings);
      }

      const analyzed = analyzeRisk(allFindings);
      const withRecommendations = attachRecommendations(analyzed);

      const elapsedMs = Date.now() - startTime;
      spinner.stop();

      if (options.json) {
        printJsonReport(withRecommendations);
      } else {
        const reportPath = writeJsonReport(withRecommendations);
        const htmlReportPath = copyBuiltReport() ?? undefined;
        printReport(withRecommendations);
        printSummary({ filesScanned: files.length, findings: withRecommendations, elapsedMs, reportPath, htmlReportPath });
      }

      const failOn = parseFailOnLevel(options.failOn);
      const threshold = FAIL_ON_RANK[failOn];
      const shouldFail =
        threshold > 0 && withRecommendations.some((f) => RISK_RANK[f.risk] >= threshold);
      process.exit(shouldFail ? 1 : 0);
    } catch (err) {
      spinner.fail("Scan failed.");
      console.error(err);
      process.exit(1);
    }
  });

program.parse(process.argv);
