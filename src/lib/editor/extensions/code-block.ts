import { ReactNodeViewRenderer } from "@tiptap/react";
import { PenstackCodeblockComponent } from "../nodes/PenstackCodeBlock";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

export const PenstackCodeblock = CodeBlockLowlight.extend({
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

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      "Mod-Alt-C": () => this.editor.commands.setNode("codeBlock"),
    };
  },
});
