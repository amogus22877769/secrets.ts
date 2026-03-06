import { Finding } from "../types/Finding";
import { LoadedFile } from "../scanner/fileLoader";
import { isHighEntropy } from "../utils/entropy";

const TOKEN_PATTERN = /['"`]([A-Za-z0-9\/+=\-_]{16,})['"`]/g;

export function runEntropyDetector(file: LoadedFile): Finding[] {
  const findings: Finding[] = [];

  for (const line of file.lines) {
    const matches = line.content.matchAll(TOKEN_PATTERN);
    for (const match of matches) {
      const candidate = match[1];
      if (isHighEntropy(candidate)) {
        findings.push({
          filePath: file.filePath,
          line: line.number,
          content: line.content.trim(),
          type: "HIGH_ENTROPY_STRING",
          risk: "LOW",
        });
        break;
      }
    }
  }

  return findings;
}
