import { SearchPostsComponent } from "@/src/lib/editor/nodes/MiniPostCard/SearchPostsComponent";
import { PostSelect } from "@/src/types";
import {
  formatPostPermalink,
  objectToQueryParams,
  shortenText,
  stripHtml,
} from "@/src/utils";
import { Link } from "@chakra-ui/next-js";
import {
  Spinner,
  Box,
  useColorModeValue,
  VStack,
  Text,
  Image,
  Input,
  HStack,
  Stack,
  Button,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { NodeViewProps } from "@tiptap/react";
import axios from "axios";
import { decode } from "html-entities";
import { ChangeEvent, useState } from "react";

interface MiniPostCardProps {
  isEditing?: boolean;
  node: Partial<NodeViewProps["node"]>;
  inputValue?: string;
  updateAttributes?: NodeViewProps["updateAttributes"];
  onInputChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
export const MiniPostCardRenderer: React.FC<MiniPostCardProps> = ({
  node,
  isEditing = false,
  inputValue,
  updateAttributes,
  onInputChange,
}) => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const [showPostSearch, setShowPostSearch] = useState(false);

  const postIds = (node?.attrs?.postIds as string)
    ?.split(",")
    .map((id) => id.trim());
  console.log({ postIds, np: node?.attrs?.postIds });

  const {
    data: posts,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["post_card_posts"],
    queryFn: async () => {
      const result = await Promise.all(
        postIds.map(async (postId) => {
          const { data } = await axios(`/api/posts/${postId}`);
          return data.data as PostSelect;
        })
      );
      return result;
    },
    enabled: postIds?.length > 0,
    staleTime: Infinity,
  });

  if (isFetching) return <Spinner />;
  if (!posts) return null;

  return (
    <Box
      p={4}
      rounded="md"
      bg={bgColor}
      my={4}
      maxW={600}
      border="1px"
      borderColor={borderColor}
    >
      <VStack align="stretch" spacing={3}>
        {!isEditing && node?.attrs?.customTitle && (
          <Text fontSize="lg" fontWeight="bold">
            {node.attrs.customTitle}
          </Text>
        )}
        {isEditing && (
          <Input
            border={"none"}
            borderBottom={"1px solid"}
            borderColor={"gray.300"}
            placeholder="Add custom title (optional)"
            value={inputValue}
            variant={""}
            onChange={(e) => {
              onInputChange?.(e);
            }}
          />
        )}
        {posts?.length > 0 &&
          posts.map((post) => (
            <Link
              key={post.id}
              href={formatPostPermalink(post)}
              _hover={{ textDecoration: "none" }}
              onClick={(e) => {
                if (isEditing) e.preventDefault();
              }}
            >
              <HStack spacing={4} align="start">
                {post.featured_image && (
                  <Image
                    src={post.featured_image.url}
                    alt={post.featured_image.alt_text}
                    boxSize={{ base: "80px", lg: "90px" }}
                    maxH={{ base: "80px", lg: "90px" }}
                    objectFit="cover"
                  />
                )}
                <Stack align="start" spacing={1}>
                  <Text
                    fontSize={{ base: "medium", lg: "large" }}
                    fontWeight="bold"
                  >
                    {post.title}
                  </Text>
                  <Text
                    fontSize={{ base: "small", lg: "medium" }}
                    color={textColor}
                  >
                    {shortenText(stripHtml(decode(post.content)), 150)}
                  </Text>
                </Stack>
              </HStack>
            </Link>
          ))}
        {isEditing && (
          <>
            {showPostSearch && (
              <SearchPostsComponent
                onPostSelect={(post) => {
                  updateAttributes?.({
                    postIds: node?.attrs?.postIds + "," + post.post_id,
                  });
                  setShowPostSearch(false);
                  refetch();
                }}
              />
            )}
            <Button
              size={"sm"}
              alignSelf={"center"}
              onClick={() => {
                setShowPostSearch(true);
              }}
            >
              Add more post
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
};
