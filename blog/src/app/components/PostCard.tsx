import { PostSelect } from "@/src/types"
import { convertToDateFnsFormatAndSlug, formatDate } from "@/src/utils"
import { Link } from "@chakra-ui/next-js"
import { Box, Flex, GridItem, HStack, Image, LinkBox, LinkOverlay, Tag, Text, useColorModeValue } from "@chakra-ui/react"

import {Skeleton,SkeletonCircle,SkeletonText} from './ui/Skeleton'
import { Avatar } from "./ui/Avatar";
import { format } from "date-fns"

export function PostCardLoader(){
    return (
           <GridItem rounded={'24'} overflow={'hidden'} borderWidth={1} borderColor={'gray.300'}>
            <Skeleton height="200px" />
            <Box p={4}>

            <HStack>

              <SkeletonCircle size="10" /> 
<SkeletonText w={24}  noOfLines={1} rounded={'full'}/>
            </HStack>
            <SkeletonText my={3} w={120} noOfLines={1}  rounded={'full'}/>
<SkeletonText mt="4" noOfLines={4} spacing="3"  rounded={'full'}/>
            </Box>
            
          </GridItem>
    )
}
export default function PostCard({post,slugPattern}:{loading?:boolean,slugPattern?:string;post:PostSelect}){
const _slugPattern=convertToDateFnsFormatAndSlug(slugPattern ||'%month%-%day%-%slug%')
console.log({_slugPattern});

    const bgColor=useColorModeValue('white','gray.900')
    return ( <GridItem as={LinkBox} bg={bgColor} key={post.id} borderWidth={1} rounded={'24'} transition={'0.2s ease-in'} overflow="hidden" _hover={{
            boxShadow: '0 0 0 4px var(--chakra-colors-blue-500)',
          }}>
     <Box position="relative">
       <Image src={post.featured_image?.src} alt={post.featured_image?.alt_text} objectFit="cover" height="200" width="full" />
       <Box position="absolute" top={3} right={3}>
         {post?.category && (
           <Tag size="md" colorScheme="blue" borderRadius="full">
             {post.category?.name}
           </Tag>
         )}
       </Box>
     </Box>
          
            <Box p={4}>
              <Link href={`/author/${post.slug}`} _hover={{ textDecoration: 'none' }}>
              <Flex alignItems="center" mb={2}>
                <Avatar src={post?.author?.avatar} name={post?.author?.name} size="sm" mr={2} />
                <Text fontWeight="bold">{post?.author?.name}</Text>
              </Flex>
              </Link>
              <Text fontSize="sm" color="gray.500" mb={2}>
                {post?.published_at?formatDate(new Date(post?.published_at)):formatDate(new Date(post?.updated_at as Date))}
              </Text>

              <LinkOverlay href={`/${format(new Date(post.updated_at as Date),_slugPattern.dateFormat)}/${post.slug}`} _hover={{ textDecoration: 'none' }}>
                <Text fontSize="xl" fontWeight="semibold" mb={2}>
                  {post.title}
                </Text>
              </LinkOverlay>
              <Text noOfLines={3}>{post.content}</Text>
            </Box>
          </GridItem>
 )
}