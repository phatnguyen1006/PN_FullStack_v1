import { Field, ObjectType } from "type-graphql";
import { User } from "../entities";
import { IMutationResponse, FieldError } from "./index";

@ObjectType({ implements: IMutationResponse })
export class UserMutationResponse implements IMutationResponse {
    code: number
    success: boolean
    message?: string

    @Field({ nullable: true })
    user?: User

    @Field(_type => [FieldError], { nullable: true })
    errors?: FieldError[]
}