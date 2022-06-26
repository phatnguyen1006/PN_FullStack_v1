import NextLink from "next/link";
import { useMeQuery, useOnePostQuery } from "../../../generated/graphql";
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

    const { data: meData, loading: meLoading } = useMeQuery();

    const { data: postData, loading: postLoading } = useOnePostQuery({
        variables: { id: router.query.id as string },
    });

    const initialValues = {
        title: postData?.onePost?.title,
        text: postData?.onePost?.text,
    };

    const onUpdatedSubmit = () => {};

    if (meLoading || postLoading)
        return (
            <Layout>
                <Flex justifyContent="center" alignItems="center" minH="100vh">
                    <Spinner />
                </Flex>
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

                        <Flex>
                            <Button
                                type="submit"
                                colorScheme="teal"
                                mt={4}
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
