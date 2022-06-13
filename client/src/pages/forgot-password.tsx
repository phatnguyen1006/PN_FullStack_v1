import React from "react";
import { Formik, Form } from "formik";
import { Box, Button } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import {
  IForgotPasswordInput,
  useForgotPasswordMutation,
} from "../generated/graphql";

const ForgotPassword: React.FC = () => {
  const initialValues = { email: "" };

  const [forgotPassword, { loading, data }] = useForgotPasswordMutation();

  const onForgotPasswordSubmit = async (values: IForgotPasswordInput) => {
    await forgotPassword({ variables: { forgotPasswordInput: values } });
  };

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
