import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { buildDataLoaders } from "../utils/dataLoader";
import { Connection } from "typeorm";

export type Context = {
    req: Request & {
        session: Session & Partial<SessionData> & { userID?: number };
    };
    res: Response;
    connection: Connection;
    dataLoaders: ReturnType<typeof buildDataLoaders>;
};
