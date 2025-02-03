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
} from "@chakra-ui/react";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { ChangeEvent, memo, useEffect } from "react";

interface PenstackTwitterEmbedProps {
  isEditing?: boolean;
  node: Partial<NodeViewProps["node"]>;
  updateAttributes?: (attrs: Record<string, any>) => void;
}

export const PenstackTwitterEmbed: React.FC<PenstackTwitterEmbedProps> = memo(
  ({ node, isEditing = true, updateAttributes }) => {
    const bgColor = useColorModeValue("gray.50", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const { colorMode } = useColorMode();
    useEffect(() => {
      const twitterScript = document.getElementById(
        "penstack-twitter-embed-script"
      );

      if (!window?.twttr) {
        const script = document.createElement("script");
        script.id = "penstack-twitter-embed-script";
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          if (window.twttr) {
            window.twttr.widgets.load();
          }
        };
      } else {
        window.twttr.widgets.load();
      }

      return () => {
        const scriptToRemove = document.getElementById(
          "penstack-twitter-embed-script"
        );

        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }, []);

    const handleCaptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      updateAttributes?.({ caption: e.target.value });
    };

    if (!node?.attrs?.tweetId) return null;
    const content = (
      <Card maxW="full">
        <CardBody>
          <VStack align="stretch" spacing={3}>
            <Box
              className="twitter-tweet-container"
              sx={{
                "& .twitter-tweet": {
                  margin: "0 auto !important",
                },
              }}
            >
              <div id={`tweet-${node.attrs.tweetId}`}>
                <Box
                  className="twitter-tweet"
                  data-conversation="none"
                  data-theme={colorMode === "dark" ? "dark" : "light"}
                >
                  <Link
                    isExternal
                    href={`https://twitter.com/x/status/${node.attrs.tweetId}`}
                  >
                    <Spinner />
                  </Link>
                </Box>
              </div>
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
          </VStack>
        </CardBody>
      </Card>
    );
    return (
      <>{isEditing ? <NodeViewWrapper>{content}</NodeViewWrapper> : content}</>
    );
  }
);

declare global {
  interface Window {
    twttr: any;
  }
}
PenstackTwitterEmbed.displayName = "TwitterEmbed";
