import { Field, ObjectType } from "type-graphql";

/** @private {FieldError} */
@ObjectType()
export class FieldError {
    @Field()
    field: string

    @Field()
    message: string
}