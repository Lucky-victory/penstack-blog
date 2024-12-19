import {
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Box,
  Input,
  Button,
  List,
  ListItem,
  Spinner,
  Text,
  InputRightAddon,
  InputGroup,
} from "@chakra-ui/react";
import { SectionCard } from "../../../Dashboard/SectionCard";
import { useState } from "react";
import axios from "axios";
import slugify from "slugify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCustomEditorContext } from "@/src/context/AppEditor";

export const TagsSection = () => {
  const { activePost } = useCustomEditorContext();
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const queryClient = useQueryClient();
  const postId = activePost?.post_id || "";

  const { data: postTags, isLoading } = useQuery({
    queryKey: ["postTags", postId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/posts/${postId}/tags`);
      return (data?.data || []) as { id: number; name: string; slug: string }[];
    },
  });

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["tagSearch", searchQuery],
    queryFn: async () => {
      const { data } = await axios.get(`/api/tags/search?q=${searchQuery}`);
      return data?.data;
    },
    enabled: searchQuery.length > 0,
  });

  const createTagMutation = useMutation({
    mutationFn: async (tagName: string) => {
      const { data } = await axios.post("/api/tags", {
        name: tagName,
        slug: slugify(tagName, { lower: true }),
      });
      await addTagToPostMutation.mutateAsync(data?.data?.id);
      return data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tagSearch", postId],
        exact: true,
      });
      setSearchQuery("");
      setShowDropdown(false);
    },
  });

  const addTagToPostMutation = useMutation({
    mutationFn: async (tagId: number) => {
      await axios.post(`/api/posts/${postId}/tags`, {
        tagIds: [tagId],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["postTags", postId],
        exact: true,
      });
      setSearchQuery("");
      setShowDropdown(false);
    },
  });

  const removeTagFromPostMutation = useMutation({
    mutationFn: async (tagId: number) => {
      await axios.patch(`/api/posts/${postId}/tags`, {
        tagIds: [tagId],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["postTags", postId],
        exact: true,
      });
    },
  });

  return (
    <SectionCard title="Tags">
      <HStack p={4} pb={0} gap={2} wrap={"wrap"}>
        {postTags &&
          postTags?.length > 0 &&
          postTags?.map((tag) => (
            <Tag rounded={"full"} key={tag.id} variant="solid">
              <TagLabel>#{tag.name}</TagLabel>
              <TagCloseButton
                onClick={() => removeTagFromPostMutation.mutate(tag.id)}
              />
            </Tag>
          ))}
      </HStack>

      <Box p={4} position="relative">
        <InputGroup size={"sm"}>
          <Input
            placeholder="Search or create tag"
            size={"sm"}
            value={searchQuery}
            rounded={"full"}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
          />
          {searchQuery && (
            <InputRightAddon roundedRight={"full"}>
              {isSearching && <Spinner size="sm" />}
              {!isSearching && !searchResults?.length && (
                <Button
                  rounded={"full"}
                  onClick={() => createTagMutation.mutate(searchQuery)}
                  size={"xs"}
                  variant={"outline"}
                  fontWeight={500}
                  fontSize={"13px"}
                  isLoading={createTagMutation.isPending}
                >
                  Create Tag
                </Button>
              )}
            </InputRightAddon>
          )}
        </InputGroup>

        {showDropdown && searchQuery && (
          <List
            position="absolute"
            top="100%"
            left={0}
            right={0}
            bg="white"
            boxShadow="md"
            borderRadius="md"
            mt={2}
            maxH="200px"
            overflowY="auto"
            zIndex={1}
          >
            {isSearching ? (
              <ListItem p={2}>
                <Spinner size="sm" />
              </ListItem>
            ) : searchResults?.length ? (
              searchResults.map((tag: { id: number; name: string }) => (
                <ListItem
                  key={tag.id}
                  p={2}
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  onClick={() => addTagToPostMutation.mutate(tag.id)}
                >
                  #{tag.name}
                </ListItem>
              ))
            ) : (
              <ListItem p={2}>
                <Text fontSize="sm">No tags found</Text>
              </ListItem>
            )}
          </List>
        )}
      </Box>
    </SectionCard>
  );
};
