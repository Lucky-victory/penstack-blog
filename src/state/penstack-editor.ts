import { Editor } from "@tiptap/core";
import { create } from "zustand";

type PenstackEditorState = {
  editor: Editor | null;
  isReady: boolean;
  content: {
    text?: string;
    html: string;
  };
};
type PenstackEditorActions = {
  setEditor: (editor: Editor | null) => void;
  setEditorContent: (content: { html: string; text?: string }) => void;
};
type PenstackEditorStore = PenstackEditorState & PenstackEditorActions;
export const usePenstackEditorStore = create<PenstackEditorStore>((set) => ({
  editor: null,
  isReady: false,
  content: {
    text: "",
    html: "",
  },
  setEditorContent: (content) => set({ content }),
  setEditor: (editor) => set({ editor }),
}));
