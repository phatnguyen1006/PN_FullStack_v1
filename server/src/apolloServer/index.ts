import "reflect-metadata";
import { Application } from "express";

import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

// Resolvers
import { HelloResolver, UserResolver } from "../resolvers";

export const apolloServerConfiguration = async (app: Application) => {
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
          resolvers: [HelloResolver, UserResolver],
          validate: false,
        }), // register resolvers
        // playground for test query, or use the original website
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
      });
    
      await apolloServer.start(); // start server before do something
    
      apolloServer.applyMiddleware({ app, cors: false }); // apply GraphQL/Apollo to stand before server

      return apolloServer;
}