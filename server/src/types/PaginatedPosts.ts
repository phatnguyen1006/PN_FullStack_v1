import { Post } from "../entities";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PaginatedPosts {
  @Field()
  totalCount!: number;

  @Field((_type) => Date)
  cursor!: Date;

  @Field()
  hasMore!: Boolean;

  @Field((_type) => [Post])
  paginatedPosts!: Post[];
}
