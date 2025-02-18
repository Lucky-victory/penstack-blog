"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Spinner,
  Stack,
  List,
  ListItem,
  Icon,
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
  LuMessageSquare,
  LuRadioReceiver,
  LuClock,
} from "react-icons/lu";
import { useRouter } from "next/navigation";
import { PermissionGuard } from "../../PermissionGuard";
import { format } from "date-fns";
import { CalendarPicker } from "../CalendarPicker";
import { CategorySection } from "./CategorySection";
import { TagsSection } from "./TagsSection";
import { PostInsert } from "@/src/types";
import { SEOSection } from "./SEOSection";
import { ActionButtons } from "./components/ActionButtons";
import { MetricsItem } from "./components/MetricsItem";
import { useEditorPostManagerStore } from "@/src/state/editor-post-manager";

export const SidebarContent = () => {
  const isSaving = useEditorPostManagerStore((state) => state.isSaving);
  const updateField = useEditorPostManagerStore((state) => state.updateField);
  const status = useEditorPostManagerStore((state) => state.activePost?.status);
  const scheduledAt = useEditorPostManagerStore(
    (state) => state.activePost?.scheduled_at
  );
  const visibility = useEditorPostManagerStore(
    (state) => state.activePost?.visibility
  );
  const isSticky = useEditorPostManagerStore(
    (state) => state.activePost?.is_sticky
  );
  const allowComments = useEditorPostManagerStore(
    (state) => state.activePost?.allow_comments
  );
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const router = useRouter();
  const { isOpen, onClose, onToggle } = useDisclosure();
  const toast = useToast({
    duration: 3000,
    status: "success",
    position: "top",
  });

  function onDraft() {
    updateField("status", "draft", undefined, () => {
      toast({
        title: "Draft saved successfully",
      });
    });
  }
  function onPublish() {
    setIsPublishing(true);
    updateField("status", "published", undefined, () => {
      toast({
        title: "Post published successfully",
      });
      setTimeout(() => {
        router.push("/dashboard/posts");
        setIsPublishing(false);
      }, 2000);
    });
  }
  function onDelete() {
    updateField("status", "deleted", undefined, () => {
      toast({
        title: "Post deleted successfully",
      });
      setTimeout(() => {
        router.replace("/dashboard/posts");
      }, 2000);
    });
  }
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
            <ActionButtons
              onDelete={onDelete}
              onDraft={onDraft}
              onPublish={onPublish}
              isPublishing={isPublishing}
            />
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
                    {status}
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
                      {visibility}
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
                        {scheduledAt ? (
                          <>
                            <Text fontSize={"small"}>
                              {format(
                                new Date(scheduledAt as Date),
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
                        scheduledAt ? new Date(scheduledAt as Date) : undefined
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
              <MetricsItem />
              <PermissionGuard requiredPermission="posts:publish">
                <ListItem>
                  <HStack>
                    <Text as={"span"} color="gray.500">
                      <Icon as={LuMessageSquare} mr={1} />
                      Allow Comments:
                    </Text>
                    <Switch
                      isChecked={allowComments as boolean}
                      onChange={() => {
                        updateField("allow_comments", !allowComments);
                      }}
                    />
                  </HStack>
                </ListItem>
              </PermissionGuard>
              <PermissionGuard requiredPermission="posts:publish">
                <ListItem>
                  <HStack>
                    <Text as={"span"} color="gray.500">
                      <Icon as={LuPin} mr={1} />
                      Pinned:
                    </Text>
                    <Switch
                      isChecked={isSticky as boolean}
                      onChange={() => {
                        updateField("is_sticky", !isSticky);
                      }}
                    />
                  </HStack>
                </ListItem>
              </PermissionGuard>
            </Stack>
          </Box>
        </SectionCard>
        <SectionCard title="SEO">
          <SEOSection updateField={updateField} />
        </SectionCard>
        <CategorySection />
        <TagsSection />
      </Stack>
    </>
  );
};
SidebarContent.displayName = "SidebarContent";
