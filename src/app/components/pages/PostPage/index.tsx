"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Flex,
  Image,
  useColorModeValue,
  useBreakpointValue,
  Button,
  useToast,
  Textarea,
  Card,
  CardBody,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  HStack,
  Stack,
  Avatar,
  Tag,
} from "@chakra-ui/react";
import { LuMessageCircle } from "react-icons/lu";
import { PostSelect } from "@/src/types";
import Loader from "../../Loader";
import PageWrapper from "../../PageWrapper";
import { useTrackView } from "@/src/hooks/useTrackView";
import { formatDate, objectToQueryParams } from "@/src/utils";
import { motion } from "framer-motion";
import { SocialActions } from "./SocialActions";
import { ArticleHeader } from "./ArticleHeader";
import { ArticleContent } from "./ArticleContent";
import { AuthorSection } from "./AuthorSection";
import { CommentCard } from "./CommentCard";
import axios from "axios";
import { encode } from "html-entities";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@chakra-ui/next-js";
import { CommentsSection } from "./CommentSection";
import { Newsletter } from "../../NewsLetter";

const MotionBox = motion(Box);

const PostPage: React.FC<{ post: PostSelect }> = ({ post }) => {
  // useTrackView(post.id);

  const sidebarWidth = useBreakpointValue({ base: "full", md: "300px" });
  const metaColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  if (!post) {
    return <Loader />;
  }

  return (
    <PageWrapper styleProps={{ px: 0 }}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Post Content Section */}
        <Container maxW="container.xl" py={8}>
          <ArticleHeader post={post} />

          {/* Hero Image */}
          <Box mb={6}>
            <Image
              src={
                post.featured_image?.url ||
                `/api/og?${objectToQueryParams({
                  title: post.title,
                  date: post?.published_at || post?.created_at,
                  username: post?.author?.username,
                  avatar: post?.author?.avatar,
                  name: post?.author?.name,
                  category: post?.category?.name,
                })}`
              }
              alt={post.featured_image?.alt_text || post.title || ""}
              w="full"
              h="auto"
              maxH={600}
              // aspectRatio={"16/9"}
              objectFit="cover"
            />
          </Box>
          <HStack mb={{ base: 8, md: 12 }} justify={"space-between"}>
            <HStack>
              <Avatar
                src={post.author.avatar}
                name={post.author.name}
                size={"sm"}
              />
              <Stack spacing={0}>
                <Link
                  href={"/author/" + post.author.username}
                  fontWeight={500}
                  lineHeight={"tighter"}
                  fontSize={"smaller"}
                >
                  {post.author.name}
                </Link>
                <Text as={"span"} fontSize={"small"} color={metaColor}>
                  Published{" "}
                  {formatDate(
                    new Date(
                      (post.published_at
                        ? post?.published_at
                        : post.created_at) as Date
                    )
                  )}
                </Text>
              </Stack>
            </HStack>

            {post?.tags && (
              <HStack wrap="wrap" gap={2}>
                {post?.tags?.map((tag, index) => (
                  <Tag
                    key={index}
                    rounded={"full"}
                    px={3}
                    // bg={"transparent"}
                    border={"1px solid"}
                    borderColor={borderColor}
                    // colorScheme="gray"
                    textTransform={"capitalize"}
                    // fontWeight={500}
                  >
                    #{tag?.name}
                  </Tag>
                ))}
                <Tag
                  rounded={"full"}
                  px={3}
                  bg={"transparent"}
                  border={"1px solid"}
                  borderColor={borderColor}
                  colorScheme="gray"
                  textTransform={"lowercase"}
                  fontWeight={500}
                >
                  {post?.reading_time || 1} min read
                </Tag>
              </HStack>
            )}
          </HStack>
          {/* Main Content Area */}
          <Flex gap={8}>
            {/* Sidebar */}

            {/* Article Content */}
            <Box flex={1}>
              <ArticleContent post={post} />
              {/* <AuthorSection post={post} /> */}

              {/* Comments Section */}
            </Box>
            <VStack
              w={sidebarWidth}
              position="sticky"
              top={8}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              <SocialActions post={post} />
              <Newsletter canWrap isDark={false} />
            </VStack>
          </Flex>
          <Suspense fallback={<Loader />}>
            <CommentsSection post={post} />
          </Suspense>
        </Container>
      </MotionBox>
    </PageWrapper>
  );
};

export default PostPage;
