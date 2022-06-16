import { FieldError } from "../../generated/graphql";

interface IFieldError {
  [key: string]: string
}

export const inputFieldError = (errors: FieldError[]): IFieldError => {
  return errors.reduce(
    (accumulatedErrorObj, error) => ({
      ...accumulatedErrorObj,
      [error.field]: error.message,
    }),
    {}
  );
};
