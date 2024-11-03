import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MediaComponent } from "../nodes/MediaComponent";

export interface MediaOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    media: {
      setMedia: (options: {
        src: string;
        alt?: string;
        title?: string;
        width?: number;
        height?: number;
        align?: "left" | "center" | "right";
      }) => ReturnType;
    };
  }
}

export const Media = Node.create<MediaOptions>({
  name: "mediaBlock",
  group: "block",
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: "auto",
      },
      height: {
        default: "auto",
      },
      align: {
        default: "center",
        rendered: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[data-type="media"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes, { "data-type": "media" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MediaComponent);
  },

  addCommands() {
    return {
      setMedia:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
