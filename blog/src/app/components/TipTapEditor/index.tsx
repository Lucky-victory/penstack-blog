import { BubbleMenu, FloatingMenu, useEditor } from "@tiptap/react";
import { Box, Flex, Hide } from "@chakra-ui/react";

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
import { MediaExtension } from "@/src/lib/editor/extensions/media";
import MenuBar from "./MenuBar";
import { SidebarContent } from "./Sidebar";
import { EditorWrapper } from "./Wrapper";
import EditorHeader from "./Header";
import ContentArea from "./ContentArea";
import React from "react";
import { debounce } from "lodash";
import { PostCardExtension } from "@/src/lib/editor/extensions/post-card";
import { YouTubeExtension } from "@/src/lib/editor/extensions/youtube-embed";
import { TwitterExtension } from "@/src/lib/editor/extensions/tweet-embed";

function TipTapEditor({
  onUpdate,
  initialContent,
}: {
  onUpdate?: (content: { html: string; text?: string }) => void;
  initialContent?: string;
}) {
  const extensions = useMemo(
    () => [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write something …",
      }),
      Link.configure({
        HTMLAttributes: {
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
      MediaExtension,
      PostCardExtension,
      YouTubeExtension,
      // TwitterExtension,
    ],
    []
  );
  const debouncedUpdate = useMemo(
    () =>
      debounce(
        (content: { html: string; text?: string }) => onUpdate?.(content),
        750
      ),
    [onUpdate]
  );

  const editor = useEditor({
    editorProps: { attributes: { class: "tiptap-post-editor" } },
    enablePasteRules: true,
    extensions: extensions,
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      debouncedUpdate({ html, text });
    },
  });
  return (
    <>
      <EditorHeader editor={editor} />
      <Flex gap={3} py={4} px={{ base: 2, md: 3 }}>
        <EditorWrapper>
          <MenuBar editor={editor} />
          <ContentArea editor={editor} />
          {/* <FloatingMenu editor={editor}>this is a floating menu</FloatingMenu> */}
          {/* <BubbleMenu
            editor={editor}
            shouldShow={(props) => props.editor.isActive("media")}
          >
            this is a bubble menu
          </BubbleMenu> */}
        </EditorWrapper>
        <Hide below="lg">
          <SidebarContent editor={editor} />
        </Hide>
        {/* <Box display={{ base: "none", lg: "block" }} maxW={320}></Box> */}
      </Flex>
    </>
  );
}
export default TipTapEditor;
