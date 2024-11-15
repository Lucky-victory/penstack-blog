import { Box, useColorModeValue } from "@chakra-ui/react";
import { Input } from "@/src/app/components/ui/Input";
import { useFormik } from "formik";
import { PostInsert } from "@/src/types";
import { ChangeEvent, memo, useState } from "react";

export const TitleInput = ({
  defaultTitle,
  onChange,
}: {
  defaultTitle: string;
  onChange: (title: string) => void;
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const [title, setTitle] = useState(defaultTitle);
  function handleTitleChange(evt: ChangeEvent<HTMLInputElement>) {
    const { value } = evt.target;
    onChange?.(value);
    setTitle(value);
  }
  return (
    <Box borderBottom="1px" borderBottomColor={borderColor} p={1} py={2}>
      <Input
        border="none"
        outline="none"
        autoComplete="off"
        placeholder="Awesome title"
        name="title"
        value={title}
        fontWeight={600}
        onChange={handleTitleChange}
        rounded="none"
        _focus={{ boxShadow: "none" }}
        fontSize={{ base: "lg", md: "24px" }}
      />
    </Box>
  );
};

TitleInput.displayName = "TitleInput";
