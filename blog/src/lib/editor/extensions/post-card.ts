import { mergeAttributes, Node, ReactNodeViewRenderer } from "@tiptap/react";
import { PostCard } from "../nodes/MiniPostCard/PostCard";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    post: {
      insertPostCard: (postIds?: number[] | string[] | null) => ReturnType;
    };
  }
}
export const PostCardExtension = Node.create<{
  postIds: number[] | string[] | null;
  customTitle: string;
}>({
  name: "postCard",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      postIds: { default: [] },
      customTitle: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="post-card"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "post-card" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PostCard);
  },

  addCommands() {
    return {
      insertPostCard:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { postIds: [] },
          });
        },
    };
  },
});
