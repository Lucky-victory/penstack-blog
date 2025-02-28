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
import { PublishMetadata } from "./components/PublishMetadata";

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

  const router = useRouter();
  const { isOpen, onClose, onToggle } = useDisclosure();

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
          footer={<ActionButtons />}
        >
         
            <PublishMetadata />
         
        </SectionCard>

        <SEOSection />

        <CategorySection />
        <TagsSection />
      </Stack>
    </>
  );
};
SidebarContent.displayName = "SidebarContent";
