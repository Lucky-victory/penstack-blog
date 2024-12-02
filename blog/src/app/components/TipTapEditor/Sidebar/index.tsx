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
  TagCloseButton,
  TagLabel,
  InputRightElement,
  InputGroup,
  Text,
  HStack,
  Switch,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";

import { SectionCard } from "@/src/app/components/Dashboard/SectionCard";

import {
  LuEye,
  LuPin,
  LuCheck,
  LuFileText,
  LuType,
  LuMessageSquare,
  LuRadioReceiver,
  LuClock,
} from "react-icons/lu";
import { FeaturedImageCard } from "@/src/app/components/TipTapEditor/FeaturedImageCard";
import { useCustomEditorContext } from "@/src/context/AppEditor";
import { Editor } from "@tiptap/react";
import { useRouter } from "next/navigation";
import { PermissionGuard } from "../../PermissionGuard";
import { format } from "date-fns";
import { CalendarPicker } from "../CalendarPicker";
import { CategorySection } from "./CategorySection";

export const SidebarContent = ({ editor }: { editor: Editor | null }) => {
  const { activePost, isSaving, updateField } = useCustomEditorContext();
  const [isSlugEditable, setIsSlugEditable] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const router = useRouter();
  const { isOpen, onClose, onToggle } = useDisclosure();
  const toast = useToast({
    duration: 3000,
    status: "success",
    position: "top",
  });

  function onDraft() {
    updateField("status", "draft");
    toast({
      title: "Draft saved successfully",
    });
  }
  function onPublish() {
    setIsPublishing(true);
    updateField("status", "published");
    toast({
      title: "Post published successfully",
    });
    setTimeout(() => {
      router.push("/dashboard/posts");
      setIsPublishing(false);
    }, 2000);
  }
  function onDelete() {
    updateField("status", "deleted");
    toast({
      title: "Post deleted successfully",
    });
    setTimeout(() => {
      router.replace("/dashboard/posts");
    }, 2000);
  }
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
        maxW={360}
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
                    bg="green.400"
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
              <PermissionGuard requiredPermission={"posts:delete"}>
                <Button
                  size={"sm"}
                  flex={1}
                  rounded={"full"}
                  variant={"ghost"}
                  colorScheme="red"
                  color="red.500"
                  bg="red.100"
                  onClick={() => {
                    onDelete?.();
                  }}
                >
                  Delete
                </Button>
              </PermissionGuard>
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
              <PermissionGuard requiredPermission={"posts:publish"}>
                <Button
                  size={"sm"}
                  isDisabled={isPublishing}
                  isLoading={isPublishing}
                  loadingText={"Publishing..."}
                  flex={1}
                  rounded={"full"}
                  onClick={() => {
                    onPublish?.();
                  }}
                >
                  Publish
                </Button>
              </PermissionGuard>
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
                <HStack justify={"space-between"}>
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
                  <Button variant={"ghost"} size={"xs"}>
                    Edit
                  </Button>
                </HStack>
              </ListItem>
              <PermissionGuard requiredPermission={"posts:publish"}>
                <ListItem>
                  <HStack justify={"space-between"}>
                    <HStack>
                      <Text as={"span"} color="gray.500">
                        <Icon as={LuClock} mr={1} />
                        Schedule:
                      </Text>
                      <Text
                        as={"span"}
                        fontWeight="semibold"
                        textTransform={"capitalize"}
                      >
                        {activePost?.scheduled_at ? (
                          <>
                            <Text fontSize={"small"}>
                              {format(
                                new Date(activePost?.scheduled_at as Date),
                                "MMM d, yyyy hh:mm a"
                              )}
                            </Text>
                          </>
                        ) : (
                          "Off"
                        )}
                      </Text>
                    </HStack>
                    <CalendarPicker
                      defaultValue={
                        activePost?.scheduled_at
                          ? new Date(activePost.scheduled_at as Date)
                          : undefined
                      }
                      isOpen={isOpen}
                      onClose={onClose}
                      trigger={
                        <Button
                          variant={"ghost"}
                          size={"xs"}
                          onClick={() => onToggle()}
                        >
                          Edit
                        </Button>
                      }
                    />
                  </HStack>
                </ListItem>
              </PermissionGuard>
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
                  <Switch
                    isChecked={activePost?.allow_comments as boolean}
                    onChange={() => {
                      updateField(
                        "allow_comments",
                        !activePost?.allow_comments,
                        true
                      );
                    }}
                  />
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
                    onChange={() => {
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
                updateField("featured_image_id", imageId);
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
        <CategorySection />
      </Stack>
    </>
  );
};
SidebarContent.displayName = "SidebarContent";
