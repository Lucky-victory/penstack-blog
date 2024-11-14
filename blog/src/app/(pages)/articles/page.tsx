import { Box } from "@chakra-ui/react";
import PageWrapper from "../../components/PageWrapper";
import { PostsCards } from "../../components/PostsCards";

export default function Posts() {
  return (
    <PageWrapper>
      <Box py={8} px={{ base: 4, md: 6, lg: 8 }}>
        <PostsCards />
      </Box>
    </PageWrapper>
  );
}
