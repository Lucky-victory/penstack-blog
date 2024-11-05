"use client";
import React from "react";
import { Box, Grid, Heading, Badge } from "@chakra-ui/react";
import NewPostCard from "../NewPostCard";
import FeaturedPostCard from "../FeaturedPostCard";
import { usePosts } from "@/src/hooks";

const FrontPage = () => {
  const { posts } = usePosts();

  return (
    <Box maxW="7xl" mx="auto" px={4} py={8} bg={"gray.100"}>
      <FeaturedPostCard />
      <Heading mb={8} size="lg">
        Latest Articles
      </Heading>
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
      >
        {posts?.length &&
          posts.map((item, index) => (
            <NewPostCard key={index} post={item as any} />
          ))}
      </Grid>

      <Box
        mt={8}
        p={6}
        borderRadius="lg"
        bgGradient="linear(to-r, blue.500, purple.500)"
        color="white"
        position="relative"
        overflow="hidden"
      >
        <Heading size="lg" mb={2}>
          Discover the member
        </Heading>
        <Heading size="xl" mb={4}>
          Benefits of USA cycling!
        </Heading>
        <Badge colorScheme="whiteAlpha">Debits - 03 June 2023</Badge>
      </Box>
    </Box>
  );
};

export default FrontPage;
