import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { Editor, EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Stack, useColorModeValue } from "@chakra-ui/react";
import { MenuBar } from "./MenuBar";
import { useHTMLToMarkdownConverter } from "@/src/hooks";
import { TableOfContents } from "@/src/lib/editor/extensions/toc";
import { Media } from "@/src/lib/editor/extensions/media";

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

const TextEditor = forwardRef<TextEditorHandle, TextEditorProps>(
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

    useImperativeHandle(
      ref,
      () => ({
        resetContent: () => {
          setEditorContent(initialValue || "");
          editor?.commands?.setContent(initialValue || "");
        },
        getContent: () => editor?.getHTML() || "",
        setContent: (content: string) => {
          setEditorContent(content);
          editor?.commands?.setContent(content);
        },
      }),
      [editor, initialValue]
    );

    useEffect(() => {
      if (initialValue !== editorContent) {
        setEditorContent(initialValue);
      }
    }, [initialValue]);

    const handleEditorUpdate = useCallback(
      (editor: Editor) => {
        const html = editor.getHTML();
        setEditorContent(html);

        if (getCounts) {
          getCounts({
            characters: editor.storage.characterCount.characters(),
            words: editor.storage.characterCount.words(),
          });
        }

        const markdown = updateHtml(html);
        onContentChange({
          html,
          text: editor.getText().replace(/\n+/g, " "),
          markdown,
        });
      },
      [getCounts, onContentChange, updateHtml]
    );

    return (
      <Stack
        h="full"
        overflowY="auto"
        minH={300}
        bg={useColorModeValue("#f0f8ff", "gray.700")}
        maxH="full"
      >
        <EditorProvider
          editorProps={{ attributes: { class: "tiptap-post-editor" } }}
          enablePasteRules={true}
          onUpdate={({ editor }) => {
            handleEditorUpdate(editor as Editor);
          }}
          slotBefore={<MenuBar />}
          content={editorContent}
          extensions={extensions}
        />
      </Stack>
    );
  }
);

TextEditor.displayName = "TextEditor";
export default TextEditor;
