const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });

function parseBoolean(value, fallback) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

const PORT = Number(process.env.PORT || 3001);
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const REQUEST_BODY_LIMIT = process.env.REQUEST_BODY_LIMIT || '8mb';

const MONGO_TYPE = (process.env.MONGO_TYPE || 'atlas').toLowerCase();
const MONGO_URI = (process.env.MONGO_URI || '').trim();
const MONGO_USER = process.env.MONGO_USER || '';
const MONGO_PASS = process.env.MONGO_PASS || '';
const MONGO_HOST_URI = process.env.MONGO_HOST_URI || '';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'campuscart';
const MONGO_AUTH_SRC = process.env.MONGO_AUTH_SRC || MONGO_DB_NAME;
const MONGO_W = process.env.MONGO_W || 'majority';
const MONGO_HEARTBEAT_MS = Number(process.env.MONGO_HEARTBEAT_MS || 60000);
const MONGO_COLL_CUSTOM_SEQUENCE = process.env.MONGO_COLL_CUSTOM_SEQUENCE || 'customSequence';
const MONGO_REWRITES = parseBoolean(process.env.MONGO_REWRITES, true);

function buildMongoUri() {
  if (MONGO_HOST_URI && MONGO_USER && MONGO_PASS) {
    const protocol = MONGO_TYPE === 'atlas' ? 'mongodb+srv' : 'mongodb';
    const user = encodeURIComponent(MONGO_USER);
    const pass = encodeURIComponent(MONGO_PASS);
    const db = encodeURIComponent(MONGO_DB_NAME);
    const authSource = encodeURIComponent(MONGO_AUTH_SRC);
    const writeConcern = encodeURIComponent(MONGO_W);
    const retryWrites = MONGO_REWRITES ? 'true' : 'false';

    return `${protocol}://${user}:${pass}@${MONGO_HOST_URI}/${db}?authSource=${authSource}&retryWrites=${retryWrites}&w=${writeConcern}`;
  }

  if (MONGO_URI) {
    return MONGO_URI;
  }

  return '';
}

module.exports = {
  PORT,
  CORS_ORIGIN,
  REQUEST_BODY_LIMIT,
  MONGO_DB_NAME,
  MONGO_HEARTBEAT_MS,
  MONGO_COLL_CUSTOM_SEQUENCE,
  buildMongoUri,
};
