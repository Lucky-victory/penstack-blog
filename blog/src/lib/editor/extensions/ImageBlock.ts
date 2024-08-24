import { ReactNodeViewRenderer, mergeAttributes, Node } from '@tiptap/react'
import ImageBlockComponent from '@/src/app/components/TextEditor/Nodes/ImageBlock'
import { CldUploadWidget } from "next-cloudinary";

export const CustomImageBlockExtension = Node.create({
  name: 'BlogImageBlock',
  group: 'block',
  content: 'inline*',
  draggable: true,
  
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
     
    }
  },

  parseHTML() {
    return [
      {
        tag: 'blog-image-block',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['blog-image-block', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageBlockComponent)
  },
})
