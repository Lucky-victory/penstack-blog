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
} from "@chakra-ui/react";
import { format } from "date-fns";
import { LuBookmark, LuShare } from "react-icons/lu";
import { PostsCards } from "../../../../themes/smooth-land/PostsCards";
import { PostSelect } from "@/src/types";
import Loader from "../../Loader";
import PageWrapper from "../../PageWrapper";
import { decode } from "html-entities";
import { Link } from "@chakra-ui/next-js";
import { useTrackView } from "@/src/hooks/useTrackView";
import { objectToQueryParams } from "@/src/utils";

const PostPage: React.FC<{ post: PostSelect }> = ({ post }) => {
  useTrackView(post.id);
  const postContentBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.800");
  const authorTextColor = useColorModeValue("gray.800", "gray.300");
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
          {/* <Button
            onClick={() => {
              signOut();
            }}
          >
            signout{" "}
          </Button> */}
          <Container maxW="container.xl">
            <Box minH={300}>
              <ChakraImage
                src={
                  (post.featured_image?.url as string) ||
                  `/api/og?${objectToQueryParams({
                    title: post.title,
                    date: post?.published_at
                      ? post?.published_at
                      : post?.created_at,
                    username: post?.author?.username,
                    avatar: post?.author?.avatar,
                    name: post?.author?.name,
                    category: post?.category?.name,
                  })}`
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
                    p={{ base: 2, md: 0 }}
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
                      {post?.category?.name && (
                        <Tag
                          size="md"
                          colorScheme="blue"
                          borderRadius="md"
                          px={3}
                          py={1}
                          // bg={useColorModeValue("blue.50", "black")}
                          // color={useColorModeValue("blue.600", "blue.300")}
                          textTransform={"capitalize"}
                        >
                          {post.category.name}
                        </Tag>
                      )}

                      <Text color="gray.500" as="span">
                        {format(
                          new Date(post.updated_at as Date),
                          "MMMM d, yyyy"
                        )}
                      </Text>
                    </HStack>
                    <Box as="header" mb={8}>
                      <Heading as="h1" size="2xl">
                        {post.title}
                      </Heading>
                      {post?.tags && (
                        <Flex flexWrap="wrap" gap={2} mb={4}>
                          {post?.tags?.map((tag, index) => (
                            <Tag
                              key={index}
                              bg={"gray.200"}
                              color="gray.700"
                              size="sm"
                            >
                              #{tag?.name}
                            </Tag>
                          ))}
                        </Flex>
                      )}
                    </Box>

                    <Box className="prose" maxW="none" pb={8}>
                      {post.summary && (
                        <Text
                          fontSize="xl"
                          fontWeight="medium"
                          mb={4}
                          color="gray.600"
                        >
                          {post.summary}
                        </Text>
                      )}
                      <Box
                        dangerouslySetInnerHTML={{
                          __html: decode(post.content) as string,
                        }}
                      />
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
              borderTop={"1px"}
              borderColor={borderColor}
              // pt={10}
              bg={postContentBg}
              roundedBottom={{ base: 20, md: 24 }}
            >
              <VStack align={"start"} px={{ base: 2, md: 3 }} py={4}>
                <Heading size="md">Written By</Heading>

                <Flex mb={4}>
                  <Link href={`/author/${post.author.username}`}>
                    <Avatar
                      rounded={"md"}
                      src={post.author.avatar}
                      name={post.author.name}
                      mr={4}
                    />
                  </Link>
                  <Box>
                    <Link href={`/author/${post.author.username}`}>
                      <Text fontWeight="semibold" lineHeight={1}>
                        {post.author.name}
                      </Text>
                      <Text color="gray.500" fontSize="sm">
                        @{post.author.username}
                      </Text>
                    </Link>
                    {post?.author?.bio && (
                      <Text
                        mt={3}
                        color={authorTextColor}
                        fontSize="sm"
                        maxW={600}
                      >
                        {post?.author?.bio}
                      </Text>
                    )}
                  </Box>
                </Flex>
              </VStack>
            </Box>
          </Container>
        </Flex>
      )}
    </PageWrapper>
  );
};
export default PostPage;
