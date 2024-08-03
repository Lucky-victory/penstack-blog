'use client'
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Editor, EditorProvider, Extension, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Box } from "@chakra-ui/react";
import { MenuBar } from "./MenuBar";
import { useHTMLToMarkdownConverter } from "@/src/hooks";
import Suggestion from "@tiptap/suggestion";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
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
  StarterKit, Placeholder.configure({
    // Use a placeholder:
    placeholder: 'Write something …',
    // Use different placeholders depending on the node type:
    // placeholder: ({ node }) => {
    //   if (node.type.name === 'heading') {
    //     return 'What’s the title?'
    //   }

    //   return 'Can you add some further context?'
    // },
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
  Highlight,CharacterCount];

const TextEditor = forwardRef<
  TextEditorHandle,
  {
    onContentChange: (content:{text:string,html?:string,markdown:string}) => void;
    initialValue: string;
    returnMarkdown?: boolean;getCounts?:(counts:{words:number,characters:number})=>void
  }
>(({ onContentChange, initialValue, returnMarkdown = true,getCounts}, ref) => {
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
    if(getCounts){

      getCounts?.({characters:editor.storage.characterCount.characters(),words:editor.storage.characterCount.words()});
    }
    if (returnMarkdown) {
      updateHtml(editor.getHTML());
      getEditorContent({markdown,text:editor.getText().replace(/\n+/g, ' ')});
    } else {
      getEditorContent({html:editor.getHTML(),text:editor.getText().replace(/\n+/g, ' '),markdown});    }
  }

  return (
    <Box h={'full'} >
      <EditorProvider  editorProps={{'attributes':{class:'tiptap-post-editor'}}} 
        enablePasteRules={true}
              onUpdate={({ editor }) => {
                handleEditorUpdate(editor as import('@tiptap/react').Editor);
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
      </EditorProvider>
    </Box>
  );
});

TextEditor.displayName = "TextEditor";
export default TextEditor;