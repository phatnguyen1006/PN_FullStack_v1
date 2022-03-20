import { AuthenticationError } from "apollo-server-express";

export class ApolloUnAuthorizedError extends AuthenticationError {
    constructor(message = "Not authenticated to perform GraphQL operations") {
        super(message);
        this.message = message;
    }
}