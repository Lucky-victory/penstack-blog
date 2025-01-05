import React from "react";
import { Box, Flex, Tag, Text, Heading, HStack } from "@chakra-ui/react";
import { format } from "date-fns";
import { PostSelect } from "@/src/types";

interface ArticleHeaderProps {
  post: PostSelect;
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({ post }) => {
  return (
    <Box as="header" mb={8}>
      <HStack my={4} gap={{ base: 5, md: 7 }} ml={0}>
        {post?.category?.name && (
          <Tag
            size="md"
            colorScheme="blue"
            borderRadius="md"
            px={3}
            py={1}
            textTransform="capitalize"
          >
            {post.category.name}
          </Tag>
        )}
        <Text color="gray.500" as="span">
          {format(new Date(post.updated_at as Date), "MMMM d, yyyy")}
        </Text>
      </HStack>

      {post?.tags && (
        <Flex flexWrap="wrap" gap={2} my={4}>
          {post?.tags?.map((tag, index) => (
            <Tag key={index} colorScheme="gray">
              #{tag?.name}
            </Tag>
          ))}
        </Flex>
      )}

      <Heading
        as="h1"
        size="2xl"
        // bgGradient="linear(to-r, blue.400, purple.500)"
        // bgClip="text"
      >
        {post.title}
      </Heading>
    </Box>
  );
};
