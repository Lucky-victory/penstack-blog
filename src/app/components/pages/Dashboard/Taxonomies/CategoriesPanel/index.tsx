import { useCategories } from "@/src/hooks/useCategories";
import { FilteredList } from "../FilteredList";
import { Box, HStack, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { FilterListSkeleton } from "../FilterListSkeleton";
import Pagination from "@/src/app/components/Pagination";
import { useState } from "react";

export const CategoriesPanel = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: taxonomyData, isPending: isLoading } = useCategories({
    canFetch: true,
    hasPostsOnly: false,

    page: currentPage,
  });
  if (isLoading) return <FilterListSkeleton />;
  if (!isLoading && !taxonomyData?.results.length)
    return (
      <VStack>
        <Text
          color={useColorModeValue("gray.500", "gray.300")}
          fontWeight={500}
        >
          No categories yet
        </Text>
      </VStack>
    );
  return (
    <>
      <FilteredList items={taxonomyData} />
      <HStack py={4} justify={"center"}>
        <Pagination
          totalPages={taxonomyData?.meta.totalPages}
          currentPage={taxonomyData?.meta.page}
          onPageChange={setCurrentPage}
        />
      </HStack>
    </>
  );
};
