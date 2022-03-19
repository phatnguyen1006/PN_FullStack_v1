import "reflect-metadata";
import { DataSource } from "typeorm";
// Providers
import { User, Post } from "../entities";

require("dotenv").config();

export const apolloORM = new DataSource({
  type: "postgres",
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME_DEV,
  password: process.env.DB_PASSWORD_DEV,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? "") || 5432,
  logging: true,
  synchronize: true,
  entities: [User, Post],
});