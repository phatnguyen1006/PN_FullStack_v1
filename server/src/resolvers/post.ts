import {
    Arg,
    Ctx,
    FieldResolver,
    ID,
    Int,
    Mutation,
    Query,
    registerEnumType,
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
    VoteType,
} from "../types";
import { Post, Upvote, User } from "../entities";
import { checkAuth } from "../middlewares/graph";
import { LessThan } from "typeorm";
import { UserInputError } from "apollo-server-core";

registerEnumType(VoteType, {
    name: "VoteType",
});

@Resolver((_of) => Post)
export class PostResolver {
    @FieldResolver((_return) => String)
    textSnippet(@Root() root: Post) {
        return root.text.slice(0, 50);
    }

    @FieldResolver((_return) => User)
    async user(
        @Root() root: Post,
        @Ctx() { dataLoaders: { userLoader } }: Context
    ) {
        // return await User.findOne(root.userID);
        return await userLoader.load(root.userID);
    }

    @FieldResolver((_return) => Int)
    async voteType(
        @Root() root: Post,
        @Ctx() { req, dataLoaders: { voteTypeLoader } }: Context
    ) {
        if (!req.session.userID) return 0;
        // const existingVote = await Upvote.findOne({
        //     postID: root.id,
        //     userID: req.session.userID,
        // });

        const existingVote = await voteTypeLoader.load({
            postID: root.id,
            userID: req.session.userID,
        });

        return existingVote ? existingVote.value : 0;
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

                lastPost = await Post.find({
                    order: { createdAt: "ASC" },
                    take: 1,
                });
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

    @Mutation((_return) => PostMutationResponse)
    @UseMiddleware(checkAuth)
    async vote(
        @Arg("postID", (_type) => Int) postID: number,
        @Arg("inputVoteValue", (_type) => VoteType) inputVoteValue: VoteType,
        @Ctx()
        {
            req: {
                session: { userID },
            },
            connection,
        }: Context
    ): Promise<PostMutationResponse> {
        return await connection.transaction(
            async (transactionEntityManager) => {
                // check if post existes
                let post = await transactionEntityManager.findOne(Post, postID);
                if (!post) {
                    throw new UserInputError("Post not found");
                }

                // check if user has voted or not
                const existingVote = await transactionEntityManager.findOne(
                    Upvote,
                    { postID, userID }
                );

                if (existingVote && existingVote.value !== inputVoteValue) {
                    await transactionEntityManager.save(Upvote, {
                        ...existingVote,
                        value: inputVoteValue,
                    });

                    post = await transactionEntityManager.save(Post, {
                        ...post,
                        points: post.points + inputVoteValue * 2,
                    });
                }

                if (!existingVote) {
                    // write to Upvote table
                    const newVote = transactionEntityManager.create(Upvote, {
                        userID,
                        postID,
                        value: inputVoteValue,
                    });

                    await transactionEntityManager.save(newVote); // save to DB

                    post.points = post.points + inputVoteValue;
                    post = await transactionEntityManager.save(post);
                }

                return {
                    code: 200,
                    success: true,
                    message: "Post voted",
                    post: post,
                };
            }
        );
    }
}
