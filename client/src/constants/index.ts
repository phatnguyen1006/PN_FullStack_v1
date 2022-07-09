export const __prod__ = process.env.NODE_ENV === "production";
// Production
const SERVER_URI_PROD = "https://reddit-registry.herokuapp.com/graphql";
const SERVER_URI_DEV = "http://localhost:4000/graphql";
export const SERVER_URI = __prod__ ? SERVER_URI_PROD : SERVER_URI_DEV;
// post limit
export const POST_LIMIT = 2;
