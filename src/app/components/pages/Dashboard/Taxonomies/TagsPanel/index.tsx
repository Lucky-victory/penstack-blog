import { useTags } from "@/src/hooks/useTags";
import { FilteredList } from "../FilteredList";
import { Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { FilterListSkeleton } from "../FilterListSkeleton";

export const TagsPanel = () => {
  const { data: taxonomyData, isPending: isLoading } = useTags({
    hasPostsOnly: false,
    limit: 5,
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
  return <FilteredList items={taxonomyData} />;
};
