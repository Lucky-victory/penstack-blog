"use client";
import {
  HStack,
  IconButton,
  useDisclosure,
  Input,
  Portal,
  useColorModeValue,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  Heading,
  Box,
} from "@chakra-ui/react";

import { useCurrentEditor } from "@tiptap/react";
import { useFormik } from "formik";
import isEmpty from "just-is-empty";
import React, { FormEvent, useRef } from "react";

import { LuCornerDownLeft, LuLink, LuRedo2, LuUndo2 } from "react-icons/lu";
import EditorActionsDropdown from "../EditorActionsDropdown";
import { filterEditorActions } from "@/src/lib/editor-actions";
import Medias from "../../Dashboard/Medias";
import { MediaResponse } from "@/src/types";
import { MediaInsert } from "./MediaInsert";

export const MenuBar = () => {
  const { editor } = useCurrentEditor();
  const {
    isOpen: isMediaModalOpen,
    onClose: onMediaModalClose,
    onOpen: onMediaModalOpen,
  } = useDisclosure();
  const initialFocusRef = useRef<any>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const btnStyles = {
    size: "sm",
    fontSize: "medium",
  };
  const formik = useFormik({
    initialValues: {
      content: "",
    },
    onSubmit: (values, actions) => {
      const content = values.content;
      const previousUrl = editor?.getAttributes("link").href;
      actions.setFieldValue("content", previousUrl);
      const url = content;

      if (url === null) {
        return;
      }

      // empty
      if (isEmpty(url)) {
        editor?.chain().focus().extendMarkRange("link").unsetMark("link").run();

        return;
      }

      // update link
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setMark("link", { href: url })
        .run();
      onClose();
    },
  });

  const borderColorValue = useColorModeValue("gray.300", "gray.800");
  const bgColorValue = useColorModeValue("white", "gray.800");
  const borderBottomColorValue = useColorModeValue("gray.300", "gray.900");

  if (!editor) {
    return <></>;
  }

  const nonHeadingOrParagraphActions = filterEditorActions(
    [
      "Heading 1",
      "Heading 2",
      "Heading 3",
      "Heading 4",
      "Heading 5",
      "Heading 6",
      "Paragraph",
    ],
    false
  );

  return (
    <HStack
      wrap={"wrap"}
      gap={"6px"}
      pos={"sticky"}
      top={0}
      borderBottom={"1px"}
      borderBottomColor={borderBottomColorValue}
      borderColor={borderColorValue}
      bg={bgColorValue}
      zIndex={2}
      p={3}
    >
      <EditorActionsDropdown />
      {nonHeadingOrParagraphActions.map((item, index) =>
        item.label === "Insert Media" ? (
          <Box key={index}>
            <Tooltip label={item.label} hasArrow placement="top" rounded={"lg"}>
              <IconButton
                aria-label={item.label}
                {...btnStyles}
                variant={editor.isActive("img") ? "solid" : "ghost"}
                onClick={() => item.command({ open: onMediaModalOpen })}
              >
                <item.icon size={20} />
              </IconButton>
            </Tooltip>
            <MediaInsert editor={editor} isOpen={isMediaModalOpen} onClose={onMediaModalClose}/>
          </Box>
        ) : (
          <Tooltip
            key={index}
            label={item.label}
            hasArrow
            placement="top"
            rounded={"lg"}
          >
            <IconButton
              aria-label={item.label}
              {...btnStyles}
              onClick={() => {
                item?.command({ editor });
              }}
              variant={item.active(editor) ? "solid" : "ghost"}
            >
              <item.icon size={20} />
            </IconButton>
          </Tooltip>
        )
      )}
      <Popover
        onClose={onClose}
        onOpen={onOpen}
        isOpen={isOpen}
        initialFocusRef={initialFocusRef}
      >
        <PopoverTrigger>
          <Tooltip label="Insert Link" hasArrow placement="top" rounded={"lg"}>
            <IconButton
              aria-label=""
              {...btnStyles}
              variant={editor.isActive("link") ? "solid" : "ghost"}
            >
              <LuLink size={20} />
            </IconButton>
          </Tooltip>
        </PopoverTrigger>
        <Portal>
          <PopoverContent zIndex={10000} py={4}>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader fontWeight="bold" border="0">
              Enter URL:
            </PopoverHeader>
            <PopoverBody>
              <HStack
                as={"form"}
                onSubmit={(e) => {
                  e.preventDefault();
                  formik.handleSubmit(
                    e as unknown as FormEvent<HTMLFormElement>
                  );
                }}
              >
                <Input
                  name="content"
                  rounded={"lg"}
                  autoComplete="off"
                  value={formik.values.content}
                  ref={initialFocusRef}
                  onChange={formik.handleChange}
                  placeholder="https://example.com"
                  size={"sm"}
                />
                <IconButton aria-label="" variant={"ghost"} type="submit">
                  <LuCornerDownLeft />
                </IconButton>
              </HStack>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>

      <Tooltip label="Undo" hasArrow placement="top" rounded={"lg"}>
        <IconButton
          aria-label=""
          {...btnStyles}
          isDisabled={!editor.can().undo()}
          variant={"ghost"}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <LuUndo2 size={20} />
        </IconButton>
      </Tooltip>
      <Tooltip label="Redo" hasArrow placement="top" rounded={"lg"}>
        <IconButton
          aria-label=""
          {...btnStyles}
          isDisabled={!editor.can().redo()}
          variant={"ghost"}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <LuRedo2 size={20} />
        </IconButton>
      </Tooltip>
    </HStack>
  );
};
