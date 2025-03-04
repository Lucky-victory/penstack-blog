import React from "react";
import { Box } from "@chakra-ui/react";
import { PostSelect } from "@/src/types";
import { ContentRenderer } from "../../Renderers/ContentRenderer";

import { decodeAndSanitizeHtml } from "@/src/utils";

interface ArticleContentProps {
  post: PostSelect;
}

export const ArticleContent: React.FC<ArticleContentProps> = ({ post }) => {
  return (
    <Box maxW="100%" pb={8} flexShrink={0}>
      <Box maxW="container.lg">
        <ContentRenderer content={decodeAndSanitizeHtml(post?.content || "")} />
      </Box>
    </Box>
  );
};
