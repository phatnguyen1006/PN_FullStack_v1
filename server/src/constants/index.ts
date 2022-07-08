require("dotenv").config();

// cookie
export const COOKIE_NAME = "reddit-cookie";
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const __prod__ = process.env.NODE_ENV === "production";

// Mongo
export const DB_MONGO_URI = process.env.DB_MONGO_URI;

// Postgres
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = parseInt(process.env.DB_PORT) || 5432;
export const DB_NAME = process.env.DB_NAME;
export const DB_USERNAME_DEV = process.env.DB_USERNAME_DEV;
export const DB_PASSWORD_DEV = process.env.DB_PASSWORD_DEV;

// Client
export const CORS_ORIGIN_DEV = process.env.CORS_ORIGIN_DEV;

// Domain
export const domain = __prod__ ? process.env.CLIENT_DOMAIN : undefined;

// COR
export const CORS_ORIGIN = __prod__
    ? process.env.CORS_ORIGIN_PROD
    : process.env.CORS_ORIGIN_DEV;
