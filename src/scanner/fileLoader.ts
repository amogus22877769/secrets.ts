import * as fs from "fs";

export interface LoadedFile {
  filePath: string;
  lines: { number: number; content: string }[];
}

export function loadFile(filePath: string): LoadedFile | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const lines = raw.split("\n").map((content, i) => ({
      number: i + 1,
      content,
    }));
    return { filePath, lines };
  } catch {
    return null;
  }
}
