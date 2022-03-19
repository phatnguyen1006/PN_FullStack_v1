import { Field, InputType } from "type-graphql";

@InputType()
export class IRegisterInput {
    @Field()
    username: string

    @Field()
    email: string

    @Field()
    password: string
}