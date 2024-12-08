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
  InputRightElement,
  InputGroup,
  Button,
  HStack,
} from "@chakra-ui/react";
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import React, { useCallback, useEffect, useState } from "react";
import { PostSearchBlock } from "./PostSearch";
import { debounce } from "lodash";
import { LuSearch } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PostCardAttrs {
  postId: number | string | null;
  customTitle?: string;
}

export const PostCard = ({
  node,
  updateAttributes,
  editor,
  getPos,
}: NodeViewProps) => {
  const [post, setPost] = useState<PostSelect | null>(null);
  const [customTitle, setCustomTitle] = useState(node.attrs.customTitle || "");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<PostSelect[]>([]);
  const [query, setQuery] = useState("");
  const bgColor = useColorModeValue("gray.50", "gray.800");

  const searchPosts = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setPosts([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          `/api/posts/search?q=${searchQuery}&limit=5`
        );
        const { data } = await response.json();
        setPosts(data.data);
      } catch (error) {
        console.error("Search failed:", error);
      }
      setLoading(false);
    }, 300),
    []
  );

  const selectPost = (selectedPost: PostSelect) => {
    if (typeof getPos === "function") {
      const pos = getPos();
      editor
        .chain()
        .focus()
        .setNodeSelection(pos)
        .command(({ tr }) => {
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            postId: selectedPost.post_id,
          });
          return true;
        })
        .run();
    }
  };
  const { data: fetchedPost, isFetching } = useQuery({
    queryKey: ["post_card_post", node.attrs.postId],
    queryFn: async () => {
      const { data } = await axios(`/api/posts/${node.attrs.postId}`);

      return data.data;
    },
    enabled: !!node.attrs.postId,
  });
  // useEffect(() => {
  //   const fetchPost = async () => {
  //     if (!node.attrs.postId) return;
  //     try {
  //       const response = await fetch(`/api/posts/${node.attrs.postId}`);
  //       const { data } = await response.json();
  //       setPost(data.data);
  //     } catch (error) {
  //       console.error("Failed to fetch post:", error);
  //     }
  //   };
  //   fetchPost();
  // }, [node.attrs.postId]);

  // Search Block UI
  if (!node.attrs.postId) {
    return (
      <NodeViewWrapper>
        <Box
          p={4}
          border="2px"
          borderStyle="dashed"
          borderColor={useColorModeValue("gray.200", "gray.700")}
          rounded="lg"
        >
          <VStack spacing={4}>
            <Text>Search and select a post to embed</Text>
            <InputGroup>
              <Input
                placeholder="Search posts..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  searchPosts(e.target.value);
                }}
              />
              <InputRightElement>
                {loading ? <Spinner size="sm" /> : <LuSearch />}
              </InputRightElement>
            </InputGroup>

            {posts.length > 0 && (
              <VStack align="stretch" width="100%">
                {posts.map((searchPost) => (
                  <Button
                    key={searchPost.id}
                    onClick={() => selectPost(searchPost)}
                    variant="ghost"
                    justifyContent="flex-start"
                    height="auto"
                    py={2}
                  >
                    <HStack spacing={3}>
                      {searchPost.featured_image && (
                        <Image
                          src={searchPost.featured_image.url}
                          alt={searchPost.featured_image.alt_text}
                          boxSize="40px"
                          objectFit="cover"
                          rounded="md"
                        />
                      )}
                      <Text>{searchPost.title}</Text>
                    </HStack>
                  </Button>
                ))}
              </VStack>
            )}
          </VStack>
        </Box>
      </NodeViewWrapper>
    );
  }
  console.log({ post, fetchedPost });

  // Post Card Display UI
  if (isFetching)
    return (
      <NodeViewWrapper>
        <Spinner />
      </NodeViewWrapper>
    );
  if (!fetchedPost)
    return (
      <NodeViewWrapper>
        <></>
      </NodeViewWrapper>
    );
  return (
    <NodeViewWrapper>
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
            href={`${formatPostPermalink(fetchedPost)}`}
            _hover={{ textDecoration: "none" }}
          >
            {fetchedPost.featured_image && (
              <Image
                src={fetchedPost.featured_image.url}
                alt={fetchedPost.featured_image.alt_text}
                width="100%"
                height="200px"
                objectFit="cover"
                rounded="md"
              />
            )}
            <VStack align="start" mt={3} spacing={2}>
              <Text fontSize="xl" fontWeight="bold">
                {fetchedPost.title}
              </Text>
              <Text noOfLines={2}>{fetchedPost.summary}</Text>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </NodeViewWrapper>
  );
};
