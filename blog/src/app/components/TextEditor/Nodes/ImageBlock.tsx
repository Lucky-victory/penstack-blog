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
  Text,
  Icon,
} from "@chakra-ui/react";
import {
  LuAlignCenter,
  LuAlignLeft,
  LuAlignRight,
  LuPilcrow,
  LuUpload,
} from "react-icons/lu";

const ImageBlockComponent = ({
  node,
  updateAttributes,
}: {
  node: NodeConfig;
  updateAttributes: (props: { src?: string; alt?: string }) => void;
}) => {
  const [imageWidth, setImageWidth] = useState(100);
  const [imageAlign, setImageAlign] = useState("center");
  const [showTooltip, setShowTooltip] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const bgColor = useColorModeValue("white", "black");
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

  return (
    <>
      <NodeViewWrapper>
        <Box
          contentEditable={false}
          style={{ margin: "2rem 0" }}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          {node.attrs.src && (
            <>
              {showActions && (
                <HStack
                  pos={"absolute"}
                  top={-1}
                  left={"50%"}
                  transform={"translateX(-50%)"}
                  mx={"auto"}
                  bg={bgColor}
                  py={2}
                  px={5}
                  w={"full"}
                  borderRadius={"2xl"}
                  maxW={450}
                  justify={"center"}
                  mb={2}
                  boxShadow={"lg"}
                >
                  <IconButton
                    aria-label="Align Left"
                    size={"sm"}
                    variant={imageAlign === "flex-start" ? "solid" : "ghost"}
                    icon={<LuAlignLeft />}
                    onClick={() => handleAlignChange("flex-start")}
                  />
                  <IconButton
                    aria-label="Align Center"
                    size={"sm"}
                    variant={imageAlign === "center" ? "solid" : "ghost"}
                    icon={<LuAlignCenter />}
                    onClick={() => handleAlignChange("center")}
                  />
                  <IconButton
                    aria-label="Align Right"
                    size={"sm"}
                    variant={imageAlign === "flex-end" ? "solid" : "ghost"}
                    icon={<LuAlignRight />}
                    onClick={() => handleAlignChange("flex-end")}
                  />

                  <Slider
                    aria-label="image-width-slider"
                    defaultValue={100}
                    min={25}
                    ml={3}
                    pl={3}
                    w={130}
                    max={100}
                    onChange={handleSliderChange}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <SliderMark mt={"3px"} value={25} fontSize={"x-small"}>
                      25%
                    </SliderMark>
                    <SliderMark mt={"3px"} value={100} fontSize={"x-small"}>
                      100%
                    </SliderMark>
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
              )}
              <Flex
                w={"full"}
                style={{
                  justifyContent: imageAlign,
                }}
              >
                <Image
                  src={node.attrs.src}
                  alt={node.attrs.alt || ""}
                  style={{
                    width: `${imageWidth}%`,
                  }}
                />
              </Flex>
            </>
          )}
          {!node.attrs.src && (
            <Flex
              h={{ base: 200, lg: 250 }}
              rounded={"xl"}
              p={6}
              justify={"center"}
              mx={"auto"}
              maxW={500}
              align={"center"}
              bgGradient="linear(to-r, green.200, pink.500)"
              backdropFilter={"blur(8px)"}
              flexDirection={"column"}
              gap={4}
            >
              <Text fontSize={"sm"} color={"gray.600"} textAlign={"center"}>
                Enhance your content with visuals. Upload an image to make your
                post more engaging.
              </Text>
              <CldUploadWidget
                uploadPreset="post_images"
                onSuccess={handleCldUploadWidgetSuccess}
              >
                {({ open }) => (
                  <Button
                    rounded={"full"}
                    onClick={() => open()}
                    colorScheme={"blue"}
                    leftIcon={<Icon as={LuUpload} />}
                  >
                    Upload Image
                  </Button>
                )}
              </CldUploadWidget>
            </Flex>
          )}
        </Box>
      </NodeViewWrapper>
    </>
  );
};
export default ImageBlockComponent;
