import "reflect-metadata";
import express from "express";
import { dbORM } from "./db_ORM";
import dbMongo from "./db_mongo";
import { apolloServerConfiguration } from "./apolloServer";
// constants

require("dotenv").config();
const PORT = process.env.PORT || 4000;

const main = async () => {
  await dbORM();

  const app = express();

  // session/cookies
  await dbMongo.connectDB();

  const apolloServer = await apolloServerConfiguration(app);

  app.listen(PORT, () =>
    console.log(
      `Server started on port ${PORT}. GraphQL on localhost:${PORT}${apolloServer.graphqlPath}`
    )
  );
};

export default main;
