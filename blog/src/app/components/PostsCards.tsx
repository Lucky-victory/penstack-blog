"use client";
import { usePosts } from "@/src/hooks";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
  Image,
  LinkBox,
  LinkOverlay,
  useColorModeValue,
  HStack,
  Tag,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { Skeleton, SkeletonCircle, SkeletonText } from "./ui/Skeleton";
import { Avatar } from "./ui/Avatar";
import { formatDate } from "@/src/utils";
import PostCard from "./PostCard";
import { PostCardLoader } from "./PostCardLoader";
export function PostsCards({
  maxW,
}: {
  maxW?: string | number | Record<any, any>;
}) {
  const bgColor = useColorModeValue("white", "gray.900");
  const { loading, posts } = usePosts();
  return (
    <Grid
      templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
      gap={{ base: 4, lg: 5 }}
      maxW={{ base: "100%", lg: (maxW as string | number) || "auto" }}
    >
      {loading
        ? Array.from({ length: 4 }).map((_, index) => (
            <PostCardLoader key={index} />
          ))
        : posts?.map((post) => (
            <PostCard key={post.id} post={post} loading={loading} />
          ))}
    </Grid>
  );
}
