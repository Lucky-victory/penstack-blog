import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Input,
  useColorModeValue,
  VStack,
  Spinner,
  useColorMode,
  Card,
  CardBody,
  Textarea,
  Stack,
  Skeleton,
  SkeletonText,
  HStack,
  SkeletonCircle,
} from "@chakra-ui/react";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { ChangeEvent, memo, useEffect } from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";

interface PenstackTwitterEmbedProps {
  isEditing?: boolean;
  node: Partial<NodeViewProps["node"]>;
  updateAttributes?: (attrs: Record<string, any>) => void;
}

export const PenstackTwitterEmbed: React.FC<PenstackTwitterEmbedProps> = ({
  node,
  isEditing = true,
  updateAttributes,
}) => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const { colorMode } = useColorMode();

  const handleCaptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateAttributes?.({ caption: e.target.value });
  };

  if (!node?.attrs?.tweetId) return null;
  const content = (
    <Card maxW="full">
      <CardBody>
        <Stack spacing={2}>
          <Box>
            <TwitterTweetEmbed
              tweetId={node.attrs.tweetId}
              options={{ theme: colorMode }}
              placeholder={
                <Stack>
                  <HStack>
                    <SkeletonCircle size="10" />
                    <SkeletonText noOfLines={1} width="60%" rounded={"xl"} />
                  </HStack>
                  <SkeletonText noOfLines={4} spacing="4" rounded={"xl"} />
                  <Skeleton height="150px" mt={4} rounded={"xl"} />
                </Stack>
              }
            />
          </Box>
          {isEditing && (
            <Textarea
              rows={2}
              border="none"
              borderBottom="1px solid"
              borderColor="gray.300"
              placeholder="Add caption (optional)"
              value={node.attrs.caption || ""}
              variant=""
              onChange={handleCaptionChange}
              resize="none"
            />
          )}
          {!isEditing && node.attrs.caption && (
            <Box fontSize="lg" fontWeight="bold">
              {node.attrs.caption}
            </Box>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
  return (
    <>{isEditing ? <NodeViewWrapper>{content}</NodeViewWrapper> : content}</>
  );
};

PenstackTwitterEmbed.displayName = "TwitterEmbed";
