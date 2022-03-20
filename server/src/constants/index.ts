require("dotenv").config();

// Mongo
export const DB_MONGO_URI = process.env.DB_MONGO_URI ?? "";

// Postgres
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = parseInt(process.env.DB_PORT ?? "") || 5432;
export const DB_NAME = process.env.DB_NAME;
export const DB_USERNAME_DEV = process.env.DB_USERNAME_DEV;
export const DB_PASSWORD_DEV = process.env.DB_PASSWORD_DEV;