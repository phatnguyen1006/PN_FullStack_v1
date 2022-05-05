import "reflect-metadata";
import express from "express";
import cors from "cors";
import { dbORM } from "./db_ORM";
import dbMongo from "./db_mongo";
import { apolloServerConfiguration } from "./apolloServer";
import session from "express-session";
// constants
import { COOKIE_NAME, SESSION_SECRET, __prod__ } from "./constants";
import { sendEmail } from "./utils/nodemail";

require("dotenv").config();
const PORT = process.env.PORT || 4000;

const main = async () => {
  await dbORM();
  await dbMongo.connectDB();
  await sendEmail("user@gmail.com", "<b>Hello Phat Nguyen</b>");

  const app = express();

  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
  }));

  // session/cookies
  app.use(session({
    name: COOKIE_NAME,
    store: dbMongo.mongo_store,
    cookie: {
      maxAge: 100 * 60 * 60,  // 1h
      httpOnly: true,         // JS front end cannot access to cookie
      secure: __prod__,       // cookie only work in https
      sameSite: "lax",        // protection against CSRF
    },
    secret: SESSION_SECRET,
    saveUninitialized: false, // dont save empty session, right from the start
    resave: false
  }));

  const apolloServer = await apolloServerConfiguration(app);

  app.listen(PORT, () =>
    console.log(
      `Server started on port ${PORT}. GraphQL on localhost:${PORT}${apolloServer.graphqlPath}`
    )
  );
};

export default main;
