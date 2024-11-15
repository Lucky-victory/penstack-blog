import { Editor, EditorProvider } from "@tiptap/react";
import { Box, Stack, useColorModeValue } from "@chakra-ui/react";
import { MenuBar } from "./MenuBar";
import { useMemo } from "react";

import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

import { TableOfContents } from "@/src/lib/editor/extensions/toc";
import { Media } from "@/src/lib/editor/extensions/media";

const TextEditor = () => {
  const extensions = useMemo(
    () => [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write something …",
      }),
      Link.configure({
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
        openOnClick: false,
        autolink: true,
      }),
      Typography,
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      CharacterCount,
      TableOfContents,
      Media,
    ],
    []
  );

  return (
    <Stack
      h="full"
      overflowY="auto"
      minH={300}
      bg={useColorModeValue("#f0f8ff", "gray.700")}
      maxH="full"
    >
      <Box>
        <EditorProvider
          editorProps={{ attributes: { class: "tiptap-post-editor" } }}
          enablePasteRules={true}
          slotBefore={<MenuBar />}
          content={""}
          extensions={extensions}
        />
      </Box>
    </Stack>
  );
};
TextEditor.displayName = "TextEditor";
export default TextEditor;
