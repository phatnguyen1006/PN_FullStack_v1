import NextLink from "next/link";
import {
    IUpdatePostInput,
    useMeQuery,
    useOnePostQuery,
    useUpdatePostMutation,
} from "../../../generated/graphql";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import {
    Alert,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Flex,
    Spinner,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import InputField from "../../../components/InputField";

const PostEdit = () => {
    const router = useRouter();
    const postID = router.query.id as string;

    const { data: meData, loading: meLoading } = useMeQuery();

    const { data: postData, loading: postLoading } = useOnePostQuery({
        variables: { id: postID },
    });

    const [updatePost, _] = useUpdatePostMutation();

    if (meLoading || postLoading)
        return (
            <Layout>
                <Flex justifyContent="center" alignItems="center" minH="100vh">
                    <Spinner />
                </Flex>
            </Layout>
        );

    if (!postData?.onePost)
        return (
            <Layout>
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>Post not found</AlertTitle>
                </Alert>
                <Box mt={4}>
                    <NextLink href="/">
                        <Button>Back to Home page</Button>
                    </NextLink>
                </Box>
            </Layout>
        );

    if (
        !meLoading &&
        !postLoading &&
        meData?.me?.id !== postData?.onePost?.userID.toString()
    )
        return (
            <Layout>
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>Unauthorised</AlertTitle>
                </Alert>
                <Box mt={4}>
                    <NextLink href="/">
                        <Button>Back to Home page</Button>
                    </NextLink>
                </Box>
            </Layout>
        );

    const initialValues = {
        title: postData.onePost.title,
        text: postData.onePost.text,
    };

    const onUpdatedSubmit = async (values: Omit<IUpdatePostInput, "id">) => {
        await updatePost({
            variables: {
                updatePostInput: {
                    id: postID,
                    ...values,
                },
            },
        });

        router.back();
    };

    return (
        <Layout>
            <Formik initialValues={initialValues} onSubmit={onUpdatedSubmit}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="title"
                            placeholder="Title"
                            label="Title"
                            type="text"
                        />
                        <Box mt={4}>
                            <InputField
                                textarea={true}
                                name="text"
                                placeholder="Text"
                                label="Text"
                                type="text"
                            />
                        </Box>

                        <Flex
                            justifyContent="space-between"
                            alignItems="center"
                            mt={4}
                        >
                            <Button
                                type="submit"
                                colorScheme="teal"
                                isLoading={isSubmitting}
                            >
                                Update Post
                            </Button>
                            <NextLink href="/">
                                <Button>Back to Homepage</Button>
                            </NextLink>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default PostEdit;
