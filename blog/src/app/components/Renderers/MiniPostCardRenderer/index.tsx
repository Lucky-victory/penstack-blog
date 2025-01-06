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
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { NodeViewProps } from "@tiptap/react";
import axios from "axios";
import { decode } from "html-entities";
import { ChangeEvent } from "react";

interface MiniPostCardProps {
  isEditing?: boolean;
  node: Partial<NodeViewProps["node"]>;
  inputValue?: string;
  onInputChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
export const MiniPostCardRenderer: React.FC<MiniPostCardProps> = ({
  node,
  isEditing = false,
  inputValue,
  onInputChange,
}) => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");

  const { data: posts, isFetching } = useQuery({
    queryKey: [
      "post_card_posts",
      node?.attrs?.postIds,
      node?.attrs?.postIds?.length,
    ],
    queryFn: async () => {
      const { data } = await axios(
        `/api/posts?${objectToQueryParams({ postIds: node?.attrs?.postIds })}`
      );
      return data.data as PostSelect[];
    },
    enabled: node?.attrs?.postIds?.length > 0,
    // staleTime: Infinity,
  });

  if (isFetching) return <Spinner />;
  if (!posts) return null;

  return (
    <Box
      p={4}
      rounded="lg"
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
                    objectFit="cover"
                    rounded="md"
                  />
                )}
                <Stack align="start" spacing={2}>
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
      </VStack>
    </Box>
  );
};
