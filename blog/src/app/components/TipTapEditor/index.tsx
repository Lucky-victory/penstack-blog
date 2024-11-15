import { EditorContent, EditorProvider, useEditor } from "@tiptap/react";
import { Box, Flex, Stack, useColorModeValue } from "@chakra-ui/react";

import { ReactNode, useMemo } from "react";

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
import { MenuBar } from "../TextEditor/MenuBar";
import { SidebarContent } from "./Sidebar";
import { EditorWrapper } from "./Wrapper";

export default function TipTapEditor({ children }: { children?: ReactNode }) {
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
  const editor = useEditor({
    editorProps: { attributes: { class: "tiptap-post-editor" } },
    enablePasteRules: true,

    content: "",
    extensions: extensions,
  });
  return (
    <>
      <Flex gap={3} py={4} px={{ base: 2, md: 3 }}>
        <EditorWrapper>
          <MenuBar editor={editor} />
          <EditorContent editor={editor} />
        </EditorWrapper>
        {/* <SidebarContent editor={editor} /> */}
        <Box display={{ base: "none", lg: "block" }} maxW={320}></Box>
      </Flex>
    </>
  );
}
