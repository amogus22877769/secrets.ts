// Application configuration

// AWS Config (HIGH - regex detector)
export const awsConfig = {
  accessKeyId: "AKIAIOSFODNN7EXAMPLE",
  secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  region: "us-east-1",
};

// Generic API key (MEDIUM - regex detector)
const api_key = "sk-abcdefghijklmnop1234";
const apikey: string = "my-service-key-abc123def456";

// Keyword matches (MEDIUM - keyword detector)
const password = "admin12345678";
const client_secret = "oauth-client-secret-value";
const private_key = "rsa-private-key-data-here";

// High entropy strings (LOW - entropy detector)
const encryptionSalt = "Nq7rBv2xMw9pZd5kLe3yFh8uJt4sCi6o";
const sessionKey = "Qm5nXa1vDg8fPb3hRk7wEj9cYz2lTo6i";

export default {
  awsConfig,
  api_key,
  password,
  client_secret,
  encryptionSalt,
};
