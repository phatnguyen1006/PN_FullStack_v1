import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { apolloORM } from "./apolloORM";

// Resolvers
import { HelloResolver, UserResolver } from "./resolvers";

require("dotenv").config();
const PORT = process.env.PORT || 4000;

const main = async () => {
  await apolloORM.initialize();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false,
    }), // register resolvers
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await apolloServer.start(); // start server before do something

  apolloServer.applyMiddleware({ app, cors: false }); // apply GraphQL/Apollo to stand before server

  app.listen(PORT, () =>
    console.log(
      `Server started on port ${PORT}. GraphQL on localhost:${PORT}${apolloServer.graphqlPath}`
    )
  );
};

export default main;
