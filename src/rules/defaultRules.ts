import { Rule } from "../types/Rule";

export const defaultRules: Rule[] = [
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
    id: "jwt-token",
    type: "JWT_TOKEN",
    pattern: /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/,
    risk: "HIGH",
  },
  {
    id: "generic-api-key",
    type: "GENERIC_API_KEY",
    pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"]?[A-Za-z0-9\-_]{16,}['"]?/i,
    risk: "MEDIUM",
  },
  {
    id: "stripe-key",
    type: "STRIPE_KEY",
    pattern: /sk_live_[A-Za-z0-9]{24,}/,
    risk: "HIGH",
  },
  {
    id: "sendgrid-key",
    type: "SENDGRID_KEY",
    pattern: /SG\.[A-Za-z0-9\-_]{22}\.[A-Za-z0-9\-_]{43}/,
    risk: "HIGH",
  },
  {
    id: "slack-token",
    type: "SLACK_TOKEN",
    pattern: /xox[baprs]-[A-Za-z0-9\-]{10,}/,
    risk: "HIGH",
  },
];
