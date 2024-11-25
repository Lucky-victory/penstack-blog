import React, { useCallback, useEffect, useRef, useState } from "react";
import { MediaCard } from "./MediaCard";
import { MediaFilter } from "./MediaFilter";
import {
  Box,
  Button,
  Grid,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import {
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
  LuTrash2,
} from "react-icons/lu";
import { useQueryParams } from "@/src/hooks";
import { FilterParams, MediaResponse, PaginatedResponse } from "@/src/types";
import axios from "axios";
import Loader from "../../Loader";
import { objectToQueryParams } from "@/src/utils";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";

interface MediaLibraryProps {
  onSelect?: (media: MediaResponse | MediaResponse[]) => void;
  multiple?: boolean;
  defaultFilters?: Partial<FilterParams>;
  maxSelection?: number;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  onSelect,
  multiple = false,
  defaultFilters = {},
  maxSelection,
}) => {
  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    limit: 20,
    ...defaultFilters,
  });
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaResponse[]>([]);

  const filtersDebounce = useRef(
    debounce((filters: FilterParams) => {
      return filters;
    }, 400)
  ).current;

  const debouncedFilters = filtersDebounce(filters);

  useEffect(() => {
    return () => {
      filtersDebounce.cancel();
    };
  }, [filtersDebounce]);

  const { data: media, refetch } = useQuery({
    queryKey: ["media", debouncedFilters],
    queryFn: fetchMedia,
    // enabled: !!debouncedFilters?.page,
    staleTime: 1000 * 60 * 5,
  });
  const { data: folders } = useQuery({
    queryKey: ["folders"],
    queryFn: fetchFolders,
    staleTime: 1000 * 60 * 5,
  });

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const boxBgColor = useColorModeValue("white", "gray.700");

  async function fetchFolders() {
    try {
      const { data } = await axios<{ data: string[] }>(`/api/media/folders`);

      return data.data;
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    }
  }
  async function fetchMedia() {
    setLoading(true);
    try {
      const { data: media } = await axios<PaginatedResponse<MediaResponse>>(
        `/api/media?${objectToQueryParams(debouncedFilters || {})}`
      );

      return media;
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset page when filters change
    }));
  };

  const handleSelect = (media: MediaResponse) => {
    if (multiple) {
      setSelectedMedia((prev) => {
        const isSelected = prev.find((m) => m.id === media.id);
        if (isSelected) {
          return prev.filter((m) => m.id !== media.id);
        }

        if (maxSelection && prev.length >= maxSelection) {
          const newArray = [...prev.slice(1), media];
          return newArray;
        }
        return [...prev, media];
      });
    } else {
      onSelect?.(media);
    }
  };

  const handleLoadMore = () => {
    if (media && media.meta.page < media.meta.totalPages) {
      setFilters((prev) => ({
        ...prev,
        page: prev.page ? prev.page + 1 : 2,
      }));
    }
  };

  return (
    <Box className="space-y-6" minH={400}>
      <MediaFilter
        onFilterChange={handleFilterChange}
        folders={folders as string[]}
        refetchMedia={refetch}
      />

      {loading && (
        <VStack justify={"center"} py={12}>
          <Loader />
        </VStack>
      )}

      {!loading && media && media?.data?.length === 0 && (
        <VStack justify={"center"} py={12}>
          <Text color={"gray.400"} fontWeight={500}>
            No medias found
          </Text>
        </VStack>
      )}
      {!loading && media && media?.data?.length > 0 && (
        <>
          <Grid
            rounded={{ base: 20, md: 24 }}
            bg={bgColor}
            p={{ base: 3, md: 4 }}
            templateColumns={{
              base: "repeat(auto-fill, minmax(200px, 1fr))",
              md: "repeat(auto-fill, minmax(200px, 250px))",
            }}
            gap={{ base: 3, md: 4 }}
          >
            {media?.data.length > 0 &&
              media?.data.map((item) => (
                <MediaCard
                  key={item.id}
                  media={item}
                  onSelect={handleSelect}
                  selected={!!selectedMedia.find((m) => m.id === item.id)}
                />
              ))}
          </Grid>
          <HStack spacing={2} justify={"center"}>
            <IconButton
              aria-label="First page"
              rounded={"full"}
              variant="outline"
              onClick={() => setFilters((prev) => ({ ...prev, page: 1 }))}
              isDisabled={loading || media?.meta.page === 1}
            >
              <LuChevronsLeft className="h-4 w-4" />
            </IconButton>
            <IconButton
              aria-label="previous page"
              rounded={"full"}
              variant="outline"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: prev.page ? prev.page - 1 : 1,
                }))
              }
              isDisabled={loading || media?.meta.page === 1}
            >
              <LuChevronLeft className="h-4 w-4" />
            </IconButton>
            <Text>
              Page {media?.meta.page} of {media?.meta.totalPages}
            </Text>
            <IconButton
              rounded={"full"}
              aria-label="next page"
              variant="outline"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: prev.page ? prev.page + 1 : 2,
                }))
              }
              isDisabled={
                loading || media?.meta.page === media?.meta.totalPages
              }
            >
              <LuChevronRight className="h-4 w-4" />
            </IconButton>
            <IconButton
              rounded={"full"}
              variant="outline"
              aria-label="last page"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: media?.meta.totalPages,
                }))
              }
              isDisabled={
                loading || media?.meta.page === media?.meta.totalPages
              }
            >
              <LuChevronsRight className="h-4 w-4" />
            </IconButton>
          </HStack>{" "}
        </>
      )}

      {multiple && selectedMedia.length > 0 && (
        <Box
          bottom={"env(safe-area-inset-bottom,0px)"}
          pos={"sticky"}
          borderTop={"1"}
          bg={boxBgColor}
          shadow="lg"
          left={0}
          right={0}
          p={4}
          rounded={"lg"}
        >
          <HStack
            direction={{ base: "column", md: "row" }}
            maxW={"7xl"}
            mx={"auto"}
            justify={"space-between"}
          >
            {(!maxSelection || maxSelection > 1) && (
              <Text>{selectedMedia.length} items selected</Text>
            )}
            <HStack
              gap={4}
              flex={1}
              justify={"end"}
              align={"stretch"}
              wrap={"wrap"}
            >
              <Button
                rounded={"full"}
                onClick={() => setSelectedMedia([])}
                colorScheme="red"
                leftIcon={<LuTrash2 />}
                variant="outline"
              >
                Clear
              </Button>
              <Button
                rounded={"full"}
                onClick={() => onSelect?.(selectedMedia)}
              >
                Confirm Selection
              </Button>
            </HStack>
          </HStack>
        </Box>
      )}
    </Box>
  );
};
