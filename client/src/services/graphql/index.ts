import { ApolloClient, InMemoryCache, NormalizedCacheObject } from "@apollo/client";

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

const createApolloClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
  credentials: "include"
});

export const initializeApollo = () => {

    if (typeof window === "undefined") {
        return createApolloClient;
    }

    if (!apolloClient) {
        apolloClient = createApolloClient;
    }

    return apolloClient;

}