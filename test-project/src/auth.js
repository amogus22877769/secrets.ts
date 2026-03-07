// Authentication module

// JWT Token (HIGH - regex detector)
const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// GitHub OAuth (HIGH - regex detector)
const githubOAuthToken = "gho_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890";

// SendGrid (HIGH - regex detector)
const sendgridKey = "SG.aBcDeFgHiJkLmNoPqRsTuVw.xYzAbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMn";

// Slack token (HIGH - regex detector)
const slackAppToken = "xoxa-aBcDeFgHiJkLmNo-PqRsTuVw";

// Keyword matches (MEDIUM - keyword detector)
const access_token = "oauth2-access-token-value";
const auth_token = "session-auth-token-12345";

// High entropy string (LOW - entropy detector)
const hmacSecret = "Tz8kWq3nBm5vRy7pJc2hFd9aGe4xLo1u";

module.exports = { jwtToken, access_token, hmacSecret };
