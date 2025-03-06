import { mergeAttributes, nodePasteRule } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import PenstackBlockquoteComponent from "../nodes/PenstackBlockquote";
import Blockquote from "@tiptap/extension-blockquote";

const PenstackBlockquote = Blockquote.extend({
  addAttributes() {
    return {
      variant: { default: "plain" },
    };
  },
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  addPasteRules() {
    return [
      ...(this.parent?.() || []),
      nodePasteRule({
        find: /^>\s(.+)$/gm,
        type: this.type,
        getAttributes(match, event) {
          return { variant: "plain" };
        },
      }),
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(PenstackBlockquoteComponent);
  },
  parseHTML() {
    return [{ tag: "blockquote" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "blockquote",
      mergeAttributes(HTMLAttributes, {
        "data-variant": HTMLAttributes.variant || "plain",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setBlockquote:
        () =>
        ({ commands }) => {
          return commands.wrapIn("blockquote");
        },
      toggleBlockquote:
        () =>
        ({ commands }) => {
          return commands.toggleWrap("blockquote");
        },
      unsetBlockquote:
        () =>
        ({ commands }) => {
          return commands.lift("blockquote");
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Shift-b": () => this.editor.commands.toggleBlockquote(),
    };
  },
});

export default PenstackBlockquote;
