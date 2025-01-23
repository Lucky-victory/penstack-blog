"use client";
import { Box, HStack, Button, Skeleton } from "@chakra-ui/react";
import PageWrapper from "../../components/PageWrapper";
import { PostsCards } from "../../../themes/smooth-land/PostsCards";
import { usePosts } from "@/src/hooks";
import { useCategories } from "@/src/hooks/useCategories";
import { useEffect, useState } from "react";

export default function Posts() {
  const { posts, loading, updateParams } = usePosts();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data, isFetching: isCategoryLoading } = useCategories({ limit: 5 });
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
      <Box py={8} px={{ base: 3, lg: 4 }} maxW={"container.xl"} mx="auto">
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
      </Box>
    </PageWrapper>
  );
}
