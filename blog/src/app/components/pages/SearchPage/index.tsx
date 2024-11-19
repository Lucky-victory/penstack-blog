"use client";

import React, { useState } from "react";
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
import { LuSearch } from "react-icons/lu";
import { useQueryParams } from "@/src/hooks";
import { useSearchResults } from "@/src/hooks/useSearchResults";
import PostCard from "../../../../themes/smooth-land/PostCard";
import { useCallback } from "react";
import debounce from "lodash/debounce";
import { useCategories } from "@/src/hooks/useCategories";
import NewPostCard from "../../../../themes/raised-land/NewPostCard";

const SearchResults = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const { data: categories } = useCategories({});
  const categoriesResults = categories?.results || [];

  const { queryParams, setQueryParam } = useQueryParams<{
    query: string;
    category?: string;
    sort?: "relevant" | "recent" | "popular";
    page?: number;
  }>();
  const [searchValue, setSearchValue] = useState(queryParams?.query || "");

  const { data, isLoading } = useSearchResults({ queryParams });
  const searchResults = data?.results || [];
  const totalResult = data?.meta?.total;
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setQueryParam("query", value);
    }, 1000),
    [setQueryParam]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQueryParam("category", e.target.value);
  };
  const handleSortSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQueryParam("sort", e.target.value);
  };
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
              onChange={handleSearch}
              defaultValue={queryParams?.query}
              value={searchValue}
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
            onChange={handleCategorySelect}
          >
            {categoriesResults?.length > 0 &&
              categoriesResults?.map((category) => (
                <option
                  key={category?.id}
                  value={category?.id}
                  data-slug={category?.slug}
                >
                  {category?.name}
                </option>
              ))}
          </Select>
          <Select
            onChange={handleSortSelect}
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
        <Box>
          {searchResults?.length > 0 && (
            <Text color={mutedColor} mb={6}>
              Showing {totalResult} results for{" "}
              <Text as="span" fontWeight={500}>
                &quot;{queryParams?.query}
                &quot;
              </Text>
            </Text>
          )}
        </Box>

        {/* Results Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {!isLoading &&
            searchResults?.map((post) => (
              <NewPostCard key={post.id} post={post} showBookmark={false} />
            ))}
          {isLoading &&
            [...Array(6)].map((_, i) => (
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
