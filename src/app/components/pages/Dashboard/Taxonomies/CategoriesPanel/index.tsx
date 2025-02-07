import { useCategories } from "@/src/hooks/useCategories";
import { FilteredList } from "../FilteredList";
import { Box, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { FilterListSkeleton } from "../FilterListSkeleton";

export const CategoriesPanel = () => {
  const { data: taxonomyData, isPending: isLoading } = useCategories({
    canFetch: true,
    hasPostsOnly: false,
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
  return <FilteredList items={taxonomyData} />;
};
