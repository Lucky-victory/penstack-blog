"use client";
import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { LuMessageCircle } from "react-icons/lu";
import { PostSelect } from "@/src/types";
import Loader from "../../Loader";
import PageWrapper from "../../PageWrapper";
import { useTrackView } from "@/src/hooks/useTrackView";
import { objectToQueryParams } from "@/src/utils";
import { motion } from "framer-motion";
import { SocialActions } from "./SocialActions";
import { ArticleHeader } from "./ArticleHeader";
import { ArticleContent } from "./ArticleContent";
import { AuthorSection } from "./AuthorSection";
import { CommentCard } from "./CommentCard";
import axios from "axios";
import { encode } from "html-entities";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const MotionBox = motion(Box);

const PostPage: React.FC<{ post: PostSelect }> = ({ post }) => {
  // useTrackView(post.id);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const highlightColor = useColorModeValue("blue.50", "blue.900");

  const sidebarWidth = useBreakpointValue({ base: "60px", md: "80px" });
  const bgColor = useColorModeValue("gray.50", "gray.800");

  const {
    data: comments,
    isPending: isFetching,
    refetch,
  } = useQuery({
    queryKey: ["comments", post?.post_id || ""],
    queryFn: fetchComments,
  });
  async function fetchComments() {
    try {
      const { data } = await axios(`/api/posts/${post.post_id}/comments`);
      return data.data;
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  }

  // Handle new comment submission
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/posts/${post.post_id}/comments`, {
        content: encode(newComment),
      });

      if (response.status === 201) {
        toast({
          title: "Comment posted successfully",
          status: "success",
        });
        setNewComment("");
        refetch();
      }
    } catch (error) {
      toast({
        title: "Failed to post comment",
        status: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching || !post) {
    return <Loader />;
  }

  return (
    <PageWrapper>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Post Content Section */}
        <Container maxW="container.xl" py={8}>
          {/* Breadcrumb */}
          <Breadcrumb mb={4}>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href="/">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href="/blog">
                Blog
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{post.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Hero Image */}
          <Box borderRadius="xl" overflow="hidden" mb={8}>
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
              aspectRatio={"16/9"}
              objectFit="cover"
            />
          </Box>

          {/* Main Content Area */}
          <Flex gap={8}>
            {/* Sidebar */}
            <VStack
              w={sidebarWidth}
              position="sticky"
              top={8}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              <SocialActions post={post} />
            </VStack>

            {/* Article Content */}
            <Box flex={1}>
              <ArticleHeader post={post} />
              <ArticleContent post={post} />
              <AuthorSection post={post} />

              {/* Comments Section */}
              <Box mt={12}>
                <Heading size="lg" mb={6}>
                  Comments
                </Heading>

                {/* New Comment Form */}
                <Card mb={8} rounded="xl">
                  <CardBody bg={bgColor} borderRadius="xl">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      size="lg"
                      mb={4}
                      maxH={200}
                    />
                    <Button
                      colorScheme="blue"
                      isLoading={isSubmitting}
                      onClick={handleCommentSubmit}
                    >
                      Post Comment
                    </Button>
                  </CardBody>
                </Card>

                {/* Comments List */}
                {!isFetching && comments.length > 0 ? (
                  <VStack spacing={6} align="stretch" bg={bgColor}>
                    {comments.map((comment: any) => (
                      <CommentCard key={comment.id} comment={comment} />
                    ))}
                  </VStack>
                ) : (
                  !isFetching && (
                    <Box
                      p={8}
                      textAlign="center"
                      bg={highlightColor}
                      borderRadius="xl"
                    >
                      <LuMessageCircle
                        size={40}
                        style={{ margin: "0 auto 16px" }}
                      />
                      <Text fontSize="lg">
                        Be the first to share your thoughts!
                      </Text>
                    </Box>
                  )
                )}
              </Box>
            </Box>
          </Flex>
        </Container>
      </MotionBox>
    </PageWrapper>
  );
};

export default PostPage;
