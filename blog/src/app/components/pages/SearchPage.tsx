"use client";

import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  SimpleGrid,
  Select,
  useColorModeValue,
  Skeleton,
} from "@chakra-ui/react";
import { LuSearch, LuFilter } from "react-icons/lu";
import { useQueryParams } from "@/src/hooks";

const SearchResults = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const { queryParams, setQueryParam } = useQueryParams<{ query: string }>();

  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      minH="calc(100vh - 180px)"
    >
      <Container maxW="7xl" py={8}>
        {/* Search Header */}
        <VStack spacing={6} mb={8}>
          <Heading size="lg" color={textColor}>
            Search Results
          </Heading>
          <InputGroup size="lg" maxW="600px">
            <Input
              placeholder="Search articles..."
              bg={bgColor}
              borderColor={borderColor}
              value={queryParams?.query || ""}
              _hover={{
                borderColor: useColorModeValue("blue.500", "blue.300"),
              }}
            />
            <InputRightElement>
              <IconButton
                aria-label="Search"
                icon={<LuSearch />}
                variant="ghost"
              />
            </InputRightElement>
          </InputGroup>
        </VStack>

        {/* Filters */}
        <HStack spacing={4} mb={8} wrap="wrap">
          <Select
            placeholder="Category"
            maxW="200px"
            bg={bgColor}
            borderColor={borderColor}
          >
            <option value="react">React</option>
            <option value="typescript">TypeScript</option>
            <option value="nodejs">Node.js</option>
            <option value="python">Python</option>
            <option value="devops">DevOps</option>
          </Select>
          <Select
            placeholder="Sort by"
            maxW="200px"
            bg={bgColor}
            borderColor={borderColor}
          >
            <option value="relevant">Most Relevant</option>
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
          </Select>
        </HStack>

        {/* Results Count */}
        <Text color={mutedColor} mb={6}>
          Showing 15 results for "React Hooks"
        </Text>

        {/* Results Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {[...Array(6)].map((_, i) => (
            <Box
              key={i}
              bg={bgColor}
              p={6}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              transition="all 0.2s"
              _hover={{ transform: "translateY(-4px)", shadow: "md" }}
            >
              <VStack align="stretch" spacing={4}>
                <Skeleton height="200px" borderRadius="md" />
                <Skeleton height="24px" width="100px" />
                <Skeleton height="36px" />
                <Skeleton height="60px" />
                <HStack justify="space-between">
                  <Skeleton height="40px" width="150px" />
                  <Skeleton height="40px" width="40px" borderRadius="md" />
                </HStack>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default SearchResults;
