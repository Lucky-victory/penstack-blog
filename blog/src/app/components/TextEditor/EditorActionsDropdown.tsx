import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@/src/app/components/ui/Menu";
import { Button } from "@/src/app/components/ui/Button";
import { Editor, useCurrentEditor } from "@tiptap/react";
import {
  HStack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { LuChevronsUpDown } from "react-icons/lu";
import { filterEditorActions } from "@/src/lib/editor-actions";
import { EditorActionItem } from "@/src/types";
import React from "react";

import { MediaInsert } from "./MenuBar/MediaInsert";

export default function EditorActionsDropdown() {
  const iconColorValue = useColorModeValue("gray.500", "gray.200");
  const activeTextColorValue = useColorModeValue("white", "white");
  const dropdownActions = filterEditorActions([
    "Paragraph",
    "Heading 1",
    "Heading 2",
    "Heading 3",
    "Bullet List",
    "Ordered List",
    "Insert Media",
  ]);
  const { editor: _editor } = useCurrentEditor();
  const editor = _editor as Editor;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const getActiveActionItem = () => {
    const activeActionItem = dropdownActions.find((item) =>
      item.active(editor)
    );
    if (activeActionItem) {
      return activeActionItem as EditorActionItem;
    }
    return dropdownActions[0] as EditorActionItem;
  };
  return (
    <>
      <Menu
        isLazy
        onClose={() => {
          editor?.commands.focus();
        }}
      >
        <MenuButton
          variant={"outline"}
          as={Button}
          size="sm"
          fontSize="medium"
          display={"flex"}
        >
          <HStack spacing={1}>
            {getActiveActionItem() &&
              React.createElement(getActiveActionItem().icon, {
                size: 20,
                color: iconColorValue,
              })}
            <LuChevronsUpDown size={16} />
          </HStack>
        </MenuButton>
        <MenuList
          rounded={"xl"}
          px={2}
          gap={1}
          display={"flex"}
          flexDir={"column"}
        >
          {dropdownActions?.map((item, index) =>
            item.label === "Insert Media" ? (
              <>
                <MenuItem
                  onClick={() => item?.command?.({ editor, open: onOpen })}
                  color={
                    item?.active(editor) ? activeTextColorValue : undefined
                  }
                  bg={item?.active(editor) ? "blue.500" : undefined}
                  key={index}
                  icon={
                    item.icon && React.createElement(item.icon, { size: 20 })
                  }
                  rounded={"xl"}
                >
                  <Text as={"span"} fontSize={"16px"} fontWeight={500}>
                    {item.label}
                  </Text>
                </MenuItem>
              </>
            ) : (
              <MenuItem
                onClick={() => item?.command?.({ editor })}
                color={item?.active(editor) ? activeTextColorValue : undefined}
                bg={item?.active(editor) ? "blue.500" : undefined}
                key={index}
                icon={item.icon && React.createElement(item.icon, { size: 20 })}
                rounded={"xl"}
              >
                <Text as={"span"} fontSize={"16px"} fontWeight={500}>
                  {item.label}
                </Text>
              </MenuItem>
            )
          )}
        </MenuList>
      </Menu>
      <MediaInsert editor={editor} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
