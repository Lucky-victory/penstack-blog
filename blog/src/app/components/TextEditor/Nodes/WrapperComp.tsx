import { IconButton,Flex } from '@chakra-ui/react'
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import React from 'react'
import { LuHand } from 'react-icons/lu'

const WrapperComponent = () => {
  return (
    <NodeViewWrapper className="blg-image-block" >
        <Flex>
        <IconButton aria-label='drag' data-drag-handle variant={'ghost'} size={'xs'}><LuHand/></IconButton>

      <NodeViewContent className="content">

      </NodeViewContent>
      </Flex>
    </NodeViewWrapper>
  )
}

WrapperComponent.displayName = 'WrapperComponent'

export default WrapperComponent