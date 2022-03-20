import "reflect-metadata";
import { createConnection } from "typeorm";
// Providers
import { User, Post } from "../entities";
// constants
import {
  DB_NAME,
  DB_USERNAME_DEV,
  DB_PASSWORD_DEV,
  DB_HOST,
  DB_PORT,
} from "../constants";

export const dbORM = async () => {
  await createConnection({
    type: "postgres",
    database: DB_NAME,
    username: DB_USERNAME_DEV,
    password: DB_PASSWORD_DEV,
    host: DB_HOST,
    port: DB_PORT,
    logging: true,
    synchronize: true,
    entities: [User, Post],
  });
};
