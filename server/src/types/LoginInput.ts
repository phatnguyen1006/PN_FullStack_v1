import { Field, InputType } from "type-graphql";

@InputType()
export class ILoginInput {
    @Field()
    usernameOrEmail: string

    @Field()
    password: string
}