import { Box, useColorModeValue } from "@chakra-ui/react";
import { Input } from "@/src/app/components/ui/Input";
import { useFormik } from "formik";
import { PostInsert } from "@/src/types";
import { ChangeEvent, memo, useState } from "react";
import { useCustomEditorContext } from "@/src/context/AppEditor";

export const TitleInput = ({
  onChange,
}: {
  onChange?: (title: string) => void;
}) => {
  const { activePost, updateField } = useCustomEditorContext();
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const [title, setTitle] = useState(activePost?.title || "");
  function handleTitleChange(evt: ChangeEvent<HTMLInputElement>) {
    const { value } = evt.target;
    console.log("title:", value);

    onChange?.(value);
    setTitle(value);
    updateField("title", value, true);
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
        fontSize={{ base: "x-large", md: "xx-large" }}
      />
    </Box>
  );
};

TitleInput.displayName = "TitleInput";
