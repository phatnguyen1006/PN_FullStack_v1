import { Field, InputType } from "type-graphql";

@InputType()
export class ICreatePostInput {
    @Field()
    title: string

    @Field()
    text: string
}