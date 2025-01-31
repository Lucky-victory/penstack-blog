import React from "react";
import {
  Box,
  Flex,
  Tag,
  Text,
  Heading,
  HStack,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { PostSelect } from "@/src/types";

interface ArticleHeaderProps {
  post: PostSelect;
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({ post }) => {
  const summaryColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Stack
      align={{ base: "start", md: "center" }}
      as="header"
      mb={0}
      maxW={"5xl"}
      mx={"auto"}
    >
      <Heading
        as="h1"
        size="2xl"
        fontWeight={700}
        mb={4}
        textAlign={{ base: "left", md: "center" }}
      >
        {post.title}
      </Heading>
      {post.summary && (
        <Text
          fontSize="md"
          maxW={"3xl"}
          mb={4}
          color={summaryColor}
          textAlign={{ base: "left", md: "center" }}
        >
          {post.summary}
        </Text>
      )}
    </Stack>
  );
};
