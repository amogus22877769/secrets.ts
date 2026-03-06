import { Finding } from "../types/Finding";
import { Rule } from "../types/Rule";
import { LoadedFile } from "../scanner/fileLoader";
import { defaultRules } from "../rules/defaultRules";

export function runRegexDetector(file: LoadedFile, rules: Rule[] = defaultRules): Finding[] {
  const findings: Finding[] = [];

  for (const line of file.lines) {
    for (const rule of rules) {
      if (rule.pattern.test(line.content)) {
        findings.push({
          filePath: file.filePath,
          line: line.number,
          content: line.content.trim(),
          type: rule.type,
          risk: rule.risk,
        });
      }
    }
  }

  return findings;
}
