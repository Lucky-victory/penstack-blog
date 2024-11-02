import React, { useEffect, useState } from "react";
import { MediaCard } from "./MediaCard";
import { MediaFilter } from "./MediaFilter";
import { Button } from "@chakra-ui/react";
import { LuLoader2 } from "react-icons/lu";
import { useDebounce } from "@/src/hooks";
import { FilterParams, MediaResponse, PaginatedResponse } from "@/src/types";
import axios from "axios";

interface MediaLibraryProps {
  onSelect?: (media: MediaResponse | MediaResponse[]) => void;
  multiple?: boolean;
  defaultFilters?: Partial<FilterParams>;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  onSelect,
  multiple = false,
  defaultFilters = {},
}) => {
  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    limit: 20,
    ...defaultFilters,
  });
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState<PaginatedResponse<MediaResponse>>();
  const [selectedMedia, setSelectedMedia] = useState<MediaResponse[]>([]);
  const [folders, setFolders] = useState<string[]>([]);

  const debouncedFilters = useDebounce(filters, 300);

  useEffect(() => {
    fetchMedia();
  }, [debouncedFilters]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(debouncedFilters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, v));
        } else if (value) {
          queryParams.append(key, value.toString());
        }
      });

      const { data: media } = await axios(`/api/media?${queryParams}`);
      const { data } = await axios<{ data: string[] }>(`/api/media/folders`);

      setMedia(media);
      setFolders(data?.data);
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="space-y-6">
      <MediaFilter onFilterChange={handleFilterChange} folders={folders} />

      {loading && media?.data.length === 0 ? (
        <div className="flex justify-center py-12">
          <LuLoader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {media?.data.map((item) => (
              <MediaCard
                key={item.id}
                media={item}
                onSelect={handleSelect}
                selected={!!selectedMedia.find((m) => m.id === item.id)}
              />
            ))}
          </div>

          {media && media.meta.page < media.meta.totalPages && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading && <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                Load More
              </Button>
            </div>
          )}
        </>
      )}

      {multiple && selectedMedia.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <p>{selectedMedia.length} items selected</p>
            <Button onClick={() => onSelect?.(selectedMedia)}>
              Confirm Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
