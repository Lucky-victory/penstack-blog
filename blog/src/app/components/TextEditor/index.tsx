'use client'
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Editor, EditorProvider, Extension, ReactRenderer, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Box, useDisclosure } from "@chakra-ui/react";
import { MenuBar } from "./MenuBar";
import {SlashCommandList} from './CommandList'
import { useHTMLToMarkdownConverter } from "@/src/hooks";
import Suggestion, { SuggestionProps } from "@tiptap/suggestion";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { SlashCommandExtension } from "@/src/lib/editor/extension";
import tippy, { Instance, Props } from "tippy.js";
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
  const [suggestionProps, setSuggestionProps] = useState<SuggestionProps|null>(null);
const {isOpen:isSlashCommandOpen,onOpen:onSlashCommandOpen,onClose:onSlashCommandClose}=useDisclosure()
  const items = [
    {
      title: 'Heading 1',
      command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
      },
    },
    {
      title: 'Bullet List',
      command: ({ editor, range }: { editor: Editor; range:{ from: number; to: number } }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: 'Code Block',
      command: ({ editor, range }: { editor: Editor; range:{ from: number; to: number } }) => {
        editor.chain().focus().deleteRange(range).setNode('codeBlock').run();
      },
    },
  ];

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
  }), SlashCommandExtension.configure({
      suggestion: {
        items: () => items,
        render: () => {
          let component: ReactRenderer<any>;
    let popup: Instance<Props>[] | { setProps: (arg0: { getReferenceClientRect: any; }) => void; }[];
          return {
            onStart: (props:any) => {
              component = new ReactRenderer(SlashCommandList, {
                props:{
                  ...props,isOpen:isSlashCommandOpen,onClose:onSlashCommandClose,onOpen:onSlashCommandOpen
                },
                editor: props.editor
              });
              onSlashCommandOpen();
              if (!props.clientRect) {
                return;
              }
        // popup = tippy('body', {
        //   getReferenceClientRect: props.clientRect,
        //   appendTo: () => document.body,
        //   content: component.element,
        //   showOnCreate: true,
        //   interactive: true,
        //   trigger: 'manual',
        //   placement: 'bottom-start',
        // })
            },
            onUpdate: (props: any) => {
              if (component) {
                component.updateProps({...props,isOpen:isSlashCommandOpen,onClose:onSlashCommandClose,onOpen:onSlashCommandOpen
              });
              }

              if (!props.clientRect) {
                return;
              }

              if (popup && popup[0]) {
                popup[0].setProps({
                  getReferenceClientRect: props.clientRect,
                });
              }
            },
            onKeyDown: (props: any) => {
              if (props.event.key === 'Escape') {
                onSlashCommandClose()
                if (popup[0] && 'hide' in popup[0]) {
                  popup[0].hide()
                }
                return true
              }

              return component.ref?.onKeyDown(props)
            },
            onExit() {
               onSlashCommandClose()
                if (popup[0] && 'destroy' in popup[0]) {
                    popup[0].destroy()
                }
                component.destroy()
            },          };
        },
      },
    }),
  Typography,
  Image,
  TextAlign,
  Highlight,CharacterCount];


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
      <EditorProvider   editorProps={{'attributes':{class:'tiptap-post-editor'}}} 
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
    </Box>
  );
});

TextEditor.displayName = "TextEditor";
export default TextEditor;