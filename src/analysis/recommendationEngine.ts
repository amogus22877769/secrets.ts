import { Finding } from "../types/Finding";

const recommendations: Record<string, string> = {
  AWS_ACCESS_KEY: "Rotate this key immediately and move it to environment variables or AWS Secrets Manager.",
  AWS_SECRET_KEY: "Rotate this key immediately and move it to environment variables or AWS Secrets Manager.",
  GITHUB_TOKEN: "Revoke this token on GitHub and use environment variables or a secrets vault instead.",
  GITHUB_OAUTH: "Revoke this token on GitHub and use environment variables or a secrets vault instead.",
  PRIVATE_KEY: "Remove this key from the repository. Store private keys outside of version control.",
  JWT_TOKEN: "Invalidate this token and never hardcode JWTs. Load them from environment variables at runtime.",
  GENERIC_API_KEY: "Move this API key to an environment variable and add it to .gitignore.",
  KEYWORD_MATCH: "Review this line. If it contains a real secret, move it to environment variables.",
  HIGH_ENTROPY_STRING: "Review this string. If it is a secret, move it to environment variables or a secrets manager.",
};

const DEFAULT_RECOMMENDATION =
  "Remove this secret from source code and store it in a secrets manager or environment variable.";

export function attachRecommendations(findings: Finding[]): Finding[] {
  return findings.map((f) => ({
    ...f,
    recommendation: recommendations[f.type] ?? DEFAULT_RECOMMENDATION,
  }));
}
