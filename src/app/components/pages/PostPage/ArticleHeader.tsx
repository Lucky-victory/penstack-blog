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
  const summaryColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box as="header" mb={8} maxW={"5xl"} mx={"auto"}>
      <Heading
        as="h1"
        size="xl"
        fontWeight={600}
        mb={5}
        textAlign={{ base: "left", md: "center" }}
      >
        {post.title} and some more text to make it longer like
        hydrosulphatetimunate
      </Heading>
      {
        <Text
          fontSize="md"
          maxW={"4xl"}
          mb={6}
          color={summaryColor}
          textAlign={{ base: "left", md: "center" }}
        >
          {post.summary ||
            `Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto atque maiores laudantium perspiciatis nostrum. Quod saepe expedita dolorem quae quis sint quia architecto error, facilis similique eligendi ex vitae nesciunt provident amet deserunt quaerat laboriosam quam corporis numquam debitis id.`}
        </Text>
      }
    </Box>
  );
};
