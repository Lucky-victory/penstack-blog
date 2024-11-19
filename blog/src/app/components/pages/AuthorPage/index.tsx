"use client";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Container,
  Image,
  Text,
  Heading,
  VStack,
  HStack,
  Grid,
  Input,
  Button,
  FormControl,
  useColorModeValue,
  Flex,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Tag,
  Stack,
  Avatar,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { LuMail, LuTwitter, LuGithub, LuLink, LuSend } from "react-icons/lu";
import { Newsletter } from "../../NewsLetter";
import { PostSelect } from "@/src/types";
import PostCard from "../../../../themes/smooth-land/PostCard";
import { useAuthor, useAuthorPosts } from "@/src/hooks";
import Loader from "../../Loader";
import { PostCardLoader } from "../../../../themes/smooth-land/PostCardLoader";
import PageWrapper from "../../PageWrapper";
import NewPostCard from "../../../../themes/raised-land/NewPostCard";
import { NewPostCardLoader } from "../../../../themes/raised-land/NewPostCardLoader";

const AuthorPage = ({ username }: { username: string }) => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const { author, loading: isAuthorLoading } = useAuthor(username);
  const { posts, loading: isAuthorPostsLoading } = useAuthorPosts({ username });

  return (
    <PageWrapper>
      <Box minH="100vh" bg={bgColor} py={12}>
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
              bg={cardBgColor}
              borderRadius="3xl"
              p={{ base: 4, md: 6, lg: 8 }}
              mb={12}
            >
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
                  <Stack gap={0}>
                    <Heading size="xl">{author?.name}</Heading>
                    <Text as={"span"} color={"gray.500"}>
                      @{author?.username}
                    </Text>
                  </Stack>
                  {author?.title && (
                    <Text color="blue.500" fontWeight="medium">
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
                  _hover={{ color: "blue.500" }}
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
                  _hover={{ color: "blue.500" }}
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
                  _hover={{ color: "blue.500" }}
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
                  _hover={{ color: "blue.500" }}
                >
                  <LuLink size={20} />
                  <Text>{author?.socials?.website}</Text>
                </Link>
              </HStack> */}
                </VStack>
              </Flex>
            </Card>
          )}
          <Newsletter title="Subscribe to My Newsletter" />

          <Box mt={8}>
            <Heading size="lg" mb={8}>
              Articles by {author?.name}
            </Heading>
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={8}
            >
              {isAuthorPostsLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <NewPostCardLoader key={index} />
                  ))
                : posts?.map((post) => (
                    <NewPostCard showAuthor={false} key={post.id} post={post} />
                  ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </PageWrapper>
  );
};

export default AuthorPage;
