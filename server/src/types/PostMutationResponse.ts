import { Field, ObjectType } from "type-graphql";
import { Post } from "../entities";
import { IMutationResponse, FieldError } from "./index";

@ObjectType({ implements: IMutationResponse })
export class PostMutationResponse implements IMutationResponse {
    code: number
    success: boolean
    message?: string

    @Field({ nullable: true })
    post?: Post

    @Field(_type => [FieldError], { nullable: true })
    errors?: FieldError[]
}