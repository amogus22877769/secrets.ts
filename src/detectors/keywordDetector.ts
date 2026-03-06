import { Finding } from "../types/Finding";
import { LoadedFile } from "../scanner/fileLoader";

const SUSPICIOUS_KEYWORDS = [
  "password",
  "passwd",
  "secret",
  "token",
  "apikey",
  "api_key",
  "private_key",
  "auth_token",
  "access_token",
  "client_secret",
];

const ASSIGNMENT_PATTERN = /[:=]\s*['"]?[A-Za-z0-9\-_\/+=@!]{6,}['"]?/;

export function runKeywordDetector(file: LoadedFile): Finding[] {
  const findings: Finding[] = [];

  for (const line of file.lines) {
    const lower = line.content.toLowerCase();

    for (const keyword of SUSPICIOUS_KEYWORDS) {
      if (!lower.includes(keyword)) continue;
      if (!ASSIGNMENT_PATTERN.test(line.content)) continue;

      findings.push({
        filePath: file.filePath,
        line: line.number,
        content: line.content.trim(),
        type: "KEYWORD_MATCH",
        risk: "MEDIUM",
      });
      break;
    }
  }

  return findings;
}
