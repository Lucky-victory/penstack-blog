'use client'
import { usePosts } from "@/hooks";
import { Box, Flex, Grid, GridItem, Text,Image } from "@chakra-ui/react";
import {Link} from '@chakra-ui/next-js'
import {Skeleton} from './ui/Skeleton'
import { Avatar } from "./ui/Avatar";
export function PostsCards(){

const {loading,posts}=usePosts()
    return <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
    {loading
      ? Array.from({ length: 6 }).map((_, index) => (
          <GridItem key={index}>
            <Skeleton height="200px" />
          </GridItem>
        ))
      : posts.map((post) => (
          <GridItem key={post.id} borderWidth={1} borderRadius="lg" overflow="hidden">
            <Image src={post.image} alt={post.title} objectFit="cover" height="200" width="full" />
            <Box p={4}>
              <Flex alignItems="center" mb={2}>
                <Avatar src={post.author.avatar} name={post.author.name} size="sm" mr={2} />
                <Text fontWeight="bold">{post.author.name}</Text>
              </Flex>
              <Text fontSize="sm" color="gray.500" mb={2}>
                {new Date(post.date).toLocaleDateString()}
              </Text>



              <Link href={`/posts/${post.id}`} _hover={{ textDecoration: 'none' }}>
                <Text fontSize="xl" fontWeight="semibold" mb={2}>
                  {post.title}
                </Text>
              </Link>
              <Text noOfLines={3}>{post.content}</Text>
            </Box>
          </GridItem>
        ))}
  </Grid>

}