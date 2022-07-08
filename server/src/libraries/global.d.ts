declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: "development" | "production";
    PORT?: string;
    // SECRET
    SESSION_SECRET: string;
    // POSTGRES
    DB_HOST: string;
    DB_PORT: string;
    DB_NAME: string;
    DB_USERNAME_DEV: string;
    DB_PASSWORD_DEV: string;
    DATBASE_URL: string;
    // MONGODB
    DB_URI: string;
    DB_MONGO_URI: string;
    // NODEMAILER
    NODEMAIL_USER: string;
    NODEMAIL_PASSWORD: string;
    // CLIENT
    CORS_ORIGIN_PROD: string;
    CORS_ORIGIN_DEV: string;
    CLIENT_DOMAIN: string;
  }
}
