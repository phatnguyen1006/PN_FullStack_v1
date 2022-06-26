import React from "react";
import NextLink from "next/link";
import { Box, IconButton } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

interface IProps {
    postID: string;
}

const PostActionButton = ({ postID }: IProps) => {
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
            />
        </Box>
    );
};

export default PostActionButton;
