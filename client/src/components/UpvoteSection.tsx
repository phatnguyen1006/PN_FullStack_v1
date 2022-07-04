import { useState } from "react";
import { Flex, IconButton } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
    PostWithUserInfoFragment,
    useVoteMutation,
    VoteType,
} from "../generated/graphql";

interface IProps {
    post: PostWithUserInfoFragment;
}

const UpvoteSection = ({ post }: IProps) => {
    const [vote, { loading }] = useVoteMutation();
    const [loadingState, setLoadingState] = useState<
        "upvote-loading" | "downvote-loading" | "not-loading"
    >("not-loading");

    const upvote = async (postID: string) => {
        setLoadingState("upvote-loading");
        await vote({
            variables: {
                inputVoteValue: VoteType.Upvote,
                postID: parseInt(postID),
            },
        });
        setLoadingState("not-loading");
    };

    const downvote = async (postID: string) => {
        setLoadingState("downvote-loading");
        await vote({
            variables: {
                inputVoteValue: VoteType.Downvote,
                postID: parseInt(postID),
            },
        });
        setLoadingState("not-loading");
    };

    return (
        <Flex direction={"column"} alignItems="center" mr={4}>
            <IconButton
                icon={<ChevronUpIcon />}
                aria-label={"upvote"}
                onClick={upvote.bind(this, post.id)}
                isLoading={loading && loadingState === "upvote-loading"}
            />
            {post.points}
            <IconButton
                icon={<ChevronDownIcon />}
                aria-label={"downvote"}
                onClick={downvote.bind(this, post.id)}
                isLoading={loading && loadingState === "downvote-loading"}
            />
        </Flex>
    );
};

export default UpvoteSection;
