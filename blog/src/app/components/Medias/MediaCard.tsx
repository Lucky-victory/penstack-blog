import React from "react";
import {
  LuFile,
  LuImage,
  LuVideo,
  LuFileAudio,
  LuFileText,
} from "react-icons/lu";
import { Box, Card, CardBody, CardFooter } from "@chakra-ui/react";
import { formatBytes } from "@/src/utils";
import { Image } from "@chakra-ui/react";
import { MediaResponse } from "@/src/types";

interface MediaCardProps {
  media: MediaResponse;
  onSelect?: (media: MediaResponse) => void;
  selected?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  media,
  onSelect,
  selected,
}) => {
  const getIcon = () => {
    switch (media.type) {
      case "image":
        return <LuImage />;
      case "video":
        return <LuVideo />;
      case "audio":
        return <LuFileAudio />;
      case "pdf":
        return <LuFileText />;
      default:
        return <LuFile />;
    }
  };

  const handleClick = () => {
    console.log(media);

    onSelect?.(media);
  };
  console.log(selected);

  return (
    <Card
      rounded={{ base: 20, md: 24 }}
      boxShadow={selected ? "outline" : "none"}
      _hover={
        selected
          ? {}
          : {
              boxShadow: "lg",
            }
      }
      className={`
        cursor-pointer transition-all duration-200
      `}
      onClick={handleClick}
    >
      <CardBody className="p-2">
        {media.type === "image" && (
          <div className="aspect-square rounded-md overflow-hidden">
            <Image
              src={media.url}
              alt={media.alt_text || media.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {media.type === "video" && (
          <div className="aspect-square rounded-md overflow-hidden">
            <Box
              as="video"
              controls
              src={media.url}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {media.type !== "video" && media.type !== "image" && (
          <div className="aspect-square rounded-md bg-gray-100 flex items-center justify-center">
            {getIcon()}
          </div>
        )}
      </CardBody>
      <CardFooter className="p-2 text-sm">
        <div className="w-full truncate">
          <p className="font-medium truncate">{media.name}</p>
          <p className="text-gray-500 text-xs">{formatBytes(media.size)}</p>
        </div>
      </CardFooter>
    </Card>
  );
};
