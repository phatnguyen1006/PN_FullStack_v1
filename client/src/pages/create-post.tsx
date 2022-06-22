import NextLink from "next/link";
import { Box, Button, Flex, Link, Spinner } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import { useCheckAuth } from "../utils/hooks/useCheckAuth";

const CreatePost = () => {
  const { data: authData, loading: authLoading } = useCheckAuth();
  const checkAuth = () => {
    if (authLoading || (!authLoading && authData?.me)) return true;
    return false;
  };

  const initialValues = { title: "", text: "" };

  const onCreatePostSubmit = () => {};

  if (!checkAuth()) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        <Spinner />
      </Flex>
    );
  } else
    return (
      <Layout>
        <Formik initialValues={initialValues} onSubmit={onCreatePostSubmit}>
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
                  type="textarea"
                />
              </Box>

              <Flex mt={4} alignItems={"end"} justifyContent="space-between">
                <Button
                  type="submit"
                  colorScheme="teal"
                  isLoading={isSubmitting}
                >
                  Create Post
                </Button>

                <NextLink href="/">
                  <Link>Go back to HomePage</Link>
                </NextLink>
              </Flex>
            </Form>
          )}
        </Formik>
      </Layout>
    );
};

export default CreatePost;
