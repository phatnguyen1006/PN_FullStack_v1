import React from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Box, IconButton } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
    PaginatedPosts,
    useDeletePostMutation,
    useMeQuery,
} from "../generated/graphql";
import { Reference } from "@apollo/client";

interface IProps {
    postID: string;
    postUserID: string;
}

const PostActionButton = ({ postID, postUserID }: IProps) => {
    const router = useRouter();
    const { data: meData } = useMeQuery();

    const [deletePost, _] = useDeletePostMutation();

    const onPostDelete = async (postID: string) => {
        await deletePost({
            variables: { id: postID },
            update(cache, { data }) {
                if (data?.deletePost.success) {
                    cache.modify({
                        fields: {
                            posts(
                                existing: Pick<
                                    PaginatedPosts,
                                    | "__typename"
                                    | "cursor"
                                    | "hasMore"
                                    | "totalCount"
                                > & {
                                    paginatedPosts: Reference[];
                                }
                            ) {
                                const newPostAfterDeletion = {
                                    ...existing,
                                    totalCount: existing.totalCount - 1,
                                    paginatedPosts:
                                        existing.paginatedPosts.filter(
                                            (postRefObj) =>
                                                postRefObj.__ref !==
                                                `Post:${postID}`
                                        ),
                                };

                                return newPostAfterDeletion;
                            },
                        },
                    });
                }
            },
        });

        if (router.route !== "/") router.push("/");
    };

    if (meData?.me?.id !== postUserID) return null;

    return (
        <Box>
            <NextLink href={`/post/edit/${postID}`}>
                <IconButton
                    aria-label={"edit"}
                    icon={<EditIcon />}
                    mr={4}
                    colorScheme="blue"
                />
            </NextLink>
            <IconButton
                aria-label={"delete"}
                icon={<DeleteIcon />}
                colorScheme="red"
                onClick={onPostDelete.bind(this, postID)}
            />
        </Box>
    );
};

export default PostActionButton;
