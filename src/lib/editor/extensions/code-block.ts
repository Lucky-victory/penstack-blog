import { ReactNodeViewRenderer } from "@tiptap/react";
import { PenstackCodeblockComponent } from "../nodes/PenstackCodeBlock";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

export const PenstackCodeblock = CodeBlockLowlight.extend({
  name: "penstackCodeBlock",

  addAttributes() {
    return {
      ...this.parent?.(),
      language: {
        default: null,
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(PenstackCodeblockComponent);
  },
  // parseHTML() {
  //   return [{ tag: "pre" }];
  // },
  addCommands() {
    return {
      ...this.parent?.(),

      // setCodeblock:
      //   () =>
      //   ({ commands }) => {
      //     return commands.wrapIn("penstackCodeBlock");
      //   },
      // toggleCodeblock:
      //   () =>
      //   ({ commands }) => {
      //     return commands.toggleWrap("penstackCodeBlock");
      //   },
      // unsetCodeblock:
      //   () =>
      //   ({ commands }) => {
      //     return commands.lift("penstackCodeBlock");
      //   },
    };
  },
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      "Mod-Shift-c": () => this.editor.commands.toggleCodeBlock(),
    };
  },
});
PenstackCodeblock.name = "PenstackCodeBlock";
