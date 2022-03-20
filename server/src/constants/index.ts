require("dotenv").config();

// cookie
export const COOKIE_NAME = "reddit-cookie";
export const SESSION_SECRET = process.env.SESSION_SECRET as string | string[];
export const __prod__ = process.env.NODE_ENV === "production";

// Mongo
export const DB_MONGO_URI = process.env.DB_MONGO_URI as string;

// Postgres
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = parseInt(process.env.DB_PORT ?? "") as number || 5432;
export const DB_NAME = process.env.DB_NAME;
export const DB_USERNAME_DEV = process.env.DB_USERNAME_DEV;
export const DB_PASSWORD_DEV = process.env.DB_PASSWORD_DEV;