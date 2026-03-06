import * as path from "path";

export const SUPPORTED_EXTENSIONS = [
  ".ts", ".js", ".env", ".json", ".yml", ".yaml",
];

export function isSupportedFile(filePath: string): boolean {
  const ext = path.extname(filePath);
  const base = path.basename(filePath);
  if (base.startsWith(".env")) return true;
  return SUPPORTED_EXTENSIONS.includes(ext);
}
