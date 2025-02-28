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
import { FeaturedImageCard } from "@/src/app/components/TipTapEditor/Sidebar/components/FeaturedImageCard";
import { EDITOR_CONTEXT_STATE, PostInsert } from "@/src/types";
import { SlugInput } from "../components/SlugInput";
import { SummaryInput } from "../components/SummaryInput";

import { encode } from "html-entities";
import { useEditorPostManagerStore } from "@/src/state/editor-post-manager";
import { sanitizeAndEncodeHtml } from "@/src/utils";
import { SectionCard } from "../../../Dashboard/SectionCard";

export const SEOSection = () => {
  return (
    <SectionCard title="SEO">
      <Stack p={4}>
        <Text as="span" fontWeight={500}>
          Featured Image:
        </Text>
        <FeaturedImageCard />
        <SlugInput />
        <SummaryInput />
      </Stack>
    </SectionCard>
  );
};
