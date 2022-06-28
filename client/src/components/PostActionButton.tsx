import React from "react";
import NextLink from "next/link";
import { Box, IconButton } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface IProps {
    postID: string;
    postUserID: string;
}

const PostActionButton = ({ postID, postUserID }: IProps) => {
    const { data: meData } = useMeQuery();

    const [deletePost, _] = useDeletePostMutation();

    const onPostDelete = async (postID: string) => {
        await deletePost({ variables: { id: postID } });
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
