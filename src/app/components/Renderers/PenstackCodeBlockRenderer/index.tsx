import { Box, Code, Text, useColorModeValue } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import { all, createLowlight } from "lowlight";

const lowlight = createLowlight(all);
interface PenstackCodeBlockRendererProps {
  language: string;
  code: string;
}
export const PenstackCodeBlockRenderer: React.FC<
  PropsWithChildren<PenstackCodeBlockRendererProps>
> = ({ language, code, children }) => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const codeBlackMaxHeight = 450;
  const Content = () => {
    try {
      let result;
      if (language) {
        result = lowlight.highlight(language, code);
      } else {
        result = lowlight.highlightAuto(code);
      }

      // Convert the result to React elements
      const codeElements = convertNodeToReactElements(result.children);

      return (
        <Box
          className="penstack-code-block"
          // maxH={codeBlackMaxHeight}
        >
          <Box
            as="pre"
            whiteSpace={"pre-wrap"}
            fontFamily="monospace"
            position="relative"
          >
            <Text
              position="absolute"
              top={1}
              right={2}
              fontSize="xs"
              color="gray.500"
            >
              {language}
            </Text>
            <Box as="code">{codeElements}</Box>
          </Box>
        </Box>
      );
    } catch (e) {
      // Fallback if highlighting fails
      console.error("Error highlighting code:", e);
      return (
        <Box className="penstack-code-block">
          <Box as="pre" fontFamily="monospace">
            <Code whiteSpace="pre-wrap" display="block">
              {code}
            </Code>
          </Box>
        </Box>
      );
    }
  };
  return <>{<Content />}</>;
};
function convertNodeToReactElements(nodes: any[]): React.ReactNode {
  return nodes.map((node, i) => {
    if (node.type === "text") {
      return <React.Fragment key={i}>{node.value}</React.Fragment>;
    }
    if (node.type === "element") {
      const className = node.properties.className || [];
      return (
        <Box as="span" key={i} className={className.join(" ")} display="inline">
          {convertNodeToReactElements(node.children)}
        </Box>
      );
    }
    return null;
  });
}
