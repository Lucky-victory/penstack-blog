import React from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { PostSelect } from "@/src/types";
import { ContentRenderer } from "../../Renderers/ContentRenderer";

import { motion } from "framer-motion";
import { decodeAndSanitizeHtml } from "@/src/utils";

const MotionBox = motion(Box);

interface ArticleContentProps {
  post: PostSelect;
}

export const ArticleContent: React.FC<ArticleContentProps> = ({ post }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      maxW="100%"
      pb={8}
    >
      <Box maxW="container.lg">
        <ContentRenderer content={decodeAndSanitizeHtml(post?.content || "")} />
      </Box>
    </MotionBox>
  );
};
