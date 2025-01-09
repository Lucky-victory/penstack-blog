"use client";
import React from "react";
import { Box, Button, Heading, HStack } from "@chakra-ui/react";
import FeaturedPostCard from "../../../../themes/smooth-land/FeaturedPostCard";
import PageWrapper from "../../PageWrapper";
import { PostsCards } from "@/src/themes/smooth-land/PostsCards";
import { Link } from "@chakra-ui/next-js";

const FrontPage = () => {
  return (
    <PageWrapper>
      <Box mb={12}>
        <Box
          maxW="container.xl"
          mx="auto"
          px={{ base: 2, md: 4, lg: 2 }}
          pt={2}
        >
          <FeaturedPostCard />
          <Heading mt={8} mb={6} size="lg">
            Recent Posts
          </Heading>

          <PostsCards />
          <HStack justify={"center"} my={8}>
            <Button as={Link} size={"lg"} href={"/articles"} rounded={"lg"}>
              View all posts
            </Button>
          </HStack>
        </Box>
      </Box>
    </PageWrapper>
  );
};
export default FrontPage;
