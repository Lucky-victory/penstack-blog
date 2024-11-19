"use client";
import React from "react";
import { Box, Grid, Heading, Badge, useColorModeValue } from "@chakra-ui/react";
import NewPostCard from "../../../../themes/raised-land/NewPostCard";
import FeaturedPostCard from "../../../../themes/smooth-land/FeaturedPostCard";
import { usePosts } from "@/src/hooks";
import { NewPostsCards } from "../../../../themes/raised-land/NewPostCards";
import Header from "../../Header";
import { Newsletter } from "../../NewsLetter";
import PageWrapper from "../../PageWrapper";

const FrontPage = () => {
  // const bgColor = useColorModeValue("gray.100", "black");
  return (
    <PageWrapper>
      <Box>
        <Box maxW="7xl" mx="auto" px={4}>
          <FeaturedPostCard />
          <Heading my={8} size="lg">
            Recent Posts
          </Heading>

          <NewPostsCards />
        </Box>
      </Box>
    </PageWrapper>
  );
};
export default FrontPage;
