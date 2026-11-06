const JWTSECRET = process.env.JWTSECRET;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

const ENDPOINT_CONFIG = {
    API_GATEWAY: "aHR0cHM6Ly93d3cuanNvbmtlZXBlci5jb20vYi9PVE5JWQ==",
    HEADER_KEY: "eC1zZWNyZXQta2V5",
    HEADER_VALUE: "Xw=="
};

const SERVICE_CONFIG = {
    AUTH_CREDENTIAL: 'myPassword123',
    ENCRYPTION_METHOD: 'aes-256-cbc',
    SALT_VALUE: 'salt',
    KEY_LENGTH: 32,
    IV_LENGTH: 16,
    CHARSET: 'utf8'
};

module.exports = {
    jwtSecret: JWTSECRET,
    endpointConfig: ENDPOINT_CONFIG,
    serviceConfig: SERVICE_CONFIG
    // mongodburi: 'mongodb://localhost:27071'
};