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
  Avatar,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { PostSelect } from "@/src/types";
import { AuthorSection } from "./AuthorSection";
import { Link } from "@chakra-ui/next-js";
import { formatDate } from "@/src/utils";

interface ArticleHeaderProps {
  post: PostSelect;
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({ post }) => {
  const summaryColor = useColorModeValue("gray.600", "gray.400");
  const dividerColor = useColorModeValue("gray.600", "gray.400");
  return (
    <Box mb={5} px={2}>
      <Stack align={"center"} as="header" mb={0} maxW={"5xl"} mx={"auto"}>
        <Heading as="h1" size="xl" fontWeight={700} textAlign={"center"}>
          {post.title}
        </Heading>
        {post.summary && (
          <Text
            fontSize="md"
            maxW={"3xl"}
            mb={4}
            color={summaryColor}
            textAlign={"center"}
          >
            {post.summary}
          </Text>
        )}
      </Stack>
      <Stack align={"center"}>
        <HStack>
          <Text as="span">By</Text>
          <Avatar
            src={post.author.avatar}
            name={post.author.name}
            size={"sm"}
          />
          <Stack spacing={0}>
            <Link
              href={"/author/" + post.author.username}
              fontWeight={600}
              textDecor={"underline"}
              lineHeight={"tighter"}
              // fontSize={"smaller"}
            >
              {post.author.name}
            </Link>
          </Stack>
        </HStack>
        <HStack>
          <Text as={"span"} fontSize={"smaller"}>
            {formatDate(
              new Date(
                (post.published_at
                  ? post?.published_at
                  : post.created_at) as Date
              )
            )}
          </Text>
          <Box w={1} h={1} rounded={"full"} bg={dividerColor}></Box>
          <Text as={"span"} fontSize={"smaller"}>
            {post?.reading_time || 1} min read
          </Text>
        </HStack>
      </Stack>
    </Box>
  );
};
