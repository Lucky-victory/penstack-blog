import { Box, useColorModeValue, Input } from "@chakra-ui/react";

import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useEditorPostManagerStore } from "@/src/state/editor-post-manager";
import { debounce } from "lodash";

export const TitleInput = () => {
  const postTitle = useEditorPostManagerStore(
    (state) => state.activePost?.title
  );
  const updateField = useEditorPostManagerStore((state) => state.updateField);
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const [title, setTitle] = useState(postTitle || "");

  const debouncedUpdate = useMemo(
    () =>
      debounce((value: string) => {
        updateField("title", value, true, true);
      }, 1000),
    [updateField]
  );
  const handleTitleChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const { value } = evt.target;

      debouncedUpdate(value);
      setTitle(value);
    },
    []
  );

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
