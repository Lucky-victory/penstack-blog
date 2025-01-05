import React from "react";
import parse, {
  domToReact,
  HTMLReactParserOptions,
  Element,
} from "html-react-parser";
import { MiniPostCardRenderer } from "../MiniPostCardRenderer";
import { YouTubeEmbed } from "../YoutubeEmbedRenderer";
import { TwitterEmbed } from "../TwitterEmbedRenderer";
import { Box } from "@chakra-ui/react";

interface ContentRendererProps {
  content: string;
  className?: string;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  className,
}) => {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.attribs) {
        // Handle PostCard
        if (domNode.attribs["data-type"] === "post-card") {
          return (
            <MiniPostCardRenderer
              node={{
                attrs: {
                  postIds: domNode.attribs.postid
                    ? [domNode.attribs.postid]
                    : domNode.attribs.postids,
                  customTitle: domNode.attribs.customtitle,
                },
              }}
            />
          );
        }
        if (domNode.attribs["data-type"] === "youtube-embed") {
          return (
            <YouTubeEmbed
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
        if (domNode.attribs["data-type"] === "twitter-embed") {
          return (
            <TwitterEmbed
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

        // Handle other block elements
        if (domNode.name === "p") {
          return (
            <p className="mb-4">
              {domToReact(domNode.children as Element[], options)}
            </p>
          );
        }

        // Add more custom element handlers here
      }
    },
  };

  return <Box className={className}>{parse(content, options)}</Box>;
};
