// YouTubeExtension.ts
import { mergeAttributes, Node, ReactNodeViewRenderer } from "@tiptap/react";
import { YouTubeEmbed } from "@/src/app/components/Renderers/YoutubeEmbedRenderer";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    youtube: {
      insertYouTube: (videoId: string) => ReturnType;
    };
  }
}

export const YouTubeExtension = Node.create({
  name: "youtube",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      videoId: { default: null },
      title: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="youtube-embed"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "youtube-embed" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(YouTubeEmbed);
  },

  addCommands() {
    return {
      insertYouTube:
        (videoId: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { videoId },
          });
        },
    };
  },

  addPasteRules() {
    return [
      {
        find: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/g,
        handler: ({ match, chain, range }) => {
          const videoId = match[1];
          console.log({ videoId });

          if (videoId) {
            chain()
              // First delete the pasted content
              .deleteRange(range)
              // Then insert the YouTube embed
              .insertContent({
                type: this.name,
                attrs: { videoId },
              })
              .run();
          }
        },
      },
    ];
  },
});
