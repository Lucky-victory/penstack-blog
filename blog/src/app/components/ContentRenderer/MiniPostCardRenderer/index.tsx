import { formatPostPermalink, shortenText, stripHtml } from "@/src/utils";
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

  const { data: post, isFetching } = useQuery({
    queryKey: ["post_card_post", node?.attrs?.postId],
    queryFn: async () => {
      const { data } = await axios(`/api/posts/${node?.attrs?.postId}`);
      return data.data;
    },
    enabled: !!node?.attrs?.postId,
    staleTime: Infinity,
  });

  if (isFetching) return <Spinner />;
  if (!post) return null;

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
        <HStack
          as={Link}
          href={`${formatPostPermalink(post)}`}
          spacing={4}
          align={"start"}
          onClick={(e) => {
            if (isEditing) e.preventDefault();
          }}
        >
          {post.featured_image && (
            <Image
              src={post.featured_image.url}
              alt={post.featured_image.alt_text}
              width="150px"
              height="90.9px"
              objectFit="cover"
              rounded="md"
            />
          )}
          <Stack align="start" spacing={2}>
            <Text fontSize="xl" fontWeight="bold">
              {post.title}
            </Text>
            <Text noOfLines={2}>
              {shortenText(
                post.summary || stripHtml(decode(post?.content)),
                150
              )}
            </Text>
          </Stack>
        </HStack>
      </VStack>
    </Box>
  );
};
