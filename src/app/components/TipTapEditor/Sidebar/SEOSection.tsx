import { Stack } from "@chakra-ui/react";
import { SectionCard } from "../../Dashboard/SectionCard";
import { SlugInput } from "./components/SlugInput";
import { SummaryInput } from "./components/SummaryInput";
import { FeaturedImageSection } from "./components/FeaturedImageSection";
import { SlugInputProps } from "./types";

// Extract SEO section
export const SEOSection = ({
  activePost,
  isSlugEditable,
  handleChange,
  setIsSlugEditable,
}: SlugInputProps) => {
  return (
    <SectionCard title="SEO">
      <Stack p={4}>
        <FeaturedImageSection activePost={activePost} />
        <SlugInput
          activePost={activePost}
          isSlugEditable={isSlugEditable}
          handleChange={handleChange}
          setIsSlugEditable={setIsSlugEditable}
        />
        <SummaryInput activePost={activePost} handleChange={handleChange} />
      </Stack>
    </SectionCard>
  );
};
