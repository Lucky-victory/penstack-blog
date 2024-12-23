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
  Divider,
  Button,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { LuBookmark, LuHeart, LuShare, LuMessageCircle } from "react-icons/lu";
import { PostSelect } from "@/src/types";
import Loader from "../../Loader";
import PageWrapper from "../../PageWrapper";
import { decode } from "html-entities";
import { Link } from "@chakra-ui/next-js";
import { useTrackView } from "@/src/hooks/useTrackView";
import { objectToQueryParams } from "@/src/utils";
import { ContentRenderer } from "../../Renderers/ContentRenderer";
import { motion } from "framer-motion";
import { SocialActions } from "./SocialActions";
import { ArticleHeader } from "./ArticleHeader";
import { ArticleContent } from "./ArticleContent";
import { AuthorSection } from "./AuthorSection";
import { CommentCard } from "./CommentCard";

const MotionBox = motion(Box);

const PostPage: React.FC<{ post: PostSelect }> = ({ post }) => {
  useTrackView(post.id);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  // Theme colors
  const postContentBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.800");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const highlightColor = useColorModeValue("blue.50", "blue.900");

  // Responsive settings
  const popoverTrigger = useBreakpointValue({ base: "click", md: "hover" });
  const sidebarWidth = useBreakpointValue({ base: "60px", md: "80px" });

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (post) {
      setIsLoading(false);
      fetchComments();
    }
  }, [post]);

  // Fetch comments
  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${post.post_id}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  // Handle new comment submission
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/posts/${post.post_id}/comments`, {
        method: "POST",
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        toast({
          title: "Comment posted successfully",
          status: "success",
        });
        setNewComment("");
        fetchComments();
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

  if (isLoading || !post) {
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
          {/* Hero Image */}
          <Box borderRadius="xl" overflow="hidden" mb={8} boxShadow="xl">
            <ChakraImage
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
              objectFit="cover"
            />
          </Box>

          {/* Main Content Area */}
          <Flex gap={8}>
            {/* Sidebar */}
            <VStack
              w={sidebarWidth}
              position="sticky"
              top={4}
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
                <Box mb={8}>
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    size="lg"
                    mb={4}
                  />
                  <Button
                    colorScheme="blue"
                    isLoading={isSubmitting}
                    onClick={handleCommentSubmit}
                  >
                    Post Comment
                  </Button>
                </Box>

                {/* Comments List */}
                {comments.length > 0 ? (
                  <VStack spacing={6} align="stretch">
                    {comments.map((comment: any) => (
                      <CommentCard key={comment.id} comment={comment} />
                    ))}
                  </VStack>
                ) : (
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
