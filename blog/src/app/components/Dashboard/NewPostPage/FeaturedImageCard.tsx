"use client";
import {
  Box,
  Flex,
  Image,
  useColorModeValue,
  Text,
  Stack,
  IconButton,
  Tooltip,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import isEmpty from "just-is-empty";
import { MediaModal } from "../../TextEditor/MenuBar/MediaInsert";
import { MediaResponse } from "@/src/types";
export const FeaturedImageCard = ({
  image,
  onChange,
}: {
  image: { url: string; alt_text?: string; caption?: string } | null;
  onChange: (imageId: number | null) => void;
}) => {
  const borderColor = useColorModeValue("gray.400", "gray.700");
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("gray.500", "gray.200");
  const [featuredImage, setFeaturedImage] =
    useState<Partial<MediaResponse | null>>(image);
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Box mb={3}>
        <Flex
          mb={3}
          pos={"relative"}
          borderWidth={isEmpty(featuredImage) ? "1px" : "0"}
          borderStyle={isEmpty(featuredImage) ? "dashed" : "none"}
          borderColor={isEmpty(featuredImage) ? borderColor : "transparent"}
          bg={bgColor}
          rounded={"md"}
          h={"157.5px"}
          w={"full"}
          aspectRatio={"2:1"}
          maxW={"300px"}
        >
          {!isEmpty(featuredImage) && (
            <>
              <Image
                src={featuredImage?.url}
                alt={"featured image"}
                h={"100%"}
                w={"full"}
                objectFit={"cover"}
              />
              <Tooltip
                label="Remove image"
                hasArrow
                placement="top"
                rounded={"md"}
              >
                <IconButton
                  zIndex={9}
                  pos="absolute"
                  top={1}
                  right={2}
                  aria-label=""
                  size={"sm"}
                  colorScheme="red"
                  onClick={() => {
                    setFeaturedImage(null);
                    onChange(null);
                  }}
                >
                  <LuTrash2 />
                </IconButton>
              </Tooltip>
            </>
          )}

          {isEmpty(featuredImage) && (
            <Stack justify={"center"} align={"center"} h={"100%"} w={"full"}>
              <Text
                px={2}
                display={"inline-block"}
                as="span"
                color={textColor}
                fontSize={"14px"}
                fontWeight={500}
                textAlign={"center"}
              >
                No featured image (recommended size: 1200x630)
              </Text>
            </Stack>
          )}
        </Flex>

        <Button
          gap={2}
          size={"xs"}
          onClick={() => onOpen()}
          rounded="full"
          leftIcon={!featuredImage ? <LuPlus /> : undefined}
          //   variant={"ghost"}
          w={"full"}
        >
          <Text as="span">
            {featuredImage ? "Change image" : "Add featured image"}{" "}
          </Text>
        </Button>
      </Box>
      <MediaModal
        onClose={onClose}
        isOpen={isOpen}
        maxSelection={1}
        defaultFilters={{ type: ["image"] }}
        onSelect={(media) => {
          if (Array.isArray(media)) {
            setFeaturedImage(media[0]);
            onChange(media[0]?.id);
          }
        }}
      />
    </>
  );
};
