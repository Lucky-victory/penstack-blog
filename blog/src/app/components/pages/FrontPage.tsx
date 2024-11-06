"use client";
import React from "react";
import { Box, Grid, Heading, Badge, useColorModeValue } from "@chakra-ui/react";
import NewPostCard from "../NewPostCard";
import FeaturedPostCard from "../FeaturedPostCard";
import { usePosts } from "@/src/hooks";
import { NewPostsCards } from "../NewPostCards";
import Header from "../Header";
import { Newsletter } from "../NewsLetter";
import PageWrapper from "../PageWrapper";

const FrontPage = () => {
  const bgColor = useColorModeValue("gray.100", "black");
  return (
    <PageWrapper>
      <Box bg={bgColor}>
        <Box maxW="7xl" mx="auto" px={4} py={8}>
          <FeaturedPostCard />
          <Heading mb={8} size="lg">
            Latest Articles
          </Heading>
          {/* <Grid
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
            </Grid> */}
          <NewPostsCards />
          <Box
            mt={8}
            p={6}
            borderRadius="lg"
            bgGradient="linear(to-r, blue.500, purple.500)"
            color="white"
            position="relative"
            overflow="hidden"
          >
            <Newsletter />
          </Box>
        </Box>
      </Box>
    </PageWrapper>
  );
};
export default FrontPage;
