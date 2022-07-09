import "reflect-metadata";
import { createConnection } from "typeorm";
// Providers
import { User, Post, Upvote } from "../entities";
// constants
import {
    DB_NAME,
    DB_USERNAME_DEV,
    DB_PASSWORD_DEV,
    DB_HOST,
    DB_PORT,
    __prod__,
} from "../constants";
import path from "path";

export const dbORM = async () => {
    return await createConnection({
        type: "postgres",
        ...(__prod__
            ? { url: process.env.DATABASE_URL }
            : {
                  database: DB_NAME,
                  username: DB_USERNAME_DEV,
                  password: DB_PASSWORD_DEV,
              }),
        host: DB_HOST,
        port: DB_PORT,
        logging: true,
        ...(__prod__
            ? {
                  extra: {
                      ssl: {
                          rejectUnauthorized: false,
                      },
                  },
                  ssl: true,
              }
            : {}),
        ...(__prod__ ? {} : { synchronize: true }),
        entities: [User, Post, Upvote],
        migrations: [path.join(__dirname, "../migrations/*")],
    });
};
