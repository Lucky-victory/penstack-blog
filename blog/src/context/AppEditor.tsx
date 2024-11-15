import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type EDITOR_CONTEXT_STATE } from "../types";

import {
  type Editor,
  EditorProvider,
  useCurrentEditor,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Stack, useColorModeValue } from "@chakra-ui/react";

import { useHTMLToMarkdownConverter } from "@/src/hooks";
import { TableOfContents } from "@/src/lib/editor/extensions/toc";
import { Media } from "@/src/lib/editor/extensions/media";
import isEmpty from "just-is-empty";

const AppEditorContext = createContext<EDITOR_CONTEXT_STATE>({
  setEditor: () => {},
  isSaving: false,

  editor: null,
  content: {
    text: "",
    html: "",
  },
  setEditorContent: () => {},
  setIsSaving: () => {},
  initialContent: "",
  setInitialContent: () => {},
  markdownContent: "",
  clearEditor: () => {},
  isEditorReady: false,
  handleEditorUpdate: () => {},
  meta: {
    wordCount: 0,
    characterCount: 0,
  },
});

export const AppEditorContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [initialContent, setInitialContent] = useState("");
  const [markdownContent, setMarkdownContent] = useState("");
  const [meta, setMeta] = useState({
    wordCount: 0,
    characterCount: 0,
  });
  // const { updateHtml } = useHTMLToMarkdownConverter();
  const [editorContent, setEditorContent] = useState<
    EDITOR_CONTEXT_STATE["content"]
  >({
    text: "",
    html: "",
  });

  const setInitialContentCallback = useCallback((initialContent: string) => {
    setInitialContent(initialContent);
  }, []);
  const setIsSavingCallback = useCallback((isSaving: boolean) => {
    setIsSaving(isSaving);
  }, []);
  const setEditorCallback = useCallback(() => {
    setEditor(editor);
  }, [editor]);

  const setEditorContentCallback = useCallback(
    (content: EDITOR_CONTEXT_STATE["content"]) => {
      setEditorContent(content);
    },
    []
  );
  //TODO: Uncomment this to enable markdown content
  // useEffect(() => {
  //   const markdown = updateHtml(editorContent?.html) || "";
  //   setMarkdownContent(markdown);
  // }, [editorContent?.html, updateHtml]);

  const handleEditorUpdate = useCallback((editor: Editor) => {
    setEditorContent({
      text: editor.getText(),
      html: editor.getHTML(),
    });
    const characterCount = editor.storage.characterCount.characters();
    const wordCount = editor.storage.characterCount.words();
    setMeta({
      wordCount: wordCount,
      characterCount,
    });
  }, []);
  const clearEditor = useCallback(() => {
    setEditorContent({
      text: "",
      html: "",
    });
    editor?.commands?.setContent("");
  }, [editor]);

  useEffect(() => {
    setIsEditorReady(!isEmpty(editor));
  }, [editor]);

  // useEffect(() => {
  //   if (editor) {
  //     editor.commands.setContent(initialContent);
  //   }
  // }, [editor, initialContent]);
  return (
    <AppEditorContext.Provider
      value={{
        isSaving,
        editor,
        content: editorContent,
        setEditor: setEditorCallback,
        handleEditorUpdate,
        setEditorContent: setEditorContentCallback,
        setIsSaving: setIsSavingCallback,
        initialContent,
        setInitialContent: setInitialContentCallback,
        markdownContent,
        clearEditor,
        isEditorReady,
        meta,
      }}
    >
      {children}
    </AppEditorContext.Provider>
  );
};
export const useCustomEditorContext = () => {
  const context = useContext(AppEditorContext);
  if (!context) {
    throw new Error(
      "useCustomEditorContext must be used within a AppEditorContextProvider"
    );
  }
  return context;
};
