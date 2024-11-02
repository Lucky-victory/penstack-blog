import React from "react";
import { LuSearch } from "react-icons/lu";
import { Input } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { FilterParams, MediaType } from "@/src/types";

interface MediaFilterProps {
  onFilterChange: (filters: Partial<FilterParams>) => void;
  folders: string[];
}

export const MediaFilter: React.FC<MediaFilterProps> = ({
  onFilterChange,
  folders,
}) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <LuSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search media..."
          className="pl-10"
          onChange={(e) => onFilterChange({ search: e.target.value })}
        />
      </div>
      <div className="flex gap-4">
        <Select
          onChange={(e) =>
            onFilterChange({
              type: e.target.value ? [e.target.value as MediaType] : undefined,
            })
          }
        >
          <option value="">All types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="audio">Audio</option>
          <option value="pdf">PDF</option>
          <option value="doc">Documents</option>
        </Select>

        <Select
          onChange={(e) =>
            onFilterChange({ folder: e.target.value || undefined })
          }
        >
          <option value="">All folders</option>
          {folders.map((folder) => (
            <option key={folder} value={folder}>
              {folder}
            </option>
          ))}
        </Select>

        <Select
          onChange={(e) => {
            const value = e.target.value;
            if (!value) return;
            onFilterChange({
              sortBy: value.split("-")[0] as "created_at" | "name" | "size",
              sortOrder: value.split("-")[1] as "asc" | "desc",
            });
          }}
        >
          <option value="">Sort by</option>
          <option value="created_at-desc">Newest first</option>
          <option value="created_at-asc">Oldest first</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="size-desc">Largest first</option>
          <option value="size-asc">Smallest first</option>
        </Select>
      </div>
    </div>
  );
};
