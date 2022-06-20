import React from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const PostActionButton: React.FC = () => {
    return (
        <Box>
            <IconButton aria-label={"edit"} icon={<EditIcon />} mr={4} colorScheme="blue" />
            <IconButton aria-label={"delete"} icon={<DeleteIcon />} colorScheme="red" />
        </Box>
    );
}

export default PostActionButton;