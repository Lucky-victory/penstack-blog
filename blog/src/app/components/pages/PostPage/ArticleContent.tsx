import React from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { PostSelect } from "@/src/types";
import { ContentRenderer } from "../../Renderers/ContentRenderer";
import { decode } from "html-entities";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface ArticleContentProps {
  post: PostSelect;
}

export const ArticleContent: React.FC<ArticleContentProps> = ({ post }) => {
  const summaryColor = useColorModeValue("gray.700", "gray.300");

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      maxW="none"
      pb={8}
    >
      {post.summary && (
        <Text
          fontSize="xl"
          fontWeight="medium"
          mb={6}
          color={summaryColor}
          lineHeight="tall"
        >
          {post.summary}
        </Text>
      )}
      <Box maxW="container.lg" mx="auto">
        <ContentRenderer content={decode(post.content)} />
      </Box>
    </MotionBox>
  );
};
