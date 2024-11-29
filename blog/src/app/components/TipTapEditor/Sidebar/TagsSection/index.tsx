import {
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Box,
  Input,
  Button,
} from "@chakra-ui/react";
import { SectionCard } from "../../../Dashboard/SectionCard";
import { useState } from "react";
import axios from "axios";
import slugify from "slugify";

export const TagsSection = () => {
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState<{ name: string }[]>([]);
  const handleAddTag = async () => {
    try {
      setIsCreating(true);

      await axios.post("/api/categories", {
        name: newTag,
        slug: slugify(newTag),
      });
      setNewTag("");
      // await refetch();
    } catch (error) {
      console.log("Error adding category", error);
    } finally {
      setIsCreating(false);
    }

    setNewTag("");
  };
  return (
    <SectionCard title="Tags">
      <HStack p={4} pb={0} gap={2} wrap={"wrap"}>
        {tags.map((tag, index) => (
          <Tag rounded={"full"} key={index} variant="solid">
            <TagLabel>#{tag?.name}</TagLabel>{" "}
            <TagCloseButton
              onClick={() => setTags(tags.filter((t) => t.name !== tag.name))}
            ></TagCloseButton>
          </Tag>
        ))}
      </HStack>

      <Box p={4}>
        <HStack align={"center"}>
          <Input
            placeholder="Enter tag name"
            size={"sm"}
            value={newTag}
            rounded={"full"}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTag();
              }
            }}
          />
          <Button
            rounded={"full"}
            isDisabled={!newTag}
            onClick={handleAddTag}
            size={"sm"}
            variant={"outline"}
            fontWeight={500}
            fontSize={"13px"}
          >
            Add
          </Button>
        </HStack>{" "}
      </Box>
    </SectionCard>
  );
};
