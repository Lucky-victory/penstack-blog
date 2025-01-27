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

interface SEOSectionProps {
  activePost: EDITOR_CONTEXT_STATE["activePost"];
  updateField: (field: keyof PostInsert, value: any) => void;
  isSlugEditable: boolean;
  setIsSlugEditable: (value: boolean) => void;
  handleChange: (
    evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export const SEOSection = ({
  activePost,
  updateField,
  isSlugEditable,
  setIsSlugEditable,
  handleChange,
}: SEOSectionProps) => (
  <Stack p={4}>
    <Text as="span" fontWeight={500}>
      Featured Image:
    </Text>
    <FeaturedImageCard
      onChange={(imageId) => updateField("featured_image_id", imageId)}
      image={activePost?.featured_image || null}
    />
    <FormControl>
      <FormLabel>URL friendly title:</FormLabel>
      <InputGroup>
        <Input
          placeholder="Slug"
          name="slug"
          value={activePost?.slug}
          autoComplete="off"
          onChange={handleChange}
          isDisabled={!isSlugEditable}
          onBlur={() => setIsSlugEditable(false)}
          rounded="xl"
          pr={1}
        />
        {!isSlugEditable && (
          <InputRightElement roundedRight="xl">
            <Button
              size="sm"
              variant="ghost"
              fontWeight={500}
              onClick={() => setIsSlugEditable(true)}
            >
              Edit
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
    </FormControl>
    <FormControl>
      <FormLabel>Summary:</FormLabel>
      <Textarea
        placeholder="summary"
        name="summary"
        value={activePost?.summary || ""}
        onChange={handleChange}
        maxH={150}
        rounded="lg"
      />
    </FormControl>
  </Stack>
);
