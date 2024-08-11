import { Box } from "@chakra-ui/react";
import { PostsCards } from "../../components/PostsCards";
import {Skeleton} from '@/src/app/components/ui/Skeleton'

export default function Posts() {
  return (
    <Box p={4} as="main">
        <PostsCards/>
      
          </Box>
  )
}
