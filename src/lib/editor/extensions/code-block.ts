import {
  nodePasteRule,
  ReactNodeViewRenderer,
  textPasteRule,
} from "@tiptap/react";
import { PenstackCodeblockComponent } from "../nodes/PenstackCodeBlock";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

export const backtickInputRegex = /^```([a-z]+)?[\s\n]/;

/**
 * Matches a code block with tildes.
 */
export const tildeInputRegex = /^~~~([a-z]+)?[\s\n]/;
export const PenstackCodeblock = CodeBlockLowlight.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      language: {
        default: null,
      },
    };
  },
  // addPasteRules() {
  //   return [
  //     nodePasteRule({
  //       find: backtickInputRegex,
  //       type: this.type,
  //       getAttributes: (match) => ({
  //         language: match[1],
  //       }),
  //     }),
  //     nodePasteRule({
  //       find: tildeInputRegex,
  //       type: this.type,
  //       getAttributes: (match) => ({
  //         language: match[1],
  //       }),
  //     }),
  //   ];
  // },
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
