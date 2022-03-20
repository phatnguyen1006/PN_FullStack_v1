import { Ctx, Query, Resolver } from "type-graphql";
import { Context } from "../types";

@Resolver()
export class HelloResolver {
    @Query(_returns => String)
    hello(
        @Ctx() { req }: Context
    ) {
        console.log(req.session.userID);
        return "Hello World";
    }
}