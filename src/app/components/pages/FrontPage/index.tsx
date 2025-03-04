"use client";
import React, { FC, useEffect, useState } from "react";
import { Box, Button, HStack } from "@chakra-ui/react";
import PageWrapper from "../../PageWrapper";
import { PostsCards } from "@/src/themes/smooth-land/PostsCards";
import { Link } from "@chakra-ui/next-js";
import { usePosts } from "@/src/hooks";
import { LuArrowRight } from "react-icons/lu";
import { CategoryItemList } from "../../CategoryItemList";
import { FeaturedPost } from "@/src/themes/raised-land/FeaturedPost";
import { FeaturedPostType, PostSelect } from "@/src/types";
import { useRouter } from "next/navigation";

interface FrontPageProps {
  featuredPost: FeaturedPostType;
  posts: PostSelect[];
}
const FrontPage: FC<FrontPageProps> = ({ featuredPost, posts }) => {
  const { updateParams } = usePosts();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    setLoading(false);
  }, [posts]);
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
            <FeaturedPost post={featuredPost} />
            <Box mt={0} mb={6}>
              <CategoryItemList
                onChange={(category) => {
                  updateParams({ category });
                  router.replace("?category=" + category, { scroll: false });
                  router.refresh();
                }}
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
