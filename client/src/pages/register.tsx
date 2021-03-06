import {
    Box,
    Button,
    Flex,
    Spinner,
    useToast,
} from "@chakra-ui/react";
import { Formik, Form, FormikHelpers as FormikActions } from "formik";
import { useRouter } from "next/router";
import InputField from "../components/InputField";
// components
import Wrapper from "../components/Wrapper";

import {
    IRegisterInput,
    MeDocument,
    MeQuery,
    useRegisterMutation,
} from "../generated/graphql";
import { inputFieldError } from "../helpers/errors/inputFieldError";
import { useCheckAuth } from "../utils/hooks/useCheckAuth";

const Register = () => {
    const toast = useToast();
    const router = useRouter();

    const { data: authData, loading: authLoading } = useCheckAuth();

    const initialValues: IRegisterInput = {
        email: "",
        username: "",
        password: "",
    };

    const [registerUser, { loading: _registerUserLoading, error }] =
        useRegisterMutation();

    const checkAuth = () => {
        if (authLoading || (!authLoading && authData?.me)) return true;
        return false;
    };

    const onRegisterSubmit = async (
        values: IRegisterInput,
        { setErrors }: FormikActions<IRegisterInput>
    ) => {
        const response = await registerUser({
            variables: {
                registerInput: values,
            },
            update(cache, { data }) {
                // handle read into cache of Apollo Server
                // update func will call directly query to apollo server to query new data and skip read cache
                // const meData = cache.readQuery({ query: MeDocument });  // read query from cache

                if (data?.register.success) {
                    // rewrite cache of apollo server
                    cache.writeQuery<MeQuery>({
                        query: MeDocument,
                        data: { me: data.register.user },
                    });
                }
            },
        });

        if (response.data?.register.errors) {
            setErrors(inputFieldError(response.data.register.errors));
        } else if (response.data?.register.user) {
            toast({
                title: "Welcome",
                description: `${response.data.register.user.username}`,
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
                <Wrapper size="small">
                    {error && <p>Failed to register</p>}
                    <Formik
                        initialValues={initialValues}
                        onSubmit={onRegisterSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
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
                            </Form>
                        )}
                    </Formik>
                </Wrapper>
            )}
        </>
    );
};

export default Register;
