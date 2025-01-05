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
  Card,
} from "@chakra-ui/react";
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import React, { useCallback, useEffect, useState } from "react";
import { PostSearchBlock } from "./PostSearch";
import { debounce } from "lodash";
import { LuSearch } from "react-icons/lu";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MiniPostCardRenderer } from "@/src/app/components/Renderers/MiniPostCardRenderer";

interface PostCardProps extends NodeViewProps {
  isRendering?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  node,
  updateAttributes,
  editor,
  getPos,
}) => {
  const [customTitle, setCustomTitle] = useState(node?.attrs.customTitle || "");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const {
    data: posts,
    isPending: isSearching,
    mutateAsync,
  } = useMutation({
    mutationKey: ["search_posts", query],
    mutationFn: async (query: string) => {
      setLoading(true);
      try {
        const { data } = await axios<{ data: PostSelect[] }>(
          `/api/posts/search?q=${query}&limit=5`
        );

        return data.data;
      } catch (error) {
        console.error("Search failed:", error);
      }
      setLoading(false);
    },
  });
  const handleSearch = debounce(async (query: string) => {
    mutateAsync(query);
  }, 300);

  const selectPost = (selectedPost: PostSelect) => {
    if (typeof getPos === "function") {
      const pos = getPos();
      editor
        .chain()
        .focus()
        .setNodeSelection(pos)
        .command(({ tr, state }) => {
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            postIds: [...node.attrs.postIds, selectedPost.post_id],
          });
          return true;
        })
        .run();
    }
  };

  // Search Block UI
  if (!node.attrs.postIds?.length) {
    return (
      <NodeViewWrapper>
        <Card>
          <Box
            p={4}
            border="2px"
            borderStyle="dashed"
            borderColor={borderColor}
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
                    handleSearch(e.target.value);
                  }}
                />
                <InputRightElement>
                  {loading ? <Spinner size="sm" /> : <LuSearch />}
                </InputRightElement>
              </InputGroup>

              {posts && posts?.length > 0 && (
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
        </Card>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper>
      <>
        <MiniPostCardRenderer
          isEditing
          node={node}
          inputValue={customTitle}
          onInputChange={(e) => {
            setCustomTitle(e.target.value);
            updateAttributes({ customTitle: e.target.value });
          }}
        />
      </>
    </NodeViewWrapper>
  );
};
