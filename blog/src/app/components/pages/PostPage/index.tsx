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
  Tooltip,
  Popover,
  PopoverTrigger,
  useBreakpointValue,
  PopoverContent,
  PopoverBody,
  List,
  ListItem,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { LuBookmark, LuHeart, LuShare } from "react-icons/lu";
import { PostsCards } from "../../../../themes/smooth-land/PostsCards";
import { PostSelect } from "@/src/types";
import Loader from "../../Loader";
import PageWrapper from "../../PageWrapper";
import { decode } from "html-entities";
import { Link } from "@chakra-ui/next-js";
import { useTrackView } from "@/src/hooks/useTrackView";
import { objectToQueryParams } from "@/src/utils";
import { ContentRenderer } from "../../Renderers/ContentRenderer";

const PostPage: React.FC<{ post: PostSelect }> = ({ post }) => {
  // useTrackView(post.id);
  const postContentBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.800");
  const authorTextColor = useColorModeValue("gray.800", "gray.300");
  const [isLoading, setIsLoading] = useState(true);
  const popoverTrigger = useBreakpointValue({ base: "click", md: "hover" }) as
    | "click"
    | "hover";
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
              />
            </Box>
            <Box px={{ base: 0, md: 5 }} bg={postContentBg} py={6}>
              <Box pos={"relative"} zIndex={10}>
                <Box>
                  <Flex gap={{ base: 4, md: 6 }}>
                    <VStack
                      shadow={{ base: "lg", md: "none" }}
                      gap={{ base: 8, md: 12 }}
                      zIndex={{ base: 1000, md: 0 }}
                      pos={{ base: "fixed", md: "relative" }}
                      top={"50%"}
                      transform={{ base: "translateY(-50%)", md: "none" }}
                      left={0}
                      h={{ base: "auto", md: "100%" }}
                      bg={postContentBg}
                      roundedRight={{ base: 20, md: 0 }}
                      p={{ base: 2, md: 0 }}
                    >
                      <VStack mt={{ base: 4, md: 5 }} gap={{ base: 4, md: 6 }}>
                        <Tooltip label="Save">
                          <IconButton
                            icon={<LuBookmark />}
                            variant={"outline"}
                            rounded={"full"}
                            aria-label="bookmark this post"
                          />
                        </Tooltip>
                        <Tooltip label="Share post">
                          <IconButton
                            icon={<LuShare />}
                            variant={"outline"}
                            rounded={"full"}
                            aria-label="share this post"
                          />
                        </Tooltip>
                        <Tooltip label="Add reaction">
                          <Popover
                            trigger={popoverTrigger}
                            placement="top-start"
                          >
                            <PopoverTrigger>
                              <IconButton
                                icon={<LuHeart />}
                                variant={"outline"}
                                rounded={"full"}
                                aria-label="Add reaction"
                              />
                            </PopoverTrigger>
                            <PopoverContent rounded={"xl"} w={"auto"}>
                              <PopoverBody>
                                <List
                                  display={"flex"}
                                  gap={4}
                                  alignItems={"center"}
                                >
                                  <ListItem>
                                    <Tooltip label="Like">
                                      <IconButton
                                        icon={
                                          <Text as={"span"} fontSize={24}>
                                            💖
                                          </Text>
                                        }
                                        variant={"ghost"}
                                        rounded={"full"}
                                        aria-label="Like"
                                      />
                                    </Tooltip>
                                  </ListItem>
                                  <ListItem>
                                    <Tooltip label="Grateful">
                                      <IconButton
                                        icon={
                                          <Text as={"span"} fontSize={24}>
                                            🙌
                                          </Text>
                                        }
                                        variant={"ghost"}
                                        rounded={"full"}
                                        aria-label="Grateful"
                                      />
                                    </Tooltip>
                                  </ListItem>
                                  <ListItem>
                                    <Tooltip label="Celebrate">
                                      <IconButton
                                        icon={
                                          <Text as={"span"} fontSize={24}>
                                            🥳
                                          </Text>
                                        }
                                        variant={"ghost"}
                                        rounded={"full"}
                                        aria-label="Celebrate"
                                      />
                                    </Tooltip>
                                  </ListItem>
                                </List>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </Tooltip>
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
                    <Box as="article" flex={1}>
                      <HStack my={4} gap={{ base: 5, md: 7 }} ml={0}>
                        {post?.category?.name && (
                          <Tag
                            size="md"
                            colorScheme="blue"
                            borderRadius="md"
                            px={3}
                            py={1}
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
                        {post?.tags && (
                          <Flex flexWrap="wrap" gap={2} my={4}>
                            {post?.tags?.map((tag, index) => (
                              <Tag key={index} colorScheme="gray">
                                #{tag?.name}
                              </Tag>
                            ))}
                          </Flex>
                        )}
                        <Heading as="h1" size="2xl">
                          {post.title}
                        </Heading>
                      </Box>

                      <Box maxW="none" pb={8}>
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
                        <ContentRenderer content={decode(post.content)} />
                      </Box>
                    </Box>
                  </Flex>
                </Box>
              </Box>

              <Box
                pos={"relative"}
                py={{ base: 4, md: 6 }}
                mt={6}
                borderTop={"1px"}
                borderColor={borderColor}
                bg={postContentBg}
              >
                <VStack align={"start"} py={4}>
                  <Heading size="md" mb={3}>
                    Written By
                  </Heading>

                  <HStack mb={4}>
                    <Link href={`/author/${post.author.username}`}>
                      <Avatar
                        rounded={"full"}
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
                  </HStack>
                </VStack>
              </Box>
            </Box>
          </Container>
        </Flex>
      )}
    </PageWrapper>
  );
};
export default PostPage;
