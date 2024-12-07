import { mergeAttributes, Node, ReactNodeViewRenderer } from "@tiptap/react";
import { PostCard } from "../nodes/MiniPostCard/PostCard";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    post: {
      insertPostCard: (postId: number | string) => ReturnType;
    };
  }
}
export const PostCardExtension = Node.create({
  name: "postCard",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      postId: { default: null },
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
        (postId: number | string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { postId },
          });
        },
    };
  },
});
