'use client'
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { BubbleMenu, Editor, EditorProvider, Extension, FloatingMenu, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { MenuBar } from "./MenuBar";
import { useHTMLToMarkdownConverter } from "@/src/hooks";
import Suggestion from "@tiptap/suggestion";
// import WrapperCompExtension from "@/src/lib/editor/extension";
type TextEditorHandle = {
  resetContent: () => void;
};

const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: { editor: Editor; range: Range; props: any }) => {
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

const extensions = [
  StarterKit,
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
  Highlight,];

const TextEditor = forwardRef<
  TextEditorHandle,
  {
    onContentChange: (content:{text:string,html?:string,markdown:string}) => void;
    initialValue: string;
    returnMarkdown?: boolean;
  }
>(({ onContentChange, initialValue, returnMarkdown = true }, ref) => {
  const [editorContent, setEditorContent] = useState<string>(initialValue || "");
  const { editor } = useCurrentEditor();
  const { markdown, updateHtml } = useHTMLToMarkdownConverter();
  
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
    ({text,html,markdown}:{text:string,html?:string,markdown:string}) => {
      onContentChange({text,html,markdown});
    },
    [onContentChange]
  );

  function handleEditorUpdate(editor: Editor) {
    setEditorContent(editor.getHTML());
    if (returnMarkdown) {
      updateHtml(editor.getHTML());
      getEditorContent({markdown,text:editor.getText().replaceAll('\n\n','\n')});
    } else {
      getEditorContent({html:editor.getHTML(),text:editor.getText().replaceAll('\n\n','\n'),markdown});
    }
  }

  return (
    <Box p={3} bg={useColorModeValue("white", "gray.900")}>
      <EditorProvider  editorProps={{'attributes':{class:'tiptap-post-editor'}}}
        enablePasteRules={true}
        onUpdate={({ editor }) => {
          // @ts-ignore
          handleEditorUpdate(editor);
        }}
        onTransaction={({ editor }) => {
          // @ts-ignore
          handleEditorUpdate(editor);
        }}
        slotBefore={<MenuBar />}
        content={editorContent}
        extensions={extensions}
      >
        <FloatingMenu editor={null} tippyOptions={{duration:100}}>This is a floating menu</FloatingMenu>
        <BubbleMenu editor={null} shouldShow={({editor}) => {
          return editor.isActive("paragraph");

        }} tippyOptions={{duration:100}}>this is a bubble menu 1</BubbleMenu>
 
      </EditorProvider>
    </Box>
  );
});

TextEditor.displayName = "TextEditor";
export default TextEditor;