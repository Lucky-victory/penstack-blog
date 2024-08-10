'use client'
import React from 'react'
import { Box, Container, Heading,HStack,Stack,VStack, Text, Flex, Avatar, Tag, Image as ChakraImage, useColorModeValue,IconButton } from '@chakra-ui/react'
import { format } from 'date-fns'
import {LuBookmark, LuBookmarkPlus, LuShare} from 'react-icons/lu';
import { PostsCards } from './PostsCards';
interface Author {
  name: string
  avatar: string
  username: string
}

interface Category {
  name: string
  slug: string
  id: number
}

interface FeaturedImage {
  src: string
  alt_text: string
}

interface Post {
  id: number
  title: string
  summary: string
  content: string
  author: Author
  category: Category
  published_at: string
  created_at: string
  updated_at: string
  featured_image: FeaturedImage
  tags: string[]
}

const PostPage: React.FC = () => {
  const post: Post = {
    id: 1,
    title: "Introduction to TypeScript",
    summary: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript',
    content: "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript with a type system. It is a superset of JavaScript, which means that all JavaScript code is also valid TypeScript code. TypeScript adds optional static typing to JavaScript, which helps catch errors at compile time and improves code readability and maintainability.",
    author: {
      name: "Alice Johnson",
      avatar: "https://example.com/avatars/alice.jpg",
      username: "alicej"
    },
    category: {
      name: "Programming",
      slug: "programming",
      id: 1
    },
    published_at: "2023-06-01",
    created_at: "2023-06-01",
    updated_at: "2023-06-01",
    featured_image: {
      src: "https://picsum.photos/800/400?random=3",
      alt_text: ''
    },
    tags: ["TypeScript", "JavaScript", "Programming", "Web Development"]
  }

  return (
    <Flex alignItems={'flex-start'} py={8} pr={3} pos={'relative'} direction={{base:'column',lg:'row'}} flexWrap={{base:'wrap',lg:'nowrap'}} gap={{base:5,lg:0}}>

    <Container maxW="5xl" px={{base:3,sm:4}} >
      <Box minH={300} bg={useColorModeValue('gray.300','gray.700')}   rounded={{base:20,md:24}}>

       <ChakraImage
          src={post.featured_image.src}
          alt={post.featured_image.alt_text || ''}
          w="full"
          h="auto"
          minH={'300px'} objectFit={'cover'}
          rounded={{base:20,md:24}}
          />
          </Box>
        <Box mt={-24} pos={'relative'} px={{base:3,md:3,lg:5}} zIndex={2}> 
          <Box bg={useColorModeValue('white','gray.900')} rounded={{base:20,md:24}} p={{base:4,md:5,lg:6}} >

          <Flex gap={{base:4,md:6}} justifyContent={'space-between'} >
            <VStack shadow={{base:'lg',md:'none'}} gap={{base:8,md:12}} pos={{base:'fixed',md:'relative'}} top={'50%'} transform={{base:'translateY(-50%)',md:'none'}} left={0} h={{base:'auto',md:'100%'}} bg={useColorModeValue('white','gray.900')} roundedRight={{base:20,md:0}} p={{base:3,md:0}} >

            <VStack mt={{base:4,md:12}} gap={4}>
              <IconButton icon={<LuBookmark/>} variant={'outline'}  rounded={'full'} aria-label='bookmark this post'/>
              <IconButton icon={<LuShare/>}  variant={'outline'} rounded={'full'} aria-label='share this post'/>
            </VStack>
            <Box as={Flex} flexDir={'column'} alignItems={'center'} fontSize={{base:'small',md:'medium',lg:'large'}} >
              <Text  as='span' fontWeight={'bold'} fontSize={'100%'}>21,000</Text>
              <Text as='span' fontSize={'90%'}>views</Text>
            </Box>
            </VStack>
      <Box as="article" > 
        <HStack my={4}  gap={{base:5,md:8}} >
        
           <Text as="span" color="gray.500" fontWeight="semibold">{post.category.name}</Text>
          
          <Text color="gray.500">
            {format(new Date(post.updated_at), 'MMMM d, yyyy')}
          </Text>
        </HStack>
        <Box as="header" mb={8}>
          <Heading as="h1" size="2xl" mb={4}>{post.title}</Heading>
          <Flex flexWrap="wrap" gap={2} mb={4}>
            {post?.tags && post?.tags?.map((tag, index) => (
              <Tag key={index} bg={"gray.200"} color="gray.700" size="sm" >
                #{tag}
              </Tag>
            ))}
          </Flex>
        </Box>
        
       
        
        <Box className="prose" maxW="none">

          <Text fontSize="xl" fontWeight="semibold" mb={4} color="gray.600">{post.summary}</Text>
          <Box dangerouslySetInnerHTML={{ __html: post.content }} />
          
        </Box>
        
        
      </Box>
      </Flex>
            </Box>
      </Box>
    <Box mt={-10} pos={'relative'} px={{base:5,md:6}} pt={10} bg={useColorModeValue('gray.300','gray.700')} rounded={{base:20,md:24}}>
      <Box p={{base:4,md:5}} > 

         <Flex alignItems="center" mb={4}>
            <Avatar src={post.author.avatar} name={post.author.name} mr={4} />
            <Box>
              <Text fontWeight="semibold">{post.author.name}</Text>
              <Text color="gray.500" fontSize="sm">@{post.author.username}</Text>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Container>
    <Box pos={'sticky'} top={8} px={{base:3,lg:0}} >
<Heading as="h2" size="lg" mb={4}>Related Posts</Heading>
    <PostsCards maxW={{base:'auto',lg:'300'}}/>
    </Box>
            </Flex>
  )
}


export default PostPage