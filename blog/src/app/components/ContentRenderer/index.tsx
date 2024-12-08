import React from "react";
import parse, {
  domToReact,
  HTMLReactParserOptions,
  Element,
} from "html-react-parser";
import { MiniPostCardRenderer } from "./MiniPostCardRenderer";

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
                  postId: domNode.attribs.postid,
                  customTitle: domNode.attribs.customtitle,
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

  return <div className={className}>{parse(content, options)}</div>;
};
