import { Context } from "../../types";
import { MiddlewareFn } from "type-graphql";
import { ApolloUnAuthorizedError } from "../../helpers/errors";

export const checkAuth: MiddlewareFn<Context> = async (
  { context: { req } },
  next
) => {
  if (!req.session.userID) {
    throw new ApolloUnAuthorizedError();
  }

  return next();
};
