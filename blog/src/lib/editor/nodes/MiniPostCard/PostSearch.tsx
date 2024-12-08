import { PostSelect } from "@/src/types";
import {
  Box,
  InputGroup,
  Input,
  InputRightElement,
  Spinner,
  Menu,
  MenuList,
  MenuItem,
  HStack,
  Image,
  Text,
  VStack,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { Editor } from "@tiptap/react";
import { debounce } from "lodash";
import { useState, useCallback } from "react";
import { LuSearch } from "react-icons/lu";

interface PostCardAttrs {
  postId: number | null;
  customTitle?: string;
}

export const PostSearchBlock = ({
  editor,
  node,
  getPos,
}: {
  editor: Editor;
  node: { attrs: PostCardAttrs };
  getPos: () => number;
}) => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<PostSelect[]>([]);
  const [query, setQuery] = useState("");

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

  const selectPost = (post: PostSelect) => {
    const pos = getPos();
    editor
      .chain()
      .focus()
      .setNodeSelection(pos)
      .command(({ tr }) => {
        tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          postId: post.id,
        });
        return true;
      })
      .run();
  };

  return (
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
            {posts.map((post) => (
              <Button
                key={post.id}
                onClick={() => selectPost(post)}
                variant="ghost"
                justifyContent="flex-start"
                height="auto"
                py={2}
              >
                <HStack spacing={3}>
                  {post.featured_image && (
                    <Image
                      src={post.featured_image.url}
                      alt={post.featured_image.alt_text}
                      boxSize="40px"
                      objectFit="cover"
                      rounded="md"
                    />
                  )}
                  <Text>{post.title}</Text>
                </HStack>
              </Button>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};
