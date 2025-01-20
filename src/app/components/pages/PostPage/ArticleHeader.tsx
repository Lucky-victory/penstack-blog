import React from "react";
import {
  Box,
  Flex,
  Tag,
  Text,
  Heading,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { PostSelect } from "@/src/types";

interface ArticleHeaderProps {
  post: PostSelect;
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({ post }) => {
  const summaryColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Box as="header" mb={8}>
      <HStack
        // my={4}
        gap={{ base: 4, md: 5 }}
        ml={0}
        align={"center"}
        justify={{ base: "flex-start", md: "center" }}
        wrap={"wrap"}
      >
        {post?.category?.name && (
          <Tag
            size="md"
            colorScheme="yellow"
            rounded={"full"}
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
      <Heading as="h1" size="2xl" textAlign={{ base: "left", md: "center" }}>
        {post.title}
      </Heading>
      {post.summary && (
        <Text
          fontSize="xl"
          fontWeight="medium"
          mb={6}
          color={summaryColor}
          lineHeight="tall"
          textAlign={{ base: "left", md: "center" }}
        >
          {post.summary}
        </Text>
      )}
    </Box>
  );
};
