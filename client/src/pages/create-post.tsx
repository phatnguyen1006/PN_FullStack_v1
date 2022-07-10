import router from "next/router";
import NextLink from "next/link";
import { Box, Button, Flex, Link, Spinner } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import { useCheckAuth } from "../utils/hooks/useCheckAuth";
import {
  ICreatePostInput,
  PaginatedPosts,
  useCreatePostMutation,
} from "../generated/graphql";

const CreatePost = () => {
  const { data: authData, loading: authLoading } = useCheckAuth();
  const checkAuth = () => {
    if (authLoading || (!authLoading && authData?.me)) return true;
    return false;
  };

  const initialValues = { title: "", text: "" };

  const [createPost, _] = useCreatePostMutation();

  const onCreatePostSubmit = async (values: ICreatePostInput) => {
    await createPost({
      variables: {
        createPostInput: values,
      },
      update(cache, { data }) {
        cache.modify({
          fields: {
            posts(existing: PaginatedPosts) {
              if (data?.createPost.success && data.createPost.post) {
                // take the real post data from ref in cache
                const newPostRef = cache.identify(data.createPost.post);

                const newPostAfterCreation = {
                  ...existing,
                  totalCount: existing.totalCount + 1,
                  paginatedPosts: [
                    { __ref: newPostRef },
                    ...existing.paginatedPosts, // [{__ref: "Post:1"}, {__ref: "Post:2"}]
                  ],
                };

                return newPostAfterCreation;
              }

              return existing;
            },
          },
        });
      },
    });

    router.push("/");
  };

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
