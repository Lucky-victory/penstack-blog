import { Editor, EditorContent } from "@tiptap/react";

export default function ContentArea({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  return <EditorContent editor={editor} />;
}
