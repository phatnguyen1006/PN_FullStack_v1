import "reflect-metadata";
import { Application } from "express";

import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

// Resolvers
import { HelloResolver, PostResolver, UserResolver } from "../resolvers";
import { Context } from "../types";
import { Connection } from "typeorm";
import { buildDataLoaders } from "../utils/dataLoader";

export const apolloServerConfiguration = async (
    app: Application,
    connection: Connection
) => {
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, UserResolver, PostResolver],
            validate: false,
        }), // register resolvers
        context: ({ req, res }): Context => ({
            req,
            res,
            connection,
            dataLoaders: buildDataLoaders(),
        }),
        // playground for test query, or use the original website
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground({
                settings: {
                    "request.credentials": "include",
                    "editor.reuseHeaders": false,
                },
            }),
        ],
    });

    await apolloServer.start(); // start server before do something

    apolloServer.applyMiddleware({ app, cors: false }); // apply GraphQL/Apollo to stand before server

    return apolloServer;
};
