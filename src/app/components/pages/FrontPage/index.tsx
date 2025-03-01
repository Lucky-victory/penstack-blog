"use client";
import React from "react";
import { Box, Button, HStack } from "@chakra-ui/react";
import PageWrapper from "../../PageWrapper";
import { PostsCards } from "@/src/themes/smooth-land/PostsCards";
import { Link } from "@chakra-ui/next-js";
import { usePosts } from "@/src/hooks";
import { LuArrowRight } from "react-icons/lu";
import { CategoryItemList } from "../../CategoryItemList";
import { FeaturedPost } from "@/src/themes/raised-land/FeaturedPost";

const FrontPage = () => {
  const { posts, loading, updateParams } = usePosts();

  return (
    <PageWrapper>
      <Box mb={12}>
        <Box
          maxW="1440px"
          mx="auto"
          px={{ base: 2, md: 4, lg: 2 }}
          // pt={2}
        >
          <Box px={{ base: 0, lg: 4 }}>
            <FeaturedPost />
            <Box mt={0} mb={6}>
              <CategoryItemList
                onChange={(category) => updateParams({ category })}
              />
            </Box>

            <PostsCards posts={posts} loading={loading} />
            {!loading && (
              <HStack justify={"center"} my={8}>
                <Button
                  as={Link}
                  href={"/articles"}
                  px={6}
                  py={2}
                  rightIcon={<LuArrowRight />}
                >
                  View all posts
                </Button>
              </HStack>
            )}
          </Box>
        </Box>
      </Box>
    </PageWrapper>
  );
};
export default FrontPage;
