import React from 'react'
import { NodeViewWrapper,NodeConfig, } from '@tiptap/react'
import { CldUploadWidget, CloudinaryUploadWidgetInfo, CloudinaryUploadWidgetResults, getCldImageUrl } from "next-cloudinary";
import { Button, Image, Box } from '@chakra-ui/react'

const ImageBlockComponent = ({ node, updateAttributes }:{node:NodeConfig,updateAttributes:(props:{src:string,alt?:string})=>void}) => {
  function handleCldUploadWidgetSuccess(cldUpload: CloudinaryUploadWidgetResults) {
    const imageUrl = getCldImageUrl({ src: (cldUpload.info as CloudinaryUploadWidgetInfo).public_id })
    updateAttributes({ src: imageUrl })
  }
console.log({node})
  return (
    <NodeViewWrapper>
      <Box>
        {node.attrs.src ? (
          <Image src={node.attrs.src} alt={node.attrs.alt || ''} />
        ) : (
          <CldUploadWidget uploadPreset="post_images" onSuccess={handleCldUploadWidgetSuccess}>
            {({ open }) => (
              <Button onClick={() => open()}>Upload Image</Button>
            )}
          </CldUploadWidget>
        )}
      </Box>
    </NodeViewWrapper>
  )
}

export default ImageBlockComponent
