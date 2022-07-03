import { Flex, IconButton } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { PostWithUserInfoFragment } from "../generated/graphql";

interface IProps {
    post: PostWithUserInfoFragment
}

const UpvoteSection = ({post}: IProps) => {
    return (
        <Flex direction={"column"} alignItems="center" mr={4}>
            <IconButton icon={<ChevronUpIcon />} aria-label={"upvote"} />
            <IconButton icon={<ChevronDownIcon />} aria-label={"downvote"} />
        </Flex>
    );
};

export default UpvoteSection;
