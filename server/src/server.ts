import "reflect-metadata";
import express from "express";
import { apolloDB } from "./apolloDB";
import { apolloServerConfiguration } from "./apolloServer";

require("dotenv").config();
const PORT = process.env.PORT || 4000;

const main = async () => {
  await apolloDB();

  const app = express();

  const apolloServer = await apolloServerConfiguration(app);

  app.listen(PORT, () =>
    console.log(
      `Server started on port ${PORT}. GraphQL on localhost:${PORT}${apolloServer.graphqlPath}`
    )
  );
};

export default main;
