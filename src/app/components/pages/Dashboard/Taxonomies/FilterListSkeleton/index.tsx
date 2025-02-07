import { Skeleton, Stack, useColorModeValue } from "@chakra-ui/react";

export const FilterListSkeleton = () => {
  return (
    <Stack spacing={4}>
      <Skeleton height="45px" w={"100%"} mb={4} rounded={"xl"} />
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton
          key={index}
          bg={useColorModeValue("gray.100", "gray.800")}
          height="60px"
          w={"100%"}
          border={1}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          rounded={"xl"}
        />
      ))}
    </Stack>
  );
};
