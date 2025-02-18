import { EDITOR_CONTEXT_STATE } from "@/src/types";
import { Box, Text } from "@chakra-ui/react";
import { FeaturedImageCard } from "../../FeaturedImageCard";
import { useEditorPostManagerStore } from "@/src/state/editor-post-manager";

export const FeaturedImageSection = ({
  activePost,
}: {
  activePost: EDITOR_CONTEXT_STATE["activePost"];
}) => {
  const updateField = useEditorPostManagerStore((state) => state.updateField);
  const featuredImage = useEditorPostManagerStore(
    (state) => state.activePost?.featured_image
  );

  return (
    <Box>
      <Text as="span" fontWeight={500}>
        Featured Image:
      </Text>
      <FeaturedImageCard
        onChange={(imageId) => {
          updateField("featured_image_id", imageId);
        }}
        image={featuredImage || null}
      />
    </Box>
  );
};
