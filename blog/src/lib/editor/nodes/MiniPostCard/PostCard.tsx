import { PostSelect } from "@/src/types";
import { formatPostPermalink } from "@/src/utils";
import {
  Box,
  Input,
  VStack,
  Text,
  Image,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import React, { useEffect, useState } from "react";

interface PostCardAttrs {
  postId: number | string;
  customTitle?: string;
}

// Search Component

// Post Card Component
export const PostCard = ({
  node,
  updateAttributes,
}: {
  node: { attrs: PostCardAttrs };
  updateAttributes: (attrs: Partial<PostCardAttrs>) => void;
}) => {
  const [post, setPost] = useState<PostSelect | null>(null);
  const [customTitle, setCustomTitle] = useState(node.attrs.customTitle || "");
  const bgColor = useColorModeValue("gray.50", "gray.800");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${node.attrs.postId}`);
        const { data } = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      }
    };
    fetchPost();
  }, [node.attrs.postId]);

  if (!post) return <Spinner />;

  return (
    <NodeViewWrapper>
      <NodeViewContent>
        <Box
          p={4}
          rounded="lg"
          bg={bgColor}
          border="1px"
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          <VStack align="stretch" spacing={3}>
            <Input
              placeholder="Add custom title (optional)"
              value={customTitle}
              onChange={(e) => {
                setCustomTitle(e.target.value);
                updateAttributes({ customTitle: e.target.value });
              }}
            />
            <Box
              as="a"
              href={`${formatPostPermalink(post)}`}
              _hover={{ textDecoration: "none" }}
            >
              {post.featured_image && (
                <Image
                  src={post.featured_image.url}
                  alt={post.featured_image.alt_text}
                  width="100%"
                  height="200px"
                  objectFit="cover"
                  rounded="md"
                />
              )}
              <VStack align="start" mt={3} spacing={2}>
                <Text fontSize="xl" fontWeight="bold">
                  {post.title}
                </Text>
                <Text noOfLines={2}>{post.summary}</Text>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </NodeViewContent>
    </NodeViewWrapper>
  );
};
