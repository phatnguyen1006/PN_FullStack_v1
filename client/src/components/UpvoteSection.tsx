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

enum VoteTypeValues {
    Upvote = 1,
    Downvote = -1,
}

type LoadingVote = "upvote-loading" | "downvote-loading" | "not-loading";

const UpvoteSection = ({ post }: IProps) => {
    const [vote, { loading }] = useVoteMutation();
    const [loadingState, setLoadingState] =
        useState<LoadingVote>("not-loading");

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
                onClick={
                    post.voteType === VoteTypeValues.Upvote
                        ? undefined
                        : upvote.bind(this, post.id)
                }
                isLoading={loading && loadingState === "upvote-loading"}
                colorScheme={
                    post.voteType === VoteTypeValues.Upvote
                        ? "green"
                        : undefined
                }
            />
            {post.points}
            <IconButton
                icon={<ChevronDownIcon />}
                aria-label={"downvote"}
                onClick={
                    post.voteType === VoteTypeValues.Downvote
                        ? undefined
                        : downvote.bind(this, post.id)
                }
                isLoading={loading && loadingState === "downvote-loading"}
                colorScheme={
                    post.voteType === VoteTypeValues.Downvote
                        ? "red"
                        : undefined
                }
            />
        </Flex>
    );
};

export default UpvoteSection;
