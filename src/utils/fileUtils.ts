import * as path from "path";

export const SUPPORTED_EXTENSIONS = [
  // JavaScript / TypeScript
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".mts",
  ".cts",
  // JVM / .NET
  ".java",
  ".kt",
  ".kts",
  ".scala",
  ".cs",
  ".vb",
  ".fs",
  ".fsx",
  // Native / systems
  ".c",
  ".h",
  ".cpp",
  ".cc",
  ".cxx",
  ".hpp",
  ".hh",
  ".hxx",
  ".m",
  ".mm",
  ".rs",
  ".go",
  ".swift",
  // Scripting / dynamic
  ".py",
  ".rb",
  ".php",
  ".lua",
  ".pl",
  ".pm",
  ".r",
  ".dart",
  ".elm",
  // Shell / automation
  ".sh",
  ".bash",
  ".zsh",
  ".fish",
  ".ps1",
  ".psm1",
  ".bat",
  ".cmd",
  // Web / markup / query
  ".html",
  ".htm",
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".vue",
  ".svelte",
  ".graphql",
  ".gql",
  // Data / config / IaC
  ".json",
  ".jsonc",
  ".yaml",
  ".yml",
  ".toml",
  ".ini",
  ".cfg",
  ".conf",
  ".properties",
  ".xml",
  ".tf",
  ".tfvars",
  ".hcl",
  ".gradle",
  ".sbt",
  // Docs / misc text
  ".md",
  ".txt",
  ".sql",
];

export const SUPPORTED_FILENAMES = [
  "Dockerfile",
  "dockerfile",
  "docker-compose",
  "docker-compose.yml",
  "docker-compose.yaml",
  "Makefile",
  "Jenkinsfile",
  "Procfile",
  "Gemfile",
  "Rakefile",
  "Vagrantfile",
  "Brewfile",
  "Podfile",
];

export function isSupportedFile(filePath: string): boolean {
  const ext = path.extname(filePath);
  const base = path.basename(filePath);
  if (base.startsWith(".env")) return true;
  if (SUPPORTED_FILENAMES.includes(base)) return true;
  return SUPPORTED_EXTENSIONS.includes(ext.toLowerCase());
}
