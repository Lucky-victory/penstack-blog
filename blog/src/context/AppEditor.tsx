import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { PostSelect, type EDITOR_CONTEXT_STATE } from "../types";

import { type Editor } from "@tiptap/react";

import isEmpty from "just-is-empty";

const AppEditorContext = createContext<EDITOR_CONTEXT_STATE>({
  isSaving: false,

  activePost: null,
  setActivePost: () => {},
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
  meta: {
    wordCount: 0,
    characterCount: 0,
  },
});

export const AppEditorContextProvider = ({
  children,
  post,
}: {
  children: ReactNode;
  post: PostSelect | null;
}) => {
  const [activePost, setActivePost] = useState<PostSelect | null>(post);
  const [isSaving, setIsSaving] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);
  console.log("Active Post:", activePost);

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
  const setActivePostCallback = useCallback((post: PostSelect | null) => {
    setActivePost(post);
  }, []);

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

  return (
    <AppEditorContext.Provider
      value={{
        isSaving,

        content: editorContent,
        setActivePost: setActivePostCallback,
        activePost,
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
