import {
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { SlugInputProps } from "../types";

export const SlugInput = ({
  activePost,
  isSlugEditable,
  handleChange,
  setIsSlugEditable,
}: SlugInputProps) => {
  return (
    <FormControl>
      <FormLabel>URL friendly title:</FormLabel>
      <InputGroup>
        <Input
          placeholder="Slug"
          name="slug"
          value={activePost?.slug}
          autoComplete="off"
          onChange={handleChange}
          isDisabled={!isSlugEditable}
          onBlur={() => setIsSlugEditable(false)}
          rounded="xl"
          pr={1}
        />
        {!isSlugEditable && (
          <InputRightElement roundedRight="xl">
            <Button
              size="sm"
              variant="ghost"
              fontWeight={500}
              onClick={() => setIsSlugEditable(true)}
            >
              Edit
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
    </FormControl>
  );
};
