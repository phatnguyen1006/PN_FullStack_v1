import "reflect-metadata";
import express from "express";
import { DataSource } from "typeorm";

// Provider
import { User, Post } from "./entities/index";

require("dotenv").config();
const PORT = process.env.PORT

const main = async () => {
    new DataSource({
        type: "postgres",
        database: "reddit",
        username: process.env.DB_USERNAME_DEV,
        password: process.env.DB_PASSWORD_DEV,
        logging: true,
        synchronize: true,
        entities: [User, Post]
    }).initialize();

    const app = express();

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

export default main;