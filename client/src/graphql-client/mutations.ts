import { gql } from "@apollo/client";

// {
//     username: "changchang",
//     email: "chang@gmail.com",
//     password: "chang"
// }

export const registerMutation = gql`
    mutation Register($registerInput: IRegisterInput!) {
        register(
            registerInput: $registerInput
        ) {
            code
            success
            message
            user {
                id
                username
                email
            }
            errors {
                field
                message
            }
        }
    }
`