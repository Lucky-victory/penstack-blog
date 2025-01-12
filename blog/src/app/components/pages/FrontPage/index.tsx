"use client";
import React, { useEffect, useState } from "react";
import { Box, Button, Heading, HStack } from "@chakra-ui/react";
import FeaturedPostCard from "../../../../themes/smooth-land/FeaturedPostCard";
import PageWrapper from "../../PageWrapper";
import { PostsCards } from "@/src/themes/smooth-land/PostsCards";
import { Link } from "@chakra-ui/next-js";
import { usePosts } from "@/src/hooks";
import { useCategories } from "@/src/hooks/useCategories";

const FrontPage = () => {
  const { posts, loading, updateParams } = usePosts();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data } = useCategories({ limit: 5 });
  const categories = data?.results;

  function isSelected(val: string) {
    return selectedCategory.toLowerCase() === val?.toLowerCase();
  }

  useEffect(() => {
    selectedCategory.toLowerCase() === "all"
      ? updateParams({ category: "" })
      : updateParams({ category: selectedCategory });
  }, [selectedCategory, updateParams]);
  return (
    <PageWrapper>
      <Box mb={12}>
        <Box
          maxW="1440px"
          mx="auto"
          px={{ base: 2, md: 4, lg: 2 }}
          // pt={2}
        >
          <FeaturedPostCard />
          <Box px={{ base: 0, lg: 4 }} py={5}>
            <Box mt={0} mb={6}>
              <HStack>
                {["All", ...(categories || [])?.map((cat) => cat.name)].map(
                  (val) => {
                    return (
                      <Button
                        onClick={() => {
                          setSelectedCategory(val);
                        }}
                        key={val}
                        value={val}
                        size={"sm"}
                        rounded={"lg"}
                        variant={isSelected(val) ? "solid" : "ghost"}
                      >
                        {val}
                      </Button>
                    );
                  }
                )}
              </HStack>
            </Box>

            <PostsCards posts={posts} loading={loading} />
            <HStack justify={"center"} my={8}>
              <Button as={Link} size={"xl"} href={"/articles"} rounded={"lg"}>
                View all posts
              </Button>
            </HStack>
          </Box>
        </Box>
      </Box>
    </PageWrapper>
  );
};
export default FrontPage;
