"use client";
import { Grid, useColorModeValue } from "@chakra-ui/react";
import PostCard from "../PostCard";
import { PostCardLoader } from "../PostCardLoader";
import { PostSelect } from "@/src/types";
export function PostsCards({
  maxW,
  posts,
  loading,
  showAuthor,
  showBookmark,
}: {
  posts: PostSelect[] | undefined;
  loading?: boolean;
  showAuthor?: boolean;
  showBookmark?: boolean;
  maxW?: string | number | Record<any, any>;
}) {
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
        : posts?.map((post) => (
            <PostCard showAuthor={showAuthor} key={post.id} post={post} />
          ))}
    </Grid>
  );
}
