import { glob } from "glob";
import * as path from "path";
import { isSupportedFile } from "../utils/fileUtils";

const IGNORED_DIRS = ["node_modules", "dist", ".git", "coverage", ".next"];

export async function scanFiles(targetPath: string): Promise<string[]> {
  const absPath = path.resolve(targetPath);

  const files = await glob("**/*", {
    cwd: absPath,
    nodir: true,
    absolute: true,
    ignore: IGNORED_DIRS.map((d) => `**/${d}/**`),
  });

  return files.filter(isSupportedFile);
}
