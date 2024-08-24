import React, { useState } from "react";
import { NodeViewWrapper, NodeConfig } from "@tiptap/react";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
  getCldImageUrl,
} from "next-cloudinary";
import {
  Button,
  Image,
  Box,
  HStack,
  IconButton,
  useColorModeValue,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Flex,
  Tooltip,
  SliderMark,
} from "@chakra-ui/react";
import { LuPilcrow } from "react-icons/lu";
import {
  AiOutlineAlignLeft,
  AiOutlineAlignCenter,
  AiOutlineAlignRight,
} from "react-icons/ai";

const ImageBlockComponent = ({
  node,
  updateAttributes,
}: {
  node: NodeConfig;
  updateAttributes: (props: { src?: string; alt?: string }) => void;
}) => {
  const [imageWidth, setImageWidth] = useState(100);
  const [imageAlign, setImageAlign] = useState("center");
  const [showTooltip, setShowTooltip] = React.useState(false);
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const uploadBgColor = useColorModeValue("gray.300", "gray.700");

  function handleCldUploadWidgetSuccess(
    cldUpload: CloudinaryUploadWidgetResults
  ) {
    const imageUrl = getCldImageUrl({
      src: (cldUpload.info as CloudinaryUploadWidgetInfo).public_id,
    });
    updateAttributes({ src: imageUrl });
  }

  function handleSliderChange(value: number) {
    setImageWidth(value);
  }

  function handleAlignChange(align: string) {
    setImageAlign(align);
    // updateAttributes({ align });
  }

  console.log({ node });
  return (
    <NodeViewWrapper className="cursor-auto">
      <Box contentEditable={false}>
        <HStack
          mx={"auto"}
          bg={bgColor}
          p={2}
          borderRadius={"2xl"}
          maxW={450}
          // justifyContent={"space-between"}
        >
          <HStack>
            <IconButton
              aria-label="Align Left"
              size={"sm"}
              icon={<AiOutlineAlignLeft />}
              onClick={() => handleAlignChange("flex-start")}
            />
            <IconButton
              aria-label="Align Center"
              size={"sm"}
              icon={<AiOutlineAlignCenter />}
              onClick={() => handleAlignChange("center")}
            />
            <IconButton
              aria-label="Align Right"
              size={"sm"}
              icon={<AiOutlineAlignRight />}
              onClick={() => handleAlignChange("flex-end")}
            />

            <Slider
              aria-label="image-width-slider"
              defaultValue={100}
              min={25}
              minW={100}
              max={100}
              onChange={handleSliderChange}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <SliderMark value={25}>25%</SliderMark>
              <SliderMark value={100}>100%</SliderMark>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <Tooltip
                bg="blue.600"
                hasArrow
                rounded={"md"}
                placement="top"
                isOpen={showTooltip}
                label={`${imageWidth}%`}
              >
                <SliderThumb />
              </Tooltip>
            </Slider>
          </HStack>
        </HStack>
        <Flex
          w={"full"}
          style={{
            justifyContent: imageAlign,
          }}
        >
          {node.attrs.src && (
            <>
              <Image
                src={node.attrs.src}
                alt={node.attrs.alt || ""}
                style={{
                  width: `${imageWidth}%`,
                }}
              />
            </>
          )}
        </Flex>
        {!node.attrs.src && (
          <Flex
            minH={150}
            border={1}
            borderStyle={"dashed"}
            borderColor={"gray.400"}
            rounded={"lg"}
            p={4}
            justify={"center"}
            align={"center"}
            bg={uploadBgColor}
          >
            <CldUploadWidget
              uploadPreset="post_images"
              onSuccess={handleCldUploadWidgetSuccess}
            >
              {({ open }) => (
                <Button rounded={"full"} onClick={() => open()}>
                  Upload Image
                </Button>
              )}
            </CldUploadWidget>
          </Flex>
        )}
      </Box>
    </NodeViewWrapper>
  );
};
export default ImageBlockComponent;
