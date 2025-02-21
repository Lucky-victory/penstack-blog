import React, { memo } from "react";
import parse, {
  domToReact,
  HTMLReactParserOptions,
  Element,
  DOMNode,
} from "html-react-parser";
import { MiniPostCardRenderer } from "../MiniPostCardRenderer";
import { PenstackYouTubeEmbed } from "../YoutubeEmbedRenderer";
import { PenstackTwitterEmbed } from "../TwitterEmbedRenderer";
import {
  Box,
  Text,
  Heading,
  UnorderedList,
  OrderedList,
  ListItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Code,
  Divider,
  Link,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { PenstackCodeBlockRenderer } from "../PenstackCodeBlockRenderer";
import PenstackBlockquoteRenderer from "../PenstackBlockquoteRenderer";
interface ContentRendererProps {
  content: string;
  className?: string;
}

export const ContentRenderer: React.FC<ContentRendererProps> = memo(
  ({ content, className }) => {
    const options: HTMLReactParserOptions = {
      replace: (domNode) => {
        if (domNode instanceof Element && domNode.attribs) {
          if (domNode.name === "pre") {
            const firstChild = domNode.children.find(
              (child): child is Element =>
                child instanceof Element && child.name === "code"
            );

            if (firstChild) {
              const langClass = firstChild.attribs.class || "";
              const language = langClass.replace("language-", "") || "";
              const code =
                (firstChild.children[0] as DOMNode & { data?: string })?.data ||
                "";
              return (
                <PenstackCodeBlockRenderer language={language} code={code} />
              );
            }
          }

          // Handle PostCard
          if (domNode.attribs?.["data-type"] === "post-card") {
            return (
              <MiniPostCardRenderer 
                isEditing={false}
                node={{
                  attrs: {
                    postIds: domNode.attribs.postids,
                    customTitle: domNode.attribs.customtitle,
                  },
                }}
              />
            );
          }
          if (domNode.attribs?.["data-type"] === "penstack-youtube-embed") {
            return (
              <PenstackYouTubeEmbed
                isEditing={false}
                node={{
                  attrs: {
                    videoId: domNode.attribs.videoid,
                    title: domNode.attribs.title,
                  },
                }}
              />
            );
          }
          if (domNode.attribs?.["data-type"] === "penstack-twitter-embed") {
            return (
              <PenstackTwitterEmbed
                isEditing={false}
                node={{
                  attrs: {
                    tweetId: domNode.attribs.tweetid,
                    caption: domNode.attribs.caption,
                  },
                }}
              />
            );
          }

          // Handle block elements with Chakra UI components
          if (domNode.name === "p" && !domNode.parent) {
            return (
              <Text mb={4}>
                {domToReact(domNode.children as Element[], options)}
              </Text>
            );
          }
          if (domNode.name === "h1") {
            return (
              <Heading {...domNode.attribs} as="h1" size="4xl" mt={8} mb={4}>
                {domToReact(domNode.children as Element[], options)}
              </Heading>
            );
          }
          if (domNode.name === "h2") {
            return (
              <Heading {...domNode.attribs} as="h2" size="2xl" mt={6} mb={3}>
                {domToReact(domNode.children as Element[], options)}
              </Heading>
            );
          }
          if (domNode.name === "h3") {
            return (
              <Heading {...domNode.attribs} as="h3" size="lg" mt={4} mb={2}>
                {domToReact(domNode.children as Element[], options)}
              </Heading>
            );
          }
          if (domNode.name === "h4") {
            return (
              <Heading {...domNode.attribs} as="h4" size="md" mb={2}>
                {domToReact(domNode.children as Element[], options)}
              </Heading>
            );
          }
          if (domNode.name === "h5") {
            return (
              <Heading {...domNode.attribs} as="h5" size="sm" mb={2}>
                {domToReact(domNode.children as Element[], options)}
              </Heading>
            );
          }
          if (domNode.name === "h6") {
            return (
              <Heading {...domNode.attribs} as="h6" size="xs" mb={2}>
                {domToReact(domNode.children as Element[], options)}
              </Heading>
            );
          }
          if (domNode.name === "ul") {
            return (
              <UnorderedList my={4} spacing={0} pl={"1.75rem"}>
                {domToReact(domNode.children as Element[], options)}
              </UnorderedList>
            );
          }
          if (domNode.name === "ol") {
            return (
              <OrderedList my={4} spacing={3} pl={"1.75rem"}>
                {domToReact(domNode.children as Element[], options)}
              </OrderedList>
            );
          }
          if (domNode.name === "li") {
            return (
              <ListItem>
                {domToReact(domNode.children as Element[], options)}
              </ListItem>
            );
          }
          if (domNode.name === "table") {
            return (
              <TableContainer>
                <Table>
                  {domToReact(domNode.children as Element[], options)}
                </Table>
              </TableContainer>
            );
          }
          if (domNode.name === "thead") {
            return (
              <Thead>
                {domToReact(domNode.children as Element[], options)}
              </Thead>
            );
          }
          if (domNode.name === "tbody") {
            return (
              <Tbody>
                {domToReact(domNode.children as Element[], options)}
              </Tbody>
            );
          }
          if (domNode.name === "tr") {
            return (
              <Tr>{domToReact(domNode.children as Element[], options)}</Tr>
            );
          }
          if (domNode.name === "th") {
            return (
              <Th>{domToReact(domNode.children as Element[], options)}</Th>
            );
          }
          if (domNode.name === "td") {
            return (
              <Td>{domToReact(domNode.children as Element[], options)}</Td>
            );
          }
          if (domNode.name === "code") {
            return (
              <Code
                color={"red.600"}
                bg={useColorModeValue("gray.200", "gray.800")}
              >
                {domToReact(domNode.children as Element[], options)}
              </Code>
            );
          }
          if (domNode.name === "hr") {
            return <Divider />;
          }
          if (domNode.name === "a") {
            return (
              <Link
                href={domNode.attribs.href}
                isExternal={domNode.attribs.target === "_blank"}
              >
                {domToReact(domNode.children as Element[], options)}
              </Link>
            );
          }
          if (domNode.name === "img") {
            return (
              <Image src={domNode.attribs.src} alt={domNode.attribs.alt} />
            );
          }
          if (domNode.name === "blockquote") {
            return (
              <PenstackBlockquoteRenderer
                isEditing={false}
                node={{
                  attrs: {
                    variant: domNode.attribs.variant,
                  },
                }}
              >
                {domToReact(domNode.children as Element[], options)}
              </PenstackBlockquoteRenderer>
            );
          }
        }
      },
    };

    return <Box className={className}>{parse(content, options)}</Box>;
  }
);
ContentRenderer.displayName = "ContentRenderer";

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

function getWeightForClassName(className: string): string {
  const classesToBold = [
    "hljs-keyword",
    "hljs-built_in",
    "hljs-type",
    "hljs-function",
    "hljs-class",
    "hljs-title",
  ];

  return classesToBold.includes(className) ? "bold" : "normal";
}

function getStyleForClassName(className: string): string {
  const classesToItalicize = ["hljs-comment", "hljs-doctag", "hljs-meta"];

  return classesToItalicize.includes(className) ? "italic" : "normal";
}
