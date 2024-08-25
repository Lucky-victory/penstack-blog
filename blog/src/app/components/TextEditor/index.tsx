"use client";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import {
  Editor,
  EditorProvider,
  Extension,
  ReactRenderer,
  useCurrentEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import {
  Box,
  Flex,
  HStack,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { MenuBar } from "./MenuBar";
import { SlashCommandList } from "./extensions/CommandList";
import { useHTMLToMarkdownConverter } from "@/src/hooks";
import Suggestion, { SuggestionProps } from "@tiptap/suggestion";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { SlashCommandExtension } from "@/src/lib/editor/extensions/slash-command";
import tippy, { Instance, Props } from "tippy.js";
import { CustomImageBlockExtension } from "@/src/lib/editor/extensions/Image-block";
import slashSuggestions from "@/src/lib/editor/extensions/slash-command/suggestion";
import { LuCode2, LuHeading1, LuList } from "react-icons/lu";
type TextEditorHandle = {
  resetContent: () => void;
};

const SlashCommand = Extension.create({
  name: "slashCommand",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: any;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
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
    const [suggestionProps, setSuggestionProps] =
      useState<SuggestionProps | null>(null);
    const {
      isOpen: isSlashCommandOpen,
      onOpen: onSlashCommandOpen,
      onClose: onSlashCommandClose,
    } = useDisclosure();
    const items = [
      {
        title: "Heading 1",
        icon: LuHeading1,
        command: ({
          editor,
          range,
        }: {
          editor: Editor;
          range: { from: number; to: number };
        }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode("heading", { level: 1 })
            .run();
        },
      },
      {
        title: "Bullet List",
        icon: LuList,
        command: ({
          editor,
          range,
        }: {
          editor: Editor;
          range: { from: number; to: number };
        }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
      },
      {
        title: "Code Block",
        icon: LuCode2,
        command: ({
          editor,
          range,
        }: {
          editor: Editor;
          range: { from: number; to: number };
        }) => {
          editor.chain().focus().deleteRange(range).setNode("codeBlock").run();
        },
      },
    ];

    const extensions = [
      StarterKit,
      Placeholder.configure({
        // Use a placeholder:
        // placeholder: "Write something …",
        // Use different placeholders depending on the node type:
        placeholder: "Type / to browser actions",
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
      TextAlign,
      Highlight.configure({}),
      CharacterCount,
      CustomImageBlockExtension,
      SlashCommandExtension.configure({
        // items:items,
        suggestion: slashSuggestions(items),
      }),
    ];

    useImperativeHandle(
      ref,
      () => ({
        resetContent: () => {
          setEditorContent(initialValue);
          editor?.commands?.clearContent();
        },
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setEditorContent(editor.getHTML());
      if (getCounts) {
        getCounts?.({
          characters: editor.storage.characterCount.characters(),
          words: editor.storage.characterCount.words(),
        });
      }
      if (returnMarkdown) {
        updateHtml(editor.getHTML());
        getEditorContent({
          markdown,
          text: editor.getText().replace(/\n+/g, " "),
        });
      } else {
        getEditorContent({
          html: editor.getHTML(),
          text: editor.getText().replace(/\n+/g, " "),
          markdown,
        });
      }
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
        >
          {/* <FloatingMenu editor={null} tippyOptions={{duration:100}}>This is a floating menu</FloatingMenu> */}
          {/* <BubbleMenu editor={null} shouldShow={({editor}) => {
          return editor.isActive("paragraph");

        }} tippyOptions={{duration:100}}>this is a bubble menu 1</BubbleMenu>
  */}

          {/* <SlashCommandList
            items={items}
            command={(item) => {
              //@ts-ignore
              item.command({ editor: suggestionProps.editor, range: suggestionProps.range });
              // setSuggestionProps(null);
            }}
            //@ts-ignore
            clientRect={suggestionProps.clientRect}
          /> */}
        </EditorProvider>
      </Stack>
    );
  }
);

TextEditor.displayName = "TextEditor";
export default TextEditor;
