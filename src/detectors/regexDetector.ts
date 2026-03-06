import { Finding } from "../types/Finding";
import { Rule } from "../types/Rule";
import { LoadedFile } from "../scanner/fileLoader";

const DEFAULT_RULES: Rule[] = [
  {
    id: "aws-access-key",
    type: "AWS_ACCESS_KEY",
    pattern: /AKIA[0-9A-Z]{16}/,
    risk: "HIGH",
  },
  {
    id: "aws-secret-key",
    type: "AWS_SECRET_KEY",
    pattern: /(?<![A-Za-z0-9])[A-Za-z0-9\/+=]{40}(?![A-Za-z0-9\/+=])/,
    risk: "HIGH",
  },
  {
    id: "github-token",
    type: "GITHUB_TOKEN",
    pattern: /ghp_[A-Za-z0-9]{36}/,
    risk: "HIGH",
  },
  {
    id: "github-oauth",
    type: "GITHUB_OAUTH",
    pattern: /gho_[A-Za-z0-9]{36}/,
    risk: "HIGH",
  },
  {
    id: "private-key",
    type: "PRIVATE_KEY",
    pattern: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    risk: "HIGH",
  },
  {
    id: "generic-api-key",
    type: "GENERIC_API_KEY",
    pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"]?[A-Za-z0-9\-_]{16,}['"]?/i,
    risk: "MEDIUM",
  },
  {
    id: "jwt-token",
    type: "JWT_TOKEN",
    pattern: /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/,
    risk: "HIGH",
  },
];

export function runRegexDetector(file: LoadedFile, rules = DEFAULT_RULES): Finding[] {
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
