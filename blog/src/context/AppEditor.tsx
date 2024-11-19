import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PostInsert, PostSelect, type EDITOR_CONTEXT_STATE } from "../types";
import { type Editor } from "@tiptap/react";
import isEmpty from "just-is-empty";
import slugify from "slugify";
import { useFormik } from "formik";
import { nullToEmptyString } from "../utils";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { debounce } from "lodash";
import { usePostUpdate } from "../hooks";
import { usePostManager } from "../hooks/usePostManager";
import { decode, encode } from "html-entities";

const AppEditorContext = createContext<EDITOR_CONTEXT_STATE>({
  isSaving: false,
  isDirty: false,
  updateField: () => {},
  savePost: () => {},
  formik: null,
  updatePost: () => {},
  editor: null,
  setEditor: () => {},
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
  post: initialPost,
}: {
  children: ReactNode;
  post: PostSelect | null;
}) => {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [editorContent, setEditorContent] = useState<
    EDITOR_CONTEXT_STATE["content"]
  >({
    text: "",
    html: "",
  });
  const [initialContent, setInitialContent] = useState("");
  const [markdownContent, setMarkdownContent] = useState("");
  const [meta, setMeta] = useState({
    wordCount: 0,
    characterCount: 0,
  });

  const {
    post: activePost,
    setPost: setActivePost,
    updateField,
    savePost,
    isDirty,
    isSaving,
  } = usePostManager(initialPost);

  // // Watch content changes and update post
  // useEffect(() => {
  //   console.log({
  //     editorContent: encode(editorContent.html),
  //     activePost: activePost?.content,
  //   });

  //   // if (encode(editorContent.html) !== activePost?.content) {
  //   updateField("content", decode(editorContent.html), true);
  //   // }
  // }, [editorContent.html]);

  // Editor ready state effect
  useEffect(() => {
    setIsEditorReady(!isEmpty(editor));
  }, [editor]);

  const contextValue = {
    isSaving,
    isDirty,
    updateField,
    savePost,
    content: editorContent,
    setActivePost,
    activePost: activePost as PostSelect | null,
    setEditorContent,
    initialContent,
    setInitialContent,
    markdownContent,
    clearEditor: useCallback(() => {
      setEditorContent({
        text: "",
        html: "",
      });
      editor?.commands?.setContent("");
    }, [editor]),
    isEditorReady,
    editor,
    setEditor,
    meta,
  };

  return (
    <AppEditorContext.Provider value={contextValue}>
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
