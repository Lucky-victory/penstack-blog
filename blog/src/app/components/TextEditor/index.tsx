import { EditorContent } from "@tiptap/react";
import { Box, Stack, useColorModeValue } from "@chakra-ui/react";
import { MenuBar } from "./MenuBar";
import { useCustomEditorContext } from "@/src/context/AppEditor";

const TextEditor = () => {
  const { editor, content, markdownContent } = useCustomEditorContext();
  console.log({
    text: content.text,
    html: content.html,
    markdown: markdownContent,
  });

  return (
    <Stack
      h="full"
      overflowY="auto"
      minH={300}
      bg={useColorModeValue("#f0f8ff", "gray.700")}
      maxH="full"
    >
      <Box>
        <MenuBar />
        <EditorContent editor={editor} />
      </Box>
    </Stack>
  );
};
TextEditor.displayName = "TextEditor";
export default TextEditor;
