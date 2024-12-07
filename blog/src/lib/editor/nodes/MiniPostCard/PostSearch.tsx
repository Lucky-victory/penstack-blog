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
} from "@chakra-ui/react";
import { debounce } from "lodash";
import { useState, useCallback } from "react";
import { LuSearch } from "react-icons/lu";

export const PostSearch = ({
  onSelect,
}: {
  onSelect: (post: PostSelect) => void;
}) => {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<PostSelect[]>([]);
  const [loading, setLoading] = useState(false);

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
        setPosts(data);
      } catch (error) {
        console.error("Search failed:", error);
      }
      setLoading(false);
    }, 300),
    []
  );
  console.log(posts);
  return (
    <Box position="relative" width="100%">
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
        <Menu isOpen>
          <MenuList maxH="300px" overflowY="auto">
            {posts.map((post) => (
              <MenuItem
                key={post.id}
                onClick={() => {
                  onSelect(post);
                  setQuery("");
                  setPosts([]);
                }}
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
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      )}
    </Box>
  );
};
