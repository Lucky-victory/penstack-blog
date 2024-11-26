import React, { useState } from "react";
import {
  LuFile,
  LuImage,
  LuVideo,
  LuFileAudio,
  LuFileText,
  LuEye,
  LuCheckSquare,
  LuBoxSelect,
} from "react-icons/lu";
import {
  Box,
  Button,
  Card,
  CardBody,
  useDisclosure,
  CardFooter,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { formatBytes } from "@/src/utils";
import { Image } from "@chakra-ui/react";
import { MediaResponse } from "@/src/types";
import FilePreview from "./FilePreview";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mediaToPreview, setMediaToPreview] = useState<MediaResponse | null>(
    null
  );

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

  const handleSelectClick = () => {
    onSelect?.(media);
  };
  const handlePreviewClick = (media: MediaResponse) => {
    setMediaToPreview(media);
    onOpen();
  };
  return (
    <>
      <FilePreview isOpen={isOpen} onClose={onClose} file={mediaToPreview!} />

      <Card
        pos={"relative"}
        rounded={20}
        boxShadow={selected ? "outline" : "none"}
        _hover={
          selected
            ? {}
            : {
                boxShadow: "lg",
                ring: "2",
              }
        }
        className={`
        cursor-pointer transition-all duration-200
      `}
        // onClick={handleSelectClick}
        bg={useColorModeValue("gray.50", "black")}
      >
        <CardBody p={2} pos={"relative"}>
          <Box
            zIndex={10}
            bottom={0}
            right={0}
            position={"absolute"}
            left={0}
            p={3}
            bg={useColorModeValue("gray.50", "black")}
          >
            <HStack justify={"stretch"}>
              <Button
                size="sm"
                colorScheme={selected ? "blue" : "gray"}
                // variant={selected ? "solid" : "ghost"}
                leftIcon={selected ? <LuCheckSquare /> : <LuBoxSelect />}
                rounded={"full"}
                flex={1}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(media);
                }}
              >
                Select
              </Button>
              <Button
                flex={1}
                size="sm"
                variant="outline"
                rounded={"full"}
                colorScheme="black"
                leftIcon={<LuEye />}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreviewClick(media);
                }}
              >
                Preview
              </Button>
            </HStack>
          </Box>
          {media.type === "image" && (
            <Box rounded={"md"} overflow={"hidden"}>
              <Image
                src={media.url}
                alt={media.alt_text || media.name}
                w="full"
                h="full"
                objectFit={"cover"}
              />
            </Box>
          )}
          {media.type === "video" && (
            <Box
              rounded={"md"}
              position="relative"
              aspectRatio={"1/1"}
              overflow={"hidden"}
            >
              <Box
                as="video"
                controls
                src={media.url}
                w="full"
                h="full"
                objectFit={"cover"}
              />
            </Box>
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
    </>
  );
};
