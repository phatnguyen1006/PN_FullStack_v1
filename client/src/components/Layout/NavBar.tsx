import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import {
  MeDocument,
  MeQuery,
  useLogoutMutation,
  useMeQuery,
} from "../../generated/graphql";

const NavBar = () => {
  const { data, loading: useMeQueryLoading } = useMeQuery();
  const [logout, { loading: useLogoutMutationLoading }] = useLogoutMutation();

  const logoutUser = async () => {
    await logout({
      update(cache, { data }) {
        if (data?.logout) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: { me: null }, // reset cache
          });
        }
      },
    });
  };

  const TrailingBarButton = (): JSX.Element => {
    let body = <></>;

    if (useMeQueryLoading) {
      body = <></>;
    } else if (!data?.me) {
      body = (
        <>
          <NextLink href="/login">
            <Link mr={2}>Login</Link>
          </NextLink>
          <NextLink href="/register">
            <Link>Register</Link>
          </NextLink>
        </>
      );
    } else {
      body = (
        <Button onClick={logoutUser} isLoading={useLogoutMutationLoading}>
          Logout
        </Button>
      );
    }

    return body;
  };

  return (
    <Box bg="tan" p={4}>
      <Flex maxW={800} m="auto" justifyContent="space-between" align="center">
        <NextLink href="/">
          <Heading>Reddit</Heading>
        </NextLink>
        <Box>
          <TrailingBarButton />
        </Box>
      </Flex>
    </Box>
  );
};

export default NavBar;
