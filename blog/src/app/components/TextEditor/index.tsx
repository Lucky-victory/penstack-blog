"use client";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Editor, EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Stack, useColorModeValue } from "@chakra-ui/react";
import { MenuBar } from "./MenuBar";
import { useHTMLToMarkdownConverter } from "@/src/hooks";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { TableOfContents } from "@/src/lib/editor/extensions/toc";
import { Media } from "@/src/lib/editor/extensions/media";
type TextEditorHandle = {
  resetContent: () => void;
};

const TextEditor = forwardRef<
  TextEditorHandle,
  {
    onContentChange: (content: {
      text: string;
      html?: string;
      markdown: string;
    }) => void;
    initialValue: string;
    returnMarkdown?: boolean;
    getCounts?: (counts: { words: number; characters: number }) => void;
  }
>(
  (
    { onContentChange, initialValue, returnMarkdown = true, getCounts },
    ref
  ) => {
    const [editorContent, setEditorContent] = useState<string>(
      initialValue || ""
    );
    const { editor } = useCurrentEditor();
    const { markdown, updateHtml } = useHTMLToMarkdownConverter();

    const extensions = [
      StarterKit,
      Placeholder.configure({
        // Use a placeholder:
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
      Highlight.configure({}),
      CharacterCount,
      TableOfContents,
      Media,
    ];

    useImperativeHandle(
      ref,
      () => ({
        resetContent: () => {
          setEditorContent(initialValue || "");
          editor?.commands?.clearContent();
        },
      }),
      [initialValue]
    );

    const getEditorContent = useCallback(
      ({
        text,
        html,
        markdown,
      }: {
        text: string;
        html?: string;
        markdown: string;
      }) => {
        onContentChange({ text, html, markdown });
      },
      [onContentChange]
    );

    function handleEditorUpdate(editor: Editor) {
      const html = editor.getHTML();
      setEditorContent(html);
      if (getCounts) {
        getCounts?.({
          characters: editor.storage.characterCount.characters(),
          words: editor.storage.characterCount.words(),
        });
      }

      const markdown = updateHtml(html);

      getEditorContent({
        html: html,
        text: editor.getText().replace(/\n+/g, " "),
        markdown,
      });
    }

    return (
      <Stack
        h={"full"}
        overflowY={"auto"}
        minH={300}
        bg={useColorModeValue("#f0f8ff", "gray.700")}
        maxH={"full"}
      >
        <EditorProvider
          editorProps={{ attributes: { class: "tiptap-post-editor" } }}
          enablePasteRules={true}
          onUpdate={({ editor }) => {
            handleEditorUpdate(editor as import("@tiptap/react").Editor);
          }}
          slotBefore={<MenuBar />}
          content={editorContent}
          extensions={extensions}
        ></EditorProvider>
      </Stack>
    );
  }
);

TextEditor.displayName = "TextEditor";
export default TextEditor;
