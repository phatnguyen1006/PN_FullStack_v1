import { Box, Button, FormControl } from "@chakra-ui/react";
import { Formik, Form, FormikHelpers as FormikActions } from "formik";
import { useRouter } from "next/router";
import InputField from "../components/InputField";
// components
import Wrapper from "../components/Wraper";

import { IRegisterInput, useRegisterMutation } from "../generated/graphql";
import { inputFieldError } from "../helpers/inputFieldError";

const Register = () => {
  const router = useRouter();

  const initialValues: IRegisterInput = { email: "", username: "", password: "" };

  const [registerUser, { loading: _registerUserLoading, data, error }] = useRegisterMutation();

  const onRegisterSubmit = async (values: IRegisterInput, {setErrors}: FormikActions<IRegisterInput> ) => {

    const response = await registerUser({
      variables: {
        registerInput: values,
      }
    });

    if (response.data?.register.errors) {
      setErrors(inputFieldError(response.data.register.errors));
    }
    else if (response.data?.register.user) {
      router.push("/");
    }
  };

  return (
    <Wrapper>
      {error && <p>Failed to register</p>}
      {data && data.register.success && (
        <p>Register successfully {JSON.stringify(data)}</p>
      )}
      <Formik initialValues={initialValues} onSubmit={onRegisterSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
              <InputField
                name="username"
                placeholder="username"
                label="Username"
                type="text"
              />
              <Box mt={4}>
                <InputField
                  name="email"
                  placeholder="email"
                  label="Email"
                  type="text"
                />
              </Box>
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
                Register
              </Button>
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
