"use client";
import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import FeaturedPostCard from "../../../../themes/smooth-land/FeaturedPostCard";
import PageWrapper from "../../PageWrapper";
import { PostsCards } from "@/src/themes/smooth-land/PostsCards";

const FrontPage = () => {
  return (
    <PageWrapper>
      <Box mb={12}>
        <Box maxW="container.xl" mx="auto" px={{ base: 4, lg: 2 }} pt={2}>
          <FeaturedPostCard />
          <Heading my={8} size="lg">
            Recent Posts
          </Heading>

          <PostsCards />
        </Box>
      </Box>
    </PageWrapper>
  );
};
export default FrontPage;
