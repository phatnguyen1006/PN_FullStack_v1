import { FieldError } from "../../generated/graphql";

export const inputFieldError = (errors: FieldError[]) => {
  return errors.reduce(
    (accumulatedErrorObj, error) => ({
      ...accumulatedErrorObj,
      [error.field]: error.message,
    }),
    {}
  );
};
