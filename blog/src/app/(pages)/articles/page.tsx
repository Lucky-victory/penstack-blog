"use client";
import { Box } from "@chakra-ui/react";
import PageWrapper from "../../components/PageWrapper";
import { PostsCards } from "../../../themes/smooth-land/PostsCards";
import { usePosts } from "@/src/hooks";

export default function Posts() {
  const { posts, loading } = usePosts();

  return (
    <PageWrapper>
      <Box py={8} px={{ base: 3, lg: 4 }} maxW={"container.xl"} mx="auto">
        <PostsCards posts={posts} loading={loading} />
      </Box>
    </PageWrapper>
  );
}
