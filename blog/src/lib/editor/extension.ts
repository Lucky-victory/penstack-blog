
import { ReactNodeViewRenderer,mergeAttributes, Node, Extension, Editor  } from '@tiptap/react'

import Component from '@/src/app/components/TextEditor/Nodes/WrapperComp'
import Suggestion from '@tiptap/suggestion'

export const WrapperCompExtension= Node.create({
  name: 'BlgImageBlock',

  group: 'block',

  content: 'inline*',
draggable: true,
  parseHTML() {
    return [
      {
        tag: 'blg-image-block',
      },
    ]
  },

  addKeyboardShortcuts() {
    return {
      'Shift-Enter': () => {
        return this.editor.chain().insertContentAt(this.editor.state.selection.head, { type: this.type.name }).focus().run()
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['blg-image-block', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component)
  },
})

export const SlashCommandExtension = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }:{ editor: Editor; range: Range; props: any }) => {
          props.command({ editor, range });
        },
      },
    };
    
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        startOfLine: true,
        ...this.options.suggestion,
      }),
    ];
  },
});