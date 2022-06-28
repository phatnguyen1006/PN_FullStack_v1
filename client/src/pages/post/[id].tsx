import NextLink from "next/link";
import {
    Alert,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Flex,
    Heading,
    Spinner,
} from "@chakra-ui/react";
import { GetServerSideProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { POST_LIMIT } from "../../constants";
import {
    OnePostDocument,
    OnePostQuery,
    PostIdsDocument,
    PostIdsQuery,
    useOnePostQuery,
} from "../../generated/graphql";
import { addApolloState, initializeApollo } from "../../lib/apolloClient";
import PostActionButton from "../../components/PostActionButton";

const limit = POST_LIMIT;

const Post: React.FC = () => {
    const router = useRouter();
    const postID = router.query.id as string;

    const { data, loading, error } = useOnePostQuery({
        variables: { id: postID },
    });

    if (loading)
        return (
            <Layout>
                <Flex justifyContent="center" alignItems="center" minH="100vh">
                    <Spinner />
                </Flex>
            </Layout>
        );

    if (error || !data?.onePost) {
        return (
            <Layout>
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>
                        {error ? error.message : "Post not found"}
                    </AlertTitle>
                </Alert>
                <Box mt={4}>
                    <NextLink href="/">
                        <Button>Back to Home page</Button>
                    </NextLink>
                </Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <Heading mb={4}>{data?.onePost?.title}</Heading>
            <Box mb={4}>{data?.onePost?.text}</Box>
            <Flex justifyContent={"space-between"} alignItems="center">
                <PostActionButton
                    postID={postID}
                    postUserID={`${data.onePost.userID}`}
                />
                <NextLink href="/">
                    <Button>Back to Home page</Button>
                </NextLink>
            </Flex>
        </Layout>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const apolloClient = initializeApollo();

    const { data } = await apolloClient.query<PostIdsQuery>({
        query: PostIdsDocument,
        variables: {
            limit,
        },
    });

    return {
        paths: data.posts!.paginatedPosts.map((post) => ({
            params: { id: `${post.id}` },
        })),
        fallback: "blocking",
    };
};

export const getStaticProps: GetServerSideProps<
    { [key: string]: any },
    { id: string }
> = async ({ params }) => {
    const apolloClient = initializeApollo();

    await apolloClient.query<OnePostQuery>({
        query: OnePostDocument,
        variables: {
            id: params?.id,
        },
    });

    return addApolloState(apolloClient, { props: {} });
};

export default Post;
