import React, { useState } from "react";
import { Formik, Form, FormikHelpers as FormikActions } from "formik";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Link,
  Spinner,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import {
  IChangePasswordInput,
  MeDocument,
  MeQuery,
  useChangePasswordMutation,
} from "../generated/graphql";
import { useRouter } from "next/router";
import { inputFieldError } from "../helpers/errors/inputFieldError";
import { useCheckAuth } from "../utils/hooks/useCheckAuth";

const ChangePassword: React.FC = () => {
  const router = useRouter();
  const { query } = router;

  const { data: authData, loading: authLoading } = useCheckAuth();
  const checkAuth = () => {
    if (authLoading || (!authLoading && authData?.me)) return true;
    return false;
  };

  const initialValues = { newPassword: "" };
  const [tokenError, setTokenError] = useState("");

  const [changePassword, { loading }] = useChangePasswordMutation();
  const onChangePasswordSubmit = async (
    values: IChangePasswordInput,
    { setErrors }: FormikActions<IChangePasswordInput>
  ) => {
    if (query.userID && query.token) {
      const response = await changePassword({
        variables: {
          userID: query.userID as string,
          token: query.token as string,
          changePasswordInput: values,
        },
        update(cache, { data }) {
          if (data?.changePassword.success) {
            cache.writeQuery<MeQuery>({
              query: MeDocument,
              data: { me: data?.changePassword.user },
            });
          }
        },
      });

      if (response.data?.changePassword.errors) {
        const fieldError = inputFieldError(response.data.changePassword.errors);
        if ("token" in fieldError) {
          setTokenError(fieldError.token);
        }
        setErrors(fieldError);
      }

      if (response.data?.changePassword.user) {
        router.push("/");
      }
    }
  };

  if (checkAuth()) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        <Spinner />
      </Flex>
    );
  } else if (!query.userID || !query.token)
    return (
      <Wrapper size="small">
        <Alert status="error" variant="top-accent">
          <AlertIcon />
          <AlertTitle>Invalid password change request</AlertTitle>
        </Alert>

        <Flex mt={2}>
          <NextLink href="/login">
            <Link ml="auto">Back to Login</Link>
          </NextLink>
        </Flex>
      </Wrapper>
    );
  else
    return (
      <Wrapper size="small">
        <Formik initialValues={initialValues} onSubmit={onChangePasswordSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="newPassword"
                placeholder="New Password"
                label="New Password"
                type="password"
              />

              {tokenError && (
                <Flex>
                  <Box color={"red"} mr={"auto"}>
                    {tokenError}
                  </Box>
                  <NextLink href="forgot-password">
                    <Link>Go back</Link>
                  </NextLink>
                </Flex>
              )}

              <Button
                type="submit"
                colorScheme="teal"
                mt={4}
                isLoading={isSubmitting}
              >
                Send New Password
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    );
};

export default ChangePassword;
