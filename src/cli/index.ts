import { Command } from "commander";
import ora from "ora";
import { scanFiles } from "../scanner/fileScanner";
import { loadFile } from "../scanner/fileLoader";
import { runRegexDetector } from "../detectors/regexDetector";
import { runKeywordDetector } from "../detectors/keywordDetector";
import { runEntropyDetector } from "../detectors/entropyDetector";
import { analyzeRisk } from "../analysis/riskAnalyzer";
import { attachRecommendations } from "../analysis/recommendationEngine";
import { printReport } from "../report/cliReporter";
import { printJsonReport, writeJsonReport } from "../report/jsonReporter";
import { printSummary } from "../report/summary";
import { copyBuiltReport } from "../report/htmlReport";
import { Finding } from "../types/Finding";

const program = new Command();

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

      const hasHigh = withRecommendations.some((f) => f.risk === "HIGH");
      process.exit(hasHigh ? 1 : 0);
    } catch (err) {
      spinner.fail("Scan failed.");
      console.error(err);
      process.exit(1);
    }
  });

program.parse(process.argv);
