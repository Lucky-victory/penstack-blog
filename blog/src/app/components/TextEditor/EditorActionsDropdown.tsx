import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@/src/app/components/ui/Menu";
import { Button } from "@/src/app/components/ui/Button";
import {
  Divider,
  HStack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { LuChevronsUpDown } from "react-icons/lu";
import { filterEditorActions } from "@/src/lib/editor-actions";
import React, { useEffect, useMemo, useState } from "react";
import { MediaInsert } from "./MenuBar/MediaInsert";
import { useCustomEditorContext } from "@/src/context/AppEditor";
import AccessibleDropdown from "../AccessibleDropdown";
import { EditorActionItem } from "@/src/types";
import { Editor } from "@tiptap/react";

export default function EditorActionsDropdown({
  editor,
}: {
  editor: Editor | null;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dropdownActions = useMemo(
    () =>
      filterEditorActions([
        "Paragraph",
        "Heading 1",
        "Heading 2",
        "Heading 3",
        "Bullet List",
        "Ordered List",
        "Insert Media",
      ]),
    []
  );

  if (!editor) return null;

  return (
    <>
      {/* <Menu
        onClose={() => {
          editor?.commands.focus();
        }}
      >
        <MenuButton
          variant="ghost"
          as={Button}
          size="sm"
          fontSize="medium"
          display="flex"
        >
          <HStack spacing={1}>
            {React.createElement(getActiveActionItem.icon, {
              size: 20,
              color: iconColorValue,
            })}
            <LuChevronsUpDown size={16} />
          </HStack>
        </MenuButton>
        <MenuList rounded="xl" px={2} gap={1} display="flex" flexDir="column">
          {dropdownActions?.map((item) => (
            <MenuItem
              key={item.label}
              onClick={() => {
                if (item.label === "Insert Media") {
                  item.command?.({ editor, open: onOpen });
                } else {
                  item.command?.({ editor });
                }
              }}
              color={item?.active(editor) ? activeTextColorValue : undefined}
              bg={item?.active(editor) ? "blue.500" : undefined}
              icon={React.createElement(item.icon, { size: 20 })}
              rounded="xl"
            >
              <Text as="span" fontSize="16px" fontWeight={500}>
                {item.label}
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu> */}
      <AccessibleDropdown
        options={dropdownActions}
        onOpen={onOpen}
        editor={editor}
        defaultValue={dropdownActions[0]}
      />
      <Divider orientation="vertical" h={10} />

      <MediaInsert editor={editor} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
