import fs from "fs";
import path from "path";
import { REPORTS_DIR } from "./jsonReporter";

const DIST_DIR = path.resolve("report-ui", "dist");
const HTML_DEST = path.join(REPORTS_DIR, "security-report.html");

export function copyBuiltReport(): string | null {
  const srcHtml = path.join(DIST_DIR, "index.html");
  if (!fs.existsSync(srcHtml)) return null;

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.copyFileSync(srcHtml, HTML_DEST);

  const srcAssets = path.join(DIST_DIR, "assets");
  if (fs.existsSync(srcAssets)) {
    const destAssets = path.join(REPORTS_DIR, "assets");
    fs.mkdirSync(destAssets, { recursive: true });
    for (const file of fs.readdirSync(srcAssets)) {
      fs.copyFileSync(path.join(srcAssets, file), path.join(destAssets, file));
    }
  }

  return HTML_DEST;
}
