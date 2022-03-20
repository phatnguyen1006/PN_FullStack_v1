import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { User } from "../entities";
// types
import {
  UserMutationResponse,
  IRegisterInput,
  ILoginInput,
  Context,
} from "../types";
// util
import { validateRegisterInput } from "../utils/validations";
// helper function
import { hashPassword, comparePassword } from "../helpers/crypt";
import { COOKIE_NAME } from "../constants";

@Resolver()
export class UserResolver {
  @Mutation((_return) => UserMutationResponse)
  async register(
    @Arg("registerInput") registerInput: IRegisterInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    const validationRegisterInputErrors = validateRegisterInput(registerInput);

    if (validationRegisterInputErrors !== null)
      return { code: 400, success: false, ...validationRegisterInputErrors };

    try {
      const { email, username, password } = registerInput;
      const existingUser = await User.findOne({
        where: [{ username }, { email }],
      });

      if (existingUser)
        return {
          code: 400,
          success: false,
          message: "Duplicated username or email",
          errors: [
            {
              field: existingUser.username === username ? "username" : "email",
              message: `${
                existingUser.username === username ? "Username" : "Email"
              } already taken`,
            },
          ],
        };

      const hashedPassword = await hashPassword(password);

      const newUser = User.create({
        username,
        password: hashedPassword,
        email,
      });

      await newUser.save();

      req.session.userID = newUser.id;

      return {
        code: 200,
        success: true,
        message: "User registration successful",
        user: newUser,
      };
    } catch (error) {
      console.log("Failed: ", error);
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }

  @Mutation((_return) => UserMutationResponse)
  async login(
    @Arg("loginInput") { usernameOrEmail, password }: ILoginInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    try {
      const existingUser = await User.findOne(
        usernameOrEmail.includes("@")
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail }
      );

      if (!existingUser)
        return {
          code: 400,
          success: false,
          message: "User not found",
          errors: [
            {
              field: "usernameOrEmail",
              message: "Username or email incorrect",
            },
          ],
        };

      const passwordValid = await comparePassword(
        existingUser.password,
        password
      );

      if (!passwordValid)
        return {
          code: 400,
          success: false,
          message: "Wrong password",
          errors: [
            {
              field: "password",
              message: "Wrong password",
            },
          ],
        };

      // Create session and return cookies
      // session: userID = existingUser.id
      req.session.userID = existingUser.id;

      return {
        code: 200,
        success: true,
        message: "Logged in successfull",
        user: existingUser,
      };
    } catch (error) {
      console.log("Failed: ", error);
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }

  @Mutation((_return) => Boolean)
  logout(@Ctx() { req, res }: Context): Promise<boolean> {
    
    return new Promise((resolve, _reject) => {
      res.clearCookie(COOKIE_NAME);

      req.session.destroy((error) => {
        if (error) {
          console.log("DESTROYING SESSION ERROR: ", error);
          resolve(false);
        }
        resolve(true);
      });
    });
  }
}
