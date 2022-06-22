import {
  Arg,
  Ctx,
  FieldResolver,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import {
  PostMutationResponse,
  ICreatePostInput,
  IUpdatePostInput,
  Context,
  PaginatedPosts,
} from "../types";
import { Post, User } from "../entities";
import { checkAuth } from "../middlewares/graph";
import { LessThan } from "typeorm";

@Resolver((_of) => Post)
export class PostResolver {
  @FieldResolver((_return) => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @FieldResolver((_return) => User)
  async user(@Root() root: Post) {
    return await User.findOne(root.userID);
  }

  @Query((_return) => PaginatedPosts, { nullable: true })
  async posts(
    @Arg("limit", (_type) => Int) limit: number,
    @Arg("cursor", { nullable: true }) cursor?: string
  ): Promise<PaginatedPosts | null> {
    try {
      const totalPostCount = await Post.count();
      const realLimit = Math.min(10, limit);

      const findOptions: { [key: string]: any } = {
        order: {
          createdAt: "DESC",
        },
        take: realLimit,
      };

      let lastPost: Post[] = [];
      if (cursor) {
        findOptions.where = { createdAt: LessThan(cursor) };

        lastPost = await Post.find({ order: { createdAt: "ASC" }, take: 1 });
      }

      const posts = await Post.find(findOptions);

      return {
        totalCount: totalPostCount,
        cursor: posts[posts.length - 1].createdAt,
        hasMore: cursor
          ? posts[posts.length - 1].createdAt.toString() !==
            lastPost[0].createdAt.toString()
          : posts.length !== totalPostCount,
        paginatedPosts: posts,
      };
    } catch (error) {
      console.log("Failed: ", error);
      return null;
    }
  }

  @Query((_return) => Post, { nullable: true })
  async onePost(
    @Arg("id", (_type) => ID) id: number
  ): Promise<Post | undefined> {
    try {
      return await Post.findOne(id);
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  @Mutation((_return) => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async createPost(
    @Arg("createPostInput") { title, text }: ICreatePostInput,
    @Ctx() { req }: Context
  ): Promise<PostMutationResponse> {
    try {
      const newPost = Post.create({
        title,
        text,
        userID: req.session.userID,
      });

      await newPost.save();

      return {
        code: 200,
        success: true,
        message: "Post created successfully",
        post: newPost,
      };
    } catch (error) {
      console.log("Failed: ", error);
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }

  @Mutation((_return) => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async updatePost(
    @Arg("updatePostInput") { id, title, text }: IUpdatePostInput,
    @Ctx() { req }: Context
  ): Promise<PostMutationResponse> {
    try {
      const existingPost = await Post.findOne(id);

      if (!existingPost)
        return {
          code: 400,
          success: false,
          message: "Post not found",
        };

      if (existingPost.userID !== req.session.userID) {
        return {
          code: 401,
          success: false,
          message: "Unauthorized",
        };
      }

      existingPost.title = title;
      existingPost.text = text;

      await existingPost.save();

      return {
        code: 200,
        success: true,
        message: "Post update successfully",
        post: existingPost,
      };
    } catch (error) {
      console.log("Failed: ", error);
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }

  @Mutation((_return) => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async deletePost(
    @Arg("id", (_type) => ID) id: number,
    @Ctx() { req }: Context
  ): Promise<PostMutationResponse> {
    try {
      const existingPost = await Post.findOne(id);

      if (!existingPost)
        return {
          code: 400,
          success: false,
          message: "Post not found",
        };

      if (existingPost.userID !== req.session.userID) {
        return {
          code: 401,
          success: false,
          message: "Unauthorized",
        };
      }

      await Post.delete({ id });

      return {
        code: 200,
        success: true,
        message: "Post deleted successfully",
      };
    } catch (error) {
      console.log("Failed: ", error);
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }
}
