import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Hide,
  IconButton,
  Show,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import DashHeader from "../Dashboard/Header";
import { LuSettings } from "react-icons/lu";
import { Editor } from "@tiptap/react";
import { SidebarContent } from "./Sidebar";

export default function EditorHeader({ editor }: { editor: Editor | null }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <DashHeader pos="sticky" top={0} zIndex={10}>
        <Stack gap={0}>
          <Text fontSize="2xl" fontWeight={600} as="span">
            Create Post
          </Text>
          <Text as="span" fontSize="sm" color="gray.500">
            Last updated:{" "}
            {/* {lastUpdate ? formatDate(new Date(lastUpdate)) : "Not saved yet"} */}
          </Text>
        </Stack>
        <Hide below="md">
          <Button
            variant="outline"
            gap={2}
            size="sm"
            rounded="full"
            onClick={onOpen}
            display={{ base: "flex", lg: "none" }}
          >
            <LuSettings />
            <Text>Post Settings</Text>
          </Button>
        </Hide>
        <Show below="md">
          <IconButton
            icon={<LuSettings />}
            rounded={"full"}
            variant={"outline"}
            aria-label="Post Settings"
            onClick={onOpen}
          ></IconButton>
        </Show>
      </DashHeader>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Post Settings</DrawerHeader>
          <DrawerBody px={2}>
            <SidebarContent editor={editor} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
