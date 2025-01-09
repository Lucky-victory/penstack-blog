import { Box } from "@chakra-ui/react";
import PageWrapper from "../../components/PageWrapper";
import { PostsCards } from "../../../themes/smooth-land/PostsCards";

export default function Posts() {
  return (
    <PageWrapper>
      <Box py={8} px={{ base: 4, lg: 4 }} maxW={"container.xl"} mx="auto">
        <PostsCards />
      </Box>
    </PageWrapper>
  );
}
