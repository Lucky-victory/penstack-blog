import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import {
  Editor,
  EditorContent,
  EditorProvider,
  useCurrentEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Box, Stack, useColorModeValue } from "@chakra-ui/react";
import { MenuBar } from "./MenuBar";
import { useHTMLToMarkdownConverter } from "@/src/hooks";
import { TableOfContents } from "@/src/lib/editor/extensions/toc";
import { Media } from "@/src/lib/editor/extensions/media";
import {
  AppEditorContextProvider,
  useCustomEditorContext,
} from "@/src/context/AppEditor";

export type TextEditorHandle = {
  resetContent: () => void;
  getContent: () => string;
  setContent: (content: string) => void;
};

type TextEditorProps = {
  onContentChange: (content: {
    text: string;
    html?: string;
    markdown: string;
  }) => void;
  initialValue: string;
  returnMarkdown?: boolean;
  getCounts?: (counts: { words: number; characters: number }) => void;
};
const extensions = [
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
];
const TextEditor = () => {
  const { editor, content, markdownContent } = useCustomEditorContext();
  console.log({
    text: content.text,
    html: content.html,
    markdown: markdownContent,
  });

  const { markdown, updateHtml } = useHTMLToMarkdownConverter();

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
