"use client";
import { usePosts } from "@/src/hooks";
import { Grid, useColorModeValue } from "@chakra-ui/react";
import PostCard from "../PostCard";
import { PostCardLoader } from "../PostCardLoader";
export function PostsCards({
  maxW,
}: {
  maxW?: string | number | Record<any, any>;
}) {
  const bgColor = useColorModeValue("white", "gray.900");
  const { loading, posts } = usePosts();
  return (
    <Grid
      templateColumns="repeat(auto-fill, minmax(280px, 1fr))"
      gap={{ base: 3, md: 4 }}
      maxW={{ base: "100%", lg: (maxW as string | number) || "auto" }}
    >
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <PostCardLoader key={index} />
          ))
        : posts?.map((post) => <PostCard key={post.id} post={post} />)}
    </Grid>
  );
}
