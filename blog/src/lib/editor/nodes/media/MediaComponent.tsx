import React, { useCallback, useState } from "react";
import {
  Box,
  Input,
  VStack,
  Image,
  Button,
  AspectRatio,
  Select,
  NumberInput,
  NumberInputField,
  FormControl,
  FormLabel,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { MediaModal } from "@/src/app/components/TipTapEditor/MenuBar/MediaInsert";
import { MediaResponse } from "@/src/types";

interface MediaComponentProps extends NodeViewProps {
  isRendering?: boolean;
}

const sizeToWidth = {
  small: "300px",
  large: "600px",
  full: "100%",
};

export const MediaComponent: React.FC<MediaComponentProps> = ({
  node,
  updateAttributes,
}) => {
  const {
    isOpen: isMediaModalOpen,
    onClose: onMediaModalClose,
    onOpen: onMediaModalOpen,
  } = useDisclosure();

  const [url, setUrl] = useState(node?.attrs?.url || "");
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const [medias, setMedias] = useState<MediaResponse[]>([]);
  const getPositionStyles = (position: string) => {
    switch (position) {
      case "left":
        return { float: "left", marginRight: "1rem" };
      case "right":
        return { float: "right", marginLeft: "1rem" };
      case "center":
        return { margin: "0 auto" };
      case "inline":
        return { display: "inline-block", verticalAlign: "middle" };
      default:
        return { display: "block" };
    }
  };
  const handleMediasSelect = useCallback(
    (medias: MediaResponse | MediaResponse[]) => {
      if (Array.isArray(medias) && medias.length > 0) {
        setMedias(medias);
        medias.map((media) => {
          updateAttributes({
            url: media?.url,
            alt: media?.name,
            title: media?.caption as string,
            type: media.type,
          });
        });
      }
    },
    []
  );
  if (!node.attrs.url) {
    return (
      <NodeViewWrapper>
        <Box
          p={4}
          border="2px"
          borderStyle="dashed"
          borderColor={borderColor}
          rounded="lg"
        >
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Size</FormLabel>
              <Select
                value={node.attrs.size}
                onChange={(e) => updateAttributes({ size: e.target.value })}
              >
                <option value="small">Small</option>
                <option value="large">Large</option>
                <option value="full">Full Width</option>
              </Select>
            </FormControl>

            <Button colorScheme="blue" onClick={() => onMediaModalOpen()}>
              Insert Media
            </Button>
          </VStack>
        </Box>
        <MediaModal
          isOpen={isMediaModalOpen}
          onClose={onMediaModalClose}
          onSelect={(medias) => {
            handleMediasSelect(medias);
            onMediaModalClose();
          }}
        />
      </NodeViewWrapper>
    );
  }

  const containerStyle = {
    ...getPositionStyles(node.attrs.position),
    width: node.attrs.width || sizeToWidth[node.attrs.size],
    maxWidth: "100%",
  };

  return (
    <>
      <NodeViewWrapper>
        <Box
          style={containerStyle}
          position="relative"
          className="media-container"
        >
          {node.attrs.type === "image" ? (
            <Image
              src={node.attrs.url}
              alt={node.attrs.alt}
              width="100%"
              height={node.attrs.height || "auto"}
              objectFit="cover"
            />
          ) : (
            <AspectRatio ratio={16 / 9}>
              <video controls width="100%" height={node.attrs.height || "auto"}>
                <source src={node.attrs.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </AspectRatio>
          )}
        </Box>
      </NodeViewWrapper>
    </>
  );
};
