import { create } from "zustand";
import { PostSelect } from "../types";

type EditorPostManagerState = {
  isSaving: boolean;
  post: PostSelect | null;
};
type EditorPostManagerActions = {
  setIsSaving: (isSaving: boolean) => void;
  setPost: (post: PostSelect | null) => void;
};
type EditorPostManagerStore = EditorPostManagerState & EditorPostManagerActions;
export const useEditorPostManagerStore = create<EditorPostManagerStore>(
  (set) => ({
    isSaving: false,
    post: null,
    setPost: (post: PostSelect | null) => set({ post }),
    setIsSaving: (isSaving: boolean) => set({ isSaving }),
  })
);
