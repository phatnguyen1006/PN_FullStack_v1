import { Field, InterfaceType } from "type-graphql";

/** @private {IMutationResponse} */
@InterfaceType()
export abstract class IMutationResponse {
    @Field()
    code: number

    @Field()
    success: boolean

    @Field({ nullable: true })
    message?: string
}