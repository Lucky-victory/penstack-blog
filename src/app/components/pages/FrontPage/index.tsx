"use client";
import React, { useEffect, useState } from "react";
import { Box, Button, Heading, HStack, Skeleton } from "@chakra-ui/react";
import FeaturedPostCard from "../../../../themes/smooth-land/FeaturedPostCard";
import PageWrapper from "../../PageWrapper";
import { PostsCards } from "@/src/themes/smooth-land/PostsCards";
import { Link } from "@chakra-ui/next-js";
import { usePosts } from "@/src/hooks";
import { useCategories } from "@/src/hooks/useCategories";
import { LuArrowRight } from "react-icons/lu";

const FrontPage = () => {
  const { posts, loading, updateParams } = usePosts();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data, isLoading: isCategoryLoading } = useCategories({ limit: 5 });
  const categories = data?.results;

  function isSelected(val: string) {
    return selectedCategory.toLowerCase() === val?.toLowerCase();
  }
  function handleSelectedCategory(val: string | "all") {
    val.toLowerCase() === "all"
      ? updateParams({ category: "" })
      : updateParams({ category: val });
    setSelectedCategory(val);
  }
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
              <HStack overflowX={"auto"}>
                {isCategoryLoading && !categories?.length
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <Skeleton
                        key={index}
                        height={30}
                        width={80}
                        rounded={"lg"}
                        ml={5}
                      />
                    ))
                  : ["All", ...(categories || [])?.map((cat) => cat.name)].map(
                      (val) => {
                        return (
                          <Button
                            onClick={() => {
                              handleSelectedCategory(val);
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
