import { Box, Button, Flex, FormControl, Spinner, useToast } from "@chakra-ui/react";
import { Form, Formik, FormikHelpers as FormikActions } from "formik";
import { useRouter } from "next/router";
import InputField from "../components/InputField";
// components
import Wrapper from "../components/Wrapper";
import {
  ILoginInput,
  MeDocument,
  MeQuery,
  useLoginMutation,
} from "../generated/graphql";
import { inputFieldError } from "../helpers/errors/inputFieldError";
import { useCheckAuth } from "../utils/hooks/useCheckAuth";

const Login = () => {
  const toast = useToast();
  const router = useRouter();

  const { data: authData, loading: authLoading } = useCheckAuth();

  const initialValues: ILoginInput = { usernameOrEmail: "", password: "" };

  const [loginUser, { loading: _loginUserLoading, data, error }] =
    useLoginMutation();

  const checkAuth = () => {
    if (authLoading || (!authLoading && authData?.me)) return true;
    return false;
  };

  const onLoginSubmit = async (
    values: ILoginInput,
    { setErrors }: FormikActions<ILoginInput>
  ) => {
    const response = await loginUser({
      variables: {
        loginInput: values,
      },
      update(cache, { data }) {
        // handle read into cache of Apollo Server
        // update func will call directly query to apollo server to query new data and skip read cache
        // const meData = cache.readQuery({ query: MeDocument });  // read query from cache

        if (data?.login.success) {
          // rewrite cache of apollo server
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: { me: data.login.user },
          });
        }
      },
    });

    if (response.data?.login.errors) {
      setErrors(inputFieldError(response.data.login.errors));
    } else if (response.data?.login.user) {
      toast({
        title: "Welcome",
        description: `${response.data.login.user.username}`,
        status: "success",
        duration: 3000,
        position: "bottom-right",
        isClosable: true,
      });
      router.push("/");
    }
  };

  return (
    <>
      {checkAuth() ? (
        <Flex justifyContent="center" alignItems="center" minH="100vh">
          <Spinner />
        </Flex>
      ) : (
        <Wrapper>
          {error && <p>Failed to login. Internal Server</p>}
          <Formik initialValues={initialValues} onSubmit={onLoginSubmit}>
            {({ isSubmitting }) => (
              <Form>
                  <InputField
                    name="usernameOrEmail"
                    placeholder="Username or Email"
                    label="Username or Email"
                    type="text"
                  />
                  <Box mt={4}>
                    <InputField
                      name="password"
                      placeholder="password"
                      label="Password"
                      type="password"
                    />
                  </Box>

                  <Button
                    type="submit"
                    colorScheme="teal"
                    mt={4}
                    isLoading={isSubmitting}
                  >
                    Login
                  </Button>
              </Form>
            )}
          </Formik>
        </Wrapper>
      )}
    </>
  );
};

export default Login;
