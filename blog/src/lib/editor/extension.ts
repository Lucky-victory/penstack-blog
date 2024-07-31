
import { ReactNodeViewRenderer,mergeAttributes, Node  } from '@tiptap/react'

import Component from '@/src/app/components/TextEditor/Nodes/WrapperComp'

const WrapperCompExtension= Node.create({
  name: 'reactComponent',

  group: 'block',

  content: 'inline*',
draggable: true,
  parseHTML() {
    return [
      {
        tag: 'react-component',
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
    return ['react-component', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component)
  },
})
export default WrapperCompExtension