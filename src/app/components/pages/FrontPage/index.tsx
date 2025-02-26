"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  Skeleton,
  SkeletonText,
  Stack,
} from "@chakra-ui/react";
import FeaturedPostCard from "../../../../themes/smooth-land/FeaturedPostCard";
import PageWrapper from "../../PageWrapper";
import { PostsCards } from "@/src/themes/smooth-land/PostsCards";
import { Link } from "@chakra-ui/next-js";
import { usePosts } from "@/src/hooks";
import { useCategories } from "@/src/hooks/useCategories";
import { LuArrowRight } from "react-icons/lu";
import { useQueryState } from "nuqs";
import { CategoryItemList } from "../../CategoryItemList";

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
          <Suspense
            fallback={
              <Stack
                h={"full"}
                minH={350}
                spacing={4}
                px={{ base: 3, sm: 6, lg: 8 }}
                py={{ base: 3, sm: 6 }}
              >
                <Skeleton height="350px" rounded={"lg"} />
                <Skeleton height="15px" width="100px" rounded={"xl"} />
                <Skeleton height="25px" rounded={"xl"} />
                <SkeletonText noOfLines={3} rounded={"xl"} />
              </Stack>
            }
          >
            <FeaturedPostCard />
          </Suspense>
          <Box px={{ base: 0, lg: 4 }} py={5}>
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
