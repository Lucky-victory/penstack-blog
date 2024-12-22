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
  LuSquare,
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
  IconButton,
  VStack,
  Center,
  DarkMode,
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
  const cardBgColor = useColorModeValue("gray.50", "black");
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
        rounded={"lg"}
        overflow={"hidden"}
        boxShadow={selected ? "outline" : "none"}
        onClick={() => {
          handleSelectClick();
        }}
        sx={{
          "&:hover": {
            ".media-card-select": {
              zIndex: 10,
              transform: "translateX(0)",
            },
            ".media-card-overlay": {
              zIndex: 10,
              transform: "translateY(0)",
            },
          },
        }}
        _hover={
          selected
            ? {}
            : {
                boxShadow: "lg",
                ring: "2",
              }
        }
        bg={cardBgColor}
      >
        <Box
          pos="absolute"
          top={4}
          right={4}
          zIndex={!selected ? -1 : 10}
          transform={!selected ? "translateX(150%)" : "none"}
          className="media-card-select"
          transition={"transform 0.2s ease-in-out"}
        >
          <IconButton
            size="sm"
            aria-label="Select"
            // colorScheme={selected ? "blue" : "gray"}
            icon={selected ? <LuCheckSquare /> : <LuSquare fontWeight={500} />}
            rounded={"full"}
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(media);
            }}
          ></IconButton>
        </Box>
        <VStack
          transition={"transform 0.2s ease-in-out"}
          zIndex={-1}
          bottom={0}
          right={0}
          position={"absolute"}
          left={0}
          p={3}
          className="media-card-overlay"
          borderTop={"1px solid"}
          borderColor={"gray.400"}
          roundedBottom={"lg"}
          shadow={"lg"}
          bg={cardBgColor}
          transform={"translateY(100%)"}
        >
          <Button
            size="sm"
            variant="outline"
            rounded={"lg"}
            leftIcon={<LuEye />}
            onClick={(e) => {
              e.stopPropagation();
              handlePreviewClick(media);
            }}
          >
            Preview
          </Button>
        </VStack>
        <CardBody pos={"relative"}>
          {media.type === "image" && (
            <Box rounded={"md"} h={200}>
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
            <Box rounded={"md"} position="relative" h={200}>
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
            <Box
              h={200}
              className=" rounded-md bg-gray-100 flex items-center justify-center"
            >
              {getIcon()}
            </Box>
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
