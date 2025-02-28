// SEOSection.tsx
import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  Textarea,
  Text,
} from "@chakra-ui/react";
import { FeaturedImageCard } from "@/src/app/components/TipTapEditor/FeaturedImageCard";
import { EDITOR_CONTEXT_STATE, PostInsert } from "@/src/types";
import { SlugInput } from "../components/SlugInput";
import { SummaryInput } from "../components/SummaryInput";

import { encode } from "html-entities";
import { useEditorPostManagerStore } from "@/src/state/editor-post-manager";
import { sanitizeAndEncodeHtml } from "@/src/utils";

export const SEOSection = () => {
  const featuredImage = useEditorPostManagerStore(
    (state) => state.activePost?.featured_image
  );
  const summary = useEditorPostManagerStore(
    (state) => state.activePost?.summary
  );
  const updateField = useEditorPostManagerStore((state) => state.updateField);
  const slug = useEditorPostManagerStore((state) => state.activePost?.slug);
  return (
    <Stack p={4}>
      <Text as="span" fontWeight={500}>
        Featured Image:
      </Text>
      <FeaturedImageCard />
      <SlugInput />
      <SummaryInput />
    </Stack>
  );
};
