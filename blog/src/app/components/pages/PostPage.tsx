"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  HStack,
  Stack,
  VStack,
  Text,
  Flex,
  Avatar,
  Tag,
  Image as ChakraImage,
  useColorModeValue,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { LuBookmark, LuBookmarkPlus, LuShare } from "react-icons/lu";
import { PostsCards } from "../PostsCards";
import { usePost } from "@/src/hooks";
import { PostSelect } from "@/src/types";
import { Skeleton } from "@/src/app/components/ui/Skeleton";
import Loader from "../Loader";
import PageWrapper from "../PageWrapper";

interface FeaturedImage {
  src: string;
  alt_text: string;
}

const PostPage: React.FC<{ post: PostSelect }> = ({ post }) => {
  const postContentBg = useColorModeValue("white", "gray.900");
  const imageWrapBg = useColorModeValue("gray.200", "gray.800");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (post) {
      setIsLoading(false);
    }
  }, [post]);
  if (isLoading || !post) {
    return (
      <Stack h={"100vh"} align={"center"} justify={"center"}>
        <Loader />
      </Stack>
    );
  }
  return (
    <PageWrapper>
      {post && (
        <Flex
          alignItems={{ base: "normal", lg: "flex-start" }}
          py={8}
          pos={"relative"}
          direction={{ base: "column", lg: "row" }}
          flexWrap={{ base: "wrap", lg: "nowrap" }}
          gap={{ base: 5, lg: 6 }}
          maxW={1400}
          mx="auto"
        >
          <Container maxW="6xl">
            <Box minH={300}>
              <ChakraImage
                src={
                  post.featured_image!?.url ?? "https://picsum.photos/1200/600"
                }
                alt={post.featured_image!?.alt_text || ""}
                w="full"
                h="auto"
                maxH={600}
                minH={"300px"}
                objectFit={"cover"}
                roundedTop={{ base: 20, md: 24 }}
              />
            </Box>

            <Box
              // mt={{ base: -16, md: -20 }}
              pos={"relative"}
              // px={{ base: 2, sm: 3, md: 3, lg: 5 }}
              zIndex={2}
            >
              <Box
                bg={postContentBg}
                // rounded={{ base: 20, md: 24 }}
                p={{ base: 2, sm: 3, md: 4, lg: 6 }}
              >
                <Flex gap={{ base: 4, md: 6 }}>
                  <VStack
                    shadow={{ base: "lg", md: "none" }}
                    gap={{ base: 8, md: 12 }}
                    pos={{ base: "fixed", md: "relative" }}
                    top={"50%"}
                    transform={{ base: "translateY(-50%)", md: "none" }}
                    left={0}
                    h={{ base: "auto", md: "100%" }}
                    bg={postContentBg}
                    roundedRight={{ base: 20, md: 0 }}
                    p={{ base: 3, md: 0 }}
                  >
                    <VStack mt={{ base: 4, md: 12 }} gap={4}>
                      <IconButton
                        icon={<LuBookmark />}
                        variant={"outline"}
                        rounded={"full"}
                        aria-label="bookmark this post"
                      />
                      <IconButton
                        icon={<LuShare />}
                        variant={"outline"}
                        rounded={"full"}
                        aria-label="share this post"
                      />
                    </VStack>
                    <Box
                      as={Flex}
                      flexDir={"column"}
                      alignItems={"center"}
                      fontSize={{ base: "small", md: "medium", lg: "large" }}
                    >
                      <Text as="span" fontWeight={"bold"} fontSize={"100%"}>
                        {post?.views?.count}
                      </Text>
                      <Text as="span" fontSize={"90%"}>
                        views
                      </Text>
                    </Box>
                  </VStack>
                  <Box as="article" px={4}>
                    <HStack my={4} gap={{ base: 5, md: 7 }} ml={0}>
                      {post?.category && (
                        <Text as="span" color="gray.500" fontWeight="semibold">
                          {post?.category?.name || "Technology"}
                        </Text>
                      )}

                      <Text color="gray.500" as="span">
                        {format(
                          new Date(post.updated_at as Date),
                          "MMMM d, yyyy"
                        )}
                      </Text>
                    </HStack>
                    <Box as="header" mb={8}>
                      <Heading as="h1" size="2xl" mb={4}>
                        {post.title}
                      </Heading>
                      {/* <Flex flexWrap="wrap" gap={2} mb={4}>
            {post?.tags && post?.tags?.map((tag, index) => (
              <Tag key={index} bg={"gray.200"} color="gray.700" size="sm" >
                #{tag}
              </Tag>
            ))}
          </Flex> */}
                    </Box>

                    <Box className="prose" maxW="none" pb={8}>
                      <Text
                        fontSize="xl"
                        fontWeight="semibold"
                        mb={4}
                        color="gray.600"
                      >
                        {post.summary}
                      </Text>
                      <Box
                        dangerouslySetInnerHTML={{
                          __html: post.content as string,
                        }}
                      />
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Quidem dicta, dolorum alias fugiat rerum ut dolor eaque
                      exercitationem amet vitae totam ipsam neque voluptatum
                      cupiditate consequuntur atque nobis mollitia facere. harum
                      omnis.
                    </Box>
                  </Box>
                </Flex>
              </Box>
            </Box>

            <Box
              // mt={-10}
              pos={"relative"}
              px={{ base: 3, md: 4 }}
              py={{ base: 4, md: 6 }}
              // pt={10}
              bg={imageWrapBg}
              roundedBottom={{ base: 20, md: 24 }}
            >
              <VStack align={"start"} px={{ base: 2, md: 3 }} py={4}>
                <Heading size="md">Written By</Heading>
                <Flex alignItems="center" mb={4}>
                  <Avatar
                    src={post.author.avatar}
                    name={post.author.name}
                    mr={4}
                  />
                  <Box>
                    <Text fontWeight="semibold">{post.author.name}</Text>
                    <Text color="gray.500" fontSize="sm">
                      @{post.author.username}
                    </Text>
                  </Box>
                </Flex>
              </VStack>
            </Box>
          </Container>
          <Box px={3} py={4} flex={1}>
            <Box
              // h={800}
              bg={"gray.50"}
              rounded={{ base: 20, lg: 24 }}
              pos={{ base: "relative", lg: "sticky" }}
              top={{ base: 0, lg: 8 }}
              p={3}
            >
              <Heading as="h2" size="lg" mb={4}>
                Related Posts
              </Heading>

              <PostsCards />
            </Box>
          </Box>
        </Flex>
      )}
    </PageWrapper>
  );
};

export default PostPage;
