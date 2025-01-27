"use client";
import {
  Box,
  Container,
  Text,
  Heading,
  VStack,
  Grid,
  useColorModeValue,
  Flex,
  Card,
  Stack,
  Avatar,
  CardBody,
} from "@chakra-ui/react";
import React from "react";
import { Newsletter } from "../../NewsLetter";
import { useAuthor, useAuthorPosts } from "@/src/hooks";
import Loader from "../../Loader";
import PageWrapper from "../../PageWrapper";
import NewPostCard from "../../../../themes/raised-land/NewPostCard";
import { NewPostCardLoader } from "../../../../themes/raised-land/NewPostCardLoader";
import { PostCardLoader } from "@/src/themes/smooth-land/PostCardLoader";
import PostCard from "@/src/themes/smooth-land/PostCard";
import { PostsCards } from "@/src/themes/smooth-land/PostsCards";

const AuthorPage = ({ username }: { username: string }) => {
  const bgColor = useColorModeValue("gray.100", "inherit");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const { author, loading: isAuthorLoading } = useAuthor(username);
  const { posts, loading: isAuthorPostsLoading } = useAuthorPosts({ username });

  return (
    <PageWrapper>
      <Box minH="100vh" bg={bgColor} py={12} mb={8}>
        <Container maxW="7xl">
          {/* Author Profile Section */}
          {isAuthorLoading ? (
            <Card mb={12} h={200}>
              <Stack align={"center"} h="full" justify="center">
                <Loader />
              </Stack>
            </Card>
          ) : (
            <Card
              // bg={cardBgColor}
              // borderRadius="3xl"
              // p={{ base: 4, md: 6, lg: 8 }}
              mb={6}
            >
              <CardBody>
                <Flex
                  direction={{ base: "column", md: "row" }}
                  align={{ base: "center", md: "start" }}
                  gap={8}
                >
                  <Avatar
                    src={author?.avatar as string}
                    name={author?.name}
                    w="128px"
                    h="128px"
                    borderRadius="full"
                    objectFit="cover"
                    border={"4px solid rgba(255, 255, 255, 0.6)"}
                  />

                  <VStack
                    flex={1}
                    align={{ base: "center", md: "start" }}
                    spacing={2}
                  >
                    <Stack gap={0} align={"start"}>
                      <Heading size="xl">{author?.name}</Heading>
                      <Text
                        as={"span"}
                        color={"gray.500"}
                        textAlign={{ base: "center", md: "left" }}
                      >
                        @{author?.username}
                      </Text>
                    </Stack>
                    {author?.title && (
                      <Text color="brand.500" fontWeight="medium">
                        {author?.title}
                      </Text>
                    )}
                    <Text color={textColor} maxW="2xl">
                      {author?.bio}
                    </Text>

                    {/* <HStack
                spacing={4}
                wrap="wrap"
                justify={{ base: "center", md: "start" }}
                >
                <Link
                  isExternal
                  href={`https://twitter.com/${author?.socials?.twitter}`}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  color={textColor}
                  _hover={{ color: "brand.500" }}
                  >
                  <LuTwitter size={20} />
                  <Text>{author?.socials?.twitter}</Text>
                  </Link>
                  <Link
                  isExternal
                  href={`https://github.com/${author?.socials?.github}`}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  color={textColor}
                  _hover={{ color: "brand.500" }}
                  >
                  <LuGithub size={20} />
                  <Text>{author?.socials?.github}</Text>
                  </Link>
                  <Link
                  isExternal
                  href={`mailto:${author?.socials?.email}`}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  color={textColor}
                  _hover={{ color: "brand.500" }}
                  >
                  <LuMail size={20} />
                  <Text>{author?.socials?.email}</Text>
                  </Link>
                  <Link
                  isExternal
                  href={`https://${author?.socials?.website}`}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  color={textColor}
                  _hover={{ color: "brand.500" }}
                  >
                  <LuLink size={20} />
                  <Text>{author?.socials?.website}</Text>
                  </Link>
                  </HStack> */}
                  </VStack>
                </Flex>
              </CardBody>
            </Card>
          )}
          <Card mb={12}>
            <CardBody>
              <Box mx={"auto"} maxW={"2xl"}>
                <Newsletter
                  isDark={false}
                  title="Subscribe to My Newsletter"
                  maxW={"2xl"}
                />
              </Box>
            </CardBody>
          </Card>

          <Box mt={8}>
            <Heading size="lg" mb={8}>
              Articles by {author?.name}
            </Heading>

            {isAuthorPostsLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <PostCardLoader key={index} />
              ))
            ) : (
              <PostsCards showAuthor={false} posts={posts} />
            )}
          </Box>
        </Container>
      </Box>
    </PageWrapper>
  );
};

export default AuthorPage;
