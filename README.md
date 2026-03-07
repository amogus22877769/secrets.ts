# Secret Leak Scanner

A CLI tool that scans source code for accidentally committed secrets — API keys, tokens, passwords, and private keys.

---

## Features

- Regex-based detection for known secret patterns (AWS, GitHub, Stripe, JWT, etc.)
- Keyword detection for suspicious variable assignments (`password`, `api_key`, `token`, etc.)
- Entropy analysis to catch random-looking strings that may be secrets
- Risk classification: `HIGH`, `MEDIUM`, `LOW`
- ESLint-style CLI output with file grouping and colored severity
- Scan summary with per-severity counts
- JSON report output
- Interactive HTML report with summary cards, sortable table, file grouping, dark mode, and search

---

## Requirements

- Node.js 18+
- npm

---

## Installation

```bash
git clone <repo-url>
cd secrets.ts
npm install
npm run build
```

To use the `secret-scanner` command globally:

```bash
npm link
```

---

## Usage

### Basic scan

```bash
secret-scanner scan ./path/to/project
```

Scans all `.ts`, `.js`, `.json`, `.env`, `.yml`, `.yaml` files and prints an ESLint-style report to the terminal.

**Example output:**

```
src/config.ts
  42:1  error    aws access key         secret/aws-access-key
  88:1  warning  keyword match          secret/keyword-match

src/api/client.ts
  15:1  error    github token           secret/github-token

✖ 3 problems (2 errors, 1 warning)

Scan Summary
────────────────────────────────────────
Scan completed in   0.84s
Files scanned:      64
Secrets found:      3

Severity breakdown:
  HIGH       2
  MEDIUM     1
  LOW        0

Data:               reports/report-data.json
HTML report:        reports/security-report.html
```

### JSON output

```bash
secret-scanner scan ./path/to/project --json
```

Prints a JSON report to stdout. Useful for piping into other tools or CI pipelines.

```json
{
  "scannedAt": "2026-03-07T10:00:00.000Z",
  "totalFindings": 3,
  "summary": { "HIGH": 2, "MEDIUM": 1, "LOW": 0 },
  "findings": [
    {
      "filePath": "/project/src/config.ts",
      "line": 42,
      "content": "const AWS_KEY = 'AKIAIOSFODNN7EXAMPLE'",
      "type": "AWS_ACCESS_KEY",
      "risk": "HIGH",
      "recommendation": "Rotate this key immediately and remove it from source code."
    }
  ]
}
```

### Custom rules

```bash
secret-scanner scan ./path/to/project --rules ./my-rules.yml
```

Point to a YAML file with additional regex rules to extend the default rule set.

---

## HTML Report

The scanner generates an interactive HTML report in the `reports/` folder after each scan.

### Setup (one-time)

Build the report UI before using it:

```bash
npm run build:report
```

This compiles the React app into `report-ui/dist/`. After that, every scan automatically copies the built files into `reports/` alongside the JSON data.

### Opening the report

```bash
# After running a scan, open the HTML file directly in a browser:
open reports/security-report.html        # macOS
start reports/security-report.html       # Windows
xdg-open reports/security-report.html   # Linux
```

### Report features

| Feature | Description |
|---|---|
| Summary cards | Total, High, Medium, Low finding counts |
| Sortable table | Click any column header to sort |
| File grouping | Switch to "By File" view to group findings by file path |
| Search | Filter by file path, secret type, or code snippet |
| Dark mode | Toggle in the top-right corner |

> The report reads `report-data.json` from the same folder. Both files must be in the same directory.

---

## Detection Methods

### 1. Regex detector

Matches known secret patterns against every line in every file.

| Rule | Type | Risk |
|---|---|---|
| AWS access key | `AKIA...` | HIGH |
| AWS secret key | 40-char base64 string | HIGH |
| GitHub token | `ghp_...` | HIGH |
| GitHub OAuth token | `gho_...` | HIGH |
| Private key header | `-----BEGIN ... PRIVATE KEY-----` | HIGH |
| JWT token | `eyJ...eyJ...` | HIGH |
| Stripe live key | `sk_live_...` | HIGH |
| SendGrid API key | `SG....` | HIGH |
| Slack token | `xox[baprs]-...` | HIGH |
| Generic API key | `api_key = "..."` | MEDIUM |

### 2. Keyword detector

Flags lines containing suspicious variable names (`password`, `secret`, `token`, `api_key`, `access_token`, `client_secret`, etc.) that also contain an assignment with a non-trivial value.

Risk: `MEDIUM`

### 3. Entropy detector

Detects high-entropy strings (16+ characters) quoted in source code using Shannon entropy analysis. Catches secrets that don't match known patterns.

Risk: `LOW`

---

## Scanned File Types

`.ts` `.js` `.env` `.json` `.yml` `.yaml` and any file whose name starts with `.env` (e.g. `.env.local`, `.env.production`).

The following directories are always skipped: `node_modules`, `dist`, `.git`, `coverage`, `.next`.

---

## Exit Codes

| Code | Meaning |
|---|---|
| `0` | Scan completed, no HIGH risk findings |
| `1` | HIGH risk finding detected (useful for CI to fail the build) |
| `1` | Scan error (file not found, etc.) |

---

## CI Integration

```yaml
# GitHub Actions example
- name: Scan for secrets
  run: |
    npm install
    npm run build
    node dist/cli/index.js scan .
```

The process exits with code `1` if any `HIGH` severity secrets are found, which will fail the CI job automatically.

---

## Project Structure

```
secrets.ts/
├── src/
│   ├── cli/           # CLI entry point (Commander)
│   ├── scanner/       # File discovery and loading
│   ├── detectors/     # Regex, keyword, entropy detectors
│   ├── analysis/      # Risk classification and recommendations
│   ├── rules/         # Default rule definitions
│   ├── report/        # CLI reporter, JSON reporter, summary, HTML copy
│   ├── types/         # Shared TypeScript types
│   └── utils/         # File extension filter, entropy calculator
├── report-ui/         # React + Vite + Tailwind HTML report UI
├── reports/           # Generated output (created at scan time)
│   ├── report-data.json
│   ├── security-report.html
│   └── assets/
└── package.json
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run build` | Compile the CLI TypeScript to `dist/` |
| `npm run build:report` | Install deps and build the React report UI |
| `npm run dev` | Run the CLI directly with ts-node (no build step) |
| `npm start` | Run the compiled CLI |
