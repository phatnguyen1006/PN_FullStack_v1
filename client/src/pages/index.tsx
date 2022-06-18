import {
  Box,
  Flex,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import NavBar from "../components/Layout/NavBar";
import { PostDocument, usePostQuery } from "../generated/graphql";
import { addApolloState, initializeApollo } from "../lib/apolloClient";

const Index = () => {
  const { data, loading } = usePostQuery();
  return (
    <>
      <NavBar />
      {loading ? (
        <Flex justifyContent="center" alignItems="center" minH="100vh">
          <Spinner />
        </Flex>
      ) : (
        <Stack>
          {data?.post?.map((post) => (
            <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
              <Box>
                <NextLink href={`/post/${post.id}`}>
                  <Link>
                    <Heading fontSize="xl">{post.title}</Heading>
                  </Link>
                </NextLink>
                <Text>POST BY USER</Text>
                <Flex align={"center"}>
                  <Text mt={4}>{post.text} -- SNIPPET</Text>
                  <Box ml={"auto"}>EDIT BUTTON</Box>
                </Flex>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}
    </>
  );
};

export const getStaticProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: PostDocument,
  });

  return addApolloState(apolloClient, {
    props: {},
  });
};

export default Index;
