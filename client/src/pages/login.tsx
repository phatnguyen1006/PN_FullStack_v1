import { Box, Button, FormControl } from "@chakra-ui/react";
import { Form, Formik, FormikHelpers as FormikActions } from "formik";
import { useRouter } from "next/router";
import InputField from "../components/InputField";
// components
import Wrapper from "../components/Wraper";
import { ILoginInput, MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { inputFieldError } from "../helpers/errors/inputFieldError";


const Login = () => {
  const router = useRouter();

  const initialValues: ILoginInput = { usernameOrEmail: "", password: "" };

  const [loginUser, { loading: _loginUserLoading, data, error }] = useLoginMutation();

  const onLoginSubmit = async (values: ILoginInput, {setErrors}: FormikActions<ILoginInput> ) => {

    const response = await loginUser({
      variables: {
        loginInput: values,
      },
      update(cache, {data}) {
        // handle read into cache of Apollo Server
        // update func will call directly query to apollo server to query new data and skip read cache
        // const meData = cache.readQuery({ query: MeDocument });  // read query from cache

        if (data?.login.success) {
          cache.writeQuery<MeQuery>({ query: MeDocument, data: { me: data.login.user } });
        }
      }
    });

    if (response.data?.login.errors) {
      setErrors(inputFieldError(response.data.login.errors));
    }
    else if (response.data?.login.user) {
      router.push("/");
    }
  };

  return (
    <Wrapper>
      {error && <p>Failed to login. Internal Server</p>}
      {data && data.login.success && (
        <p>Login successfully {JSON.stringify(data)}</p>
      )}
      <Formik initialValues={initialValues} onSubmit={onLoginSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
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
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
