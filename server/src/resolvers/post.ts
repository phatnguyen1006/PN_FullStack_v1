import { Arg, ID, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import {
  PostMutationResponse,
  ICreatePostInput,
  IUpdatePostInput,
} from "../types";
import { Post } from "../entities";
import { checkAuth } from "../middlewares/graph";

@Resolver()
export class PostResolver {
  @Query((_return) => [Post], { nullable: true })
  async post(): Promise<Post[] | null> {
    try {
      return await Post.find();
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
    @Arg("createPostInput") { title, text }: ICreatePostInput
  ): Promise<PostMutationResponse> {
    try {
      const newPost = Post.create({
        title,
        text,
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
    @Arg("updatePostInput") { id, title, text }: IUpdatePostInput
  ): Promise<PostMutationResponse> {
    try {
      const existingPost = await Post.findOne(id);

      if (!existingPost)
        return {
          code: 400,
          success: false,
          message: "Post not found",
        };

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
  ): Promise<PostMutationResponse> {
    try {
      const existingPost = await Post.findOne(id);

      if (!existingPost)
        return {
          code: 400,
          success: false,
          message: "Post not found",
        };

      await Post.delete({ id });

      return {
        code: 200,
        success: true,
        message: "Post deleted successfully"
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
