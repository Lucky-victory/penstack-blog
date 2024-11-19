"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Tag,
  Textarea,
  Spinner,
  Stack,
  List,
  ListItem,
  FormLabel,
  FormControl,
  Icon,
  RadioGroup,
  Radio,
  TagCloseButton,
  TagLabel,
  InputRightElement,
  InputGroup,
  Text,
  HStack,
  Switch,
} from "@chakra-ui/react";

import { SectionCard } from "@/src/app/components/Dashboard/SectionCard";

import {
  LuEye,
  LuPin,
  LuPlus,
  LuCheck,
  LuFileText,
  LuType,
  LuMessageSquare,
  LuRadioReceiver,
} from "react-icons/lu";
import { FeaturedImageCard } from "@/src/app/components/TipTapEditor/FeaturedImageCard";
import { PostSelect } from "@/src/types";
import { useCustomEditorContext } from "@/src/context/AppEditor";
import { Editor } from "@tiptap/react";

export const SidebarContent = ({ editor }: { editor: Editor | null }) => {
  const { activePost, isSaving, updateField } = useCustomEditorContext();
  const [showCategoryInput, setShowCategoryInput] = useState<boolean>(false);
  const [isSlugEditable, setIsSlugEditable] = useState<boolean>(false);
  const [tag, setTag] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<{ name: string; id: number }[]>(
    []
  );
  const [tags, setTags] = useState<{ name: string }[]>([]);

  const handleAddCategory = () => {
    const lastCategory = categories[categories.length - 1];
    setCategories((prev) => [
      ...prev,
      { name: category, id: lastCategory?.id ? lastCategory.id + 1 : 1 },
    ]);
    setCategory("");
  };
  const handleAddTag = () => {
    setTags((prev) => [...prev, { name: tag }]);
    setTag("");
  };
  function onDraft() {}
  function onPublish() {}

  function updatePost(key: keyof PostSelect, value: any) {}
  function handleChange(
    evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {}

  const editorMeta = {
    wordCount: editor?.storage?.characterCount?.words() || 0,
    characterCount: editor?.storage?.characterCount?.characters() || 0,
  };

  return (
    <>
      <Stack
        gap={3}
        flexShrink={0}
        maxW={350}
        minW={300}
        width={{ base: "100%" }}
        overflowY={"auto"}
      >
        <SectionCard
          title="Publish"
          header={
            <>
              <HStack>
                {" "}
                {isSaving ? (
                  <Spinner size="xs" />
                ) : (
                  <Stack
                    align={"center"}
                    justify={"center"}
                    w={"14px"}
                    h={"14px"}
                    rounded="full"
                    bg="green.300"
                  >
                    <LuCheck size={12} color="white" />
                  </Stack>
                )}
                <Text as="span" color={isSaving ? "gray.300" : undefined}>
                  {" "}
                  {isSaving ? "Saving..." : "Saved"}
                </Text>
              </HStack>
            </>
          }
          footer={
            <>
              <Button
                size={"sm"}
                flex={1}
                variant={"outline"}
                rounded={"full"}
                onClick={() => {
                  onDraft?.();
                }}
              >
                Save draft
              </Button>
              <Button
                size={"sm"}
                // isDisabled={isSubmitting}
                // isLoading={isSubmitting}
                loadingText={"publishing..."}
                flex={1}
                rounded={"full"}
                onClick={() => {
                  onPublish?.();
                }}
              >
                Publish
              </Button>
            </>
          }
        >
          <Box p={4} pb={0}>
            <Stack as={List} fontSize={14} gap={2}>
              <ListItem>
                <HStack>
                  <Text as={"span"} color="gray.500">
                    <Icon as={LuRadioReceiver} mr={1} />
                    Status:
                  </Text>
                  <Text
                    as={"span"}
                    fontWeight="semibold"
                    textTransform={"capitalize"}
                  >
                    {activePost?.status}
                  </Text>
                </HStack>
              </ListItem>
              <ListItem>
                <HStack>
                  <Text as={"span"} color="gray.500">
                    <Icon as={LuEye} mr={1} />
                    Visibility:
                  </Text>
                  <Text
                    as={"span"}
                    fontWeight="semibold"
                    textTransform={"capitalize"}
                  >
                    {activePost?.visibility}
                  </Text>
                </HStack>
              </ListItem>
              <ListItem>
                <HStack>
                  <Text as={"span"} color="gray.500">
                    <Icon as={LuFileText} mr={1} />
                    Word count:
                  </Text>
                  <Text as={"span"} fontWeight="semibold">
                    {editorMeta.wordCount}
                  </Text>
                </HStack>
              </ListItem>
              <ListItem>
                <HStack>
                  <Text as={"span"} color="gray.500">
                    <Icon as={LuType} mr={1} />
                    Character count:
                  </Text>
                  <Text as={"span"} fontWeight="semibold">
                    {editorMeta.characterCount}
                  </Text>
                </HStack>
              </ListItem>
              <ListItem>
                <HStack>
                  <Text as={"span"} color="gray.500">
                    <Icon as={LuMessageSquare} mr={1} />
                    Allow Comments:
                  </Text>
                  <Switch isChecked={activePost?.allow_comments as boolean} />
                </HStack>
              </ListItem>
              <ListItem>
                <HStack>
                  <Text as={"span"} color="gray.500">
                    <Icon as={LuPin} mr={1} />
                    Pinned:
                  </Text>
                  <Switch
                    isChecked={activePost?.is_sticky as boolean}
                    onChange={(e) => {
                      console.log("sticky check", e.target.checked);

                      updateField("is_sticky", !activePost?.is_sticky, true);
                    }}
                  />
                </HStack>
              </ListItem>
            </Stack>
          </Box>
        </SectionCard>
        <SectionCard title="SEO">
          <Stack p={4}>
            <Text as="span" fontWeight={500}>
              Featured Image:
            </Text>
            <FeaturedImageCard
              onChange={(imageId) => {
                updatePost("featured_image_id", imageId);
              }}
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
                  rounded={"full"}
                  pr={1}
                />
                {!isSlugEditable && (
                  <InputRightElement bg={"blue.50"} roundedRight={"full"}>
                    <Button
                      size={"sm"}
                      variant={"ghost"}
                      fontWeight={500}
                      fontSize={"13px"}
                      roundedRight={"full"}
                      onClick={() => setIsSlugEditable(true)}
                    >
                      Edit
                    </Button>
                  </InputRightElement>
                )}
              </InputGroup>{" "}
            </FormControl>

            <FormControl>
              <FormLabel>Summary:</FormLabel>
              <Textarea
                placeholder="summary"
                name="summary"
                value={activePost?.summary || ""}
                onChange={handleChange}
                maxH={150}
                rounded={"lg"}
              />
            </FormControl>
          </Stack>
        </SectionCard>
        <SectionCard title="Categories">
          <Box p={4}>
            <Stack as={RadioGroup} gap={2} name="category" defaultValue={""}>
              {categories.map((category) => (
                <Radio
                  key={category.id}
                  variant="solid"
                  value={category.id + ""}
                >
                  {category.name}
                </Radio>
              ))}
              {showCategoryInput && (
                <HStack mt={2} align={"center"}>
                  <Input
                    autoComplete="off"
                    placeholder="Enter category name"
                    size={"sm"}
                    rounded={"full"}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddCategory();
                      }
                    }}
                  />
                  <Button
                    isDisabled={!category}
                    onClick={handleAddCategory}
                    size={"sm"}
                    variant={"outline"}
                    fontWeight={500}
                    fontSize={"13px"}
                    rounded={"full"}
                  >
                    Add
                  </Button>
                </HStack>
              )}
              <Button
                rounded={"full"}
                alignItems={"center"}
                alignSelf="start"
                gap={2}
                mt={4}
                onClick={() => setShowCategoryInput(true)}
                size={"xs"}
                variant={"ghost"}
              >
                <Icon size={24} as={LuPlus} />
                <Text as="span"> Add new category</Text>
              </Button>
            </Stack>{" "}
          </Box>
        </SectionCard>
        <SectionCard title="Tags">
          <HStack p={4} pb={0} gap={2} wrap={"wrap"}>
            {tags.map((tag, index) => (
              <Tag rounded={"full"} key={index} variant="solid">
                <TagLabel>#{tag?.name}</TagLabel>{" "}
                <TagCloseButton
                  onClick={() =>
                    setTags(tags.filter((t) => t.name !== tag.name))
                  }
                ></TagCloseButton>
              </Tag>
            ))}
          </HStack>

          <Box p={4}>
            <HStack align={"center"}>
              <Input
                placeholder="Enter tag name"
                size={"sm"}
                value={tag}
                rounded={"full"}
                onChange={(e) => setTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddTag();
                  }
                }}
              />
              <Button
                rounded={"full"}
                isDisabled={!tag}
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
      </Stack>
    </>
  );
};
SidebarContent.displayName = "SidebarContent";
