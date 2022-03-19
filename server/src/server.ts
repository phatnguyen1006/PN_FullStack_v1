import "reflect-metadata";
import express from "express";
import { DataSource } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

// Providers
import { User, Post } from "./entities";
// Resolvers
import { HelloResolver, UserResolver } from "./resolvers";

require("dotenv").config();
const PORT = process.env.PORT || 4000;

const main = async () => {
  new DataSource({
    type: "postgres",
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? "") || 5432,
    logging: true,
    synchronize: true,
    entities: [User, Post],
  }).initialize();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [ HelloResolver, UserResolver ], validate: false }), // register resolvers
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
