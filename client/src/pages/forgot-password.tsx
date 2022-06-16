import React from "react";
import { Formik, Form } from "formik";
import { Box, Button, Flex, Link, Spinner } from "@chakra-ui/react";
import NextLink from "next/link";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import {
  IForgotPasswordInput,
  useForgotPasswordMutation,
} from "../generated/graphql";
import { useCheckAuth } from "../utils/hooks/useCheckAuth";

const ForgotPassword: React.FC = () => {
  const initialValues = { email: "" };

  const { data: authData, loading: authLoading } = useCheckAuth();
  const checkAuth = () => {
    if (authLoading || (!authLoading && authData?.me)) return true;
    return false;
  };

  const [forgotPassword, { loading, data }] = useForgotPasswordMutation();

  const onForgotPasswordSubmit = async (values: IForgotPasswordInput) => {
    await forgotPassword({ variables: { forgotPasswordInput: values } });
  };

  if (checkAuth()) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        <Spinner />
      </Flex>
    );
  } else
    return (
      <Wrapper>
        <Formik initialValues={initialValues} onSubmit={onForgotPasswordSubmit}>
          {({ isSubmitting }) =>
            !loading && data ? (
              <Box>Please check your inbox</Box>
            ) : (
              <Form>
                <InputField
                  name="email"
                  placeholder="Email"
                  label="Email"
                  type="email"
                />

                <Flex mt={2}>
                  <NextLink href="/login">
                    <Link ml="auto">Back to Login</Link>
                  </NextLink>
                </Flex>

                <Button
                  type="submit"
                  colorScheme="teal"
                  mt={4}
                  isLoading={isSubmitting}
                >
                  Send Reset Password
                </Button>
              </Form>
            )
          }
        </Formik>
      </Wrapper>
    );
};

export default ForgotPassword;
