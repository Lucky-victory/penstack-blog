import { useTags } from "@/src/hooks/useTags";
import { FilteredList } from "../FilteredList";
import { HStack, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { FilterListSkeleton } from "../FilterListSkeleton";
import Pagination from "@/src/app/components/Pagination";
import { useState } from "react";

export const TagsPanel = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: taxonomyData, isPending: isLoading } = useTags({
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
          No tags yet
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
