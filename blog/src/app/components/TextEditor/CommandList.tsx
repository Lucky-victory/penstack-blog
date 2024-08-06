import React from 'react'
import { Box, VStack, Text } from '@chakra-ui/react'

const CommandList = ({ items, command }) => (
  <Box bg="white" shadow="md" rounded="md" p={2}>
    <VStack align="stretch" spacing={1}>
      {items.map((item, index) => (
        <Text
          key={index}
          cursor="pointer"
          p={2}
          _hover={{ bg: 'gray.100' }}
          onClick={() => command(item)}
        >
          {item.title}
        </Text>
      ))}
    </VStack>
  </Box>
)

export default CommandList
