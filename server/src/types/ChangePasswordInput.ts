import { Field, InputType } from "type-graphql";

@InputType()
export class IChangePasswordInput {
    @Field()
    newPassword: string;
}