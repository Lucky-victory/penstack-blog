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

const AppEditorContext = createContext<EDITOR_CONTEXT_STATE>({
  isSaving: false,
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
  post,
}: {
  children: ReactNode;
  post: PostSelect | null;
}) => {
  const [activePost, setActivePost] = useState<PostSelect | null>(post);
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

  const { mutate } = useMutation({
    mutationFn: async (values: PostInsert) => {
      try {
        setIsSaving(true);
        const response = await axios.put<{
          data: PostSelect;
          message: string;
          lastUpdate: string | Date;
        }>(`/api/posts/${values.post_id}`, values);
        console.log("response", response.data);

        return response.data;
      } catch (error) {
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    onSuccess: (data) => {
      setActivePost(data.data);
      console.log("Successfully saved post:", data);
    },
    onError: (error) => {
      console.error("Error saving post:", error);
    },
  });

  const { author,tags, ...postWithoutAuthor } = nullToEmptyString(activePost!);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...postWithoutAuthor,
    } as PostInsert,
    onSubmit: async (values) => {
      const postToSave: PostInsert = {
        title: values.title,
        slug: values.slug,
        summary: values.summary,
        visibility: values.visibility,
        content: values.content,
        featured_image_id: values.featured_image_id,
        status: values.status,
        post_id: values.post_id,
        author_id: author?.auth_id,
      };

      mutate(postToSave);
    },
  });

const updatePost = usePostUpdate(formik);
  
  const debouncedSave = useRef(
    debounce((formik) => {
      formik.handleSubmit();
    }, 1000)
  ).current;

  const savePost = useCallback(() => {
    debouncedSave(formik);
  }, [formik, debouncedSave]);

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  // Handle slug generation
  useEffect(() => {
    if (
      formik.values.title &&
      formik.values.title?.length > 0 &&
      formik.values.title?.length <= 60
    ) {
      const generatedSlug = slugify(`${formik.values.title}`, {
        lower: true,
        strict: true,
      });
      updatePost("slug", generatedSlug);
    }
  }, [formik.values.title, updatePost]);
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
  const setEditorCallback = useCallback((editor: Editor | null) => {
    setEditor(editor);
  }, []);

  const clearEditor = useCallback(() => {
    setEditorContentCallback({
      text: "",
      html: "",
    });
    if (editor) {
      editor?.commands?.setContent("");
    }
  }, []);

  useEffect(() => {
    setIsEditorReady(!isEmpty(editor));
  }, [editor]);

  return (
    <AppEditorContext.Provider
      value={{
        isSaving,
updatePost,savePost,formik,
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
        editor,
        setEditor: setEditorCallback,
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
