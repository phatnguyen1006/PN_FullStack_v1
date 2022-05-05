import { Field, InputType } from "type-graphql";

@InputType()
export class IForgotPasswordInput {
    @Field()
    email: string
}