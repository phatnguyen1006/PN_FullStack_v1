import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";

interface IInputFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  textarea?: boolean;
}

const InputField = ({ textarea, ...props }: IInputFieldProps) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      {textarea ? (
        <Textarea {...field} {...props} id={field.name} />
      ) : (
        <Input {...field} {...props} id={field.name} />
      )}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default InputField;
