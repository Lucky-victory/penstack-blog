import React, {
  createElement,
  KeyboardEvent,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Editor, Range } from "@tiptap/react";

import { IconType } from "react-icons";
import { useState, useEffect } from "react";
import { Box, Button, Text, VStack, useColorModeValue } from "@chakra-ui/react";

export interface CommandListItem {
  title: string;
  icon: IconType;
  command: (props: { editor: Editor; range: Range }) => void;
}
export interface SlashCommandListProps {
  items: CommandListItem[];
  command: (item: CommandListItem) => void;
  clientRect: () => DOMRect;
}

export interface SlashCommandListRef {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

export const SlashCommandList = forwardRef<
  SlashCommandListRef,
  SlashCommandListProps
>(({ items, command }: SlashCommandListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const itemsWithCommand = items.filter((item) => item.command);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp") {
      upHandler();
      return true;
    }

    if (event.key === "ArrowDown") {
      downHandler();
      return true;
    }

    if (event.key === "Enter") {
      enterHandler();
      return true;
    }

    return false;
  };

  useImperativeHandle(ref, () => ({
    onKeyDown,
  }));

  const upHandler = () => {
    setSelectedIndex((selectedIndex + items.length - 1) % items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  const selectItem = (index: number) => {
    const item = itemsWithCommand[index];

    if (item) {
      command(item);
    }
  };

  const borderColor = useColorModeValue("gray.400", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Box
      bg="white"
      border={`1px solid ${borderColor}`}
      borderRadius="md"
      overflow="hidden"
      shadow="md"
    >
      {itemsWithCommand.length ? (
        <VStack spacing={0} align="stretch">
          {itemsWithCommand.map((item, index) => (
            <Button
              key={index}
              onClick={() => selectItem(index)}
              display="flex"
              flexDirection="row"
              gap={2}
              alignItems="center"
              width="full"
              p={2}
              pr={12}
              fontSize="sm"
              color={textColor}
              bg={selectedIndex === index ? "gray.100" : "white"}
              leftIcon={createElement(item.icon)}
              _hover={{ bg: "gray.50" }}
            >
              {item.title}
            </Button>
          ))}
        </VStack>
      ) : (
        <Text p={2} fontSize="sm" color={textColor} textAlign="center">
          No result
        </Text>
      )}
    </Box>
  );
});
SlashCommandList.displayName = "SlashCommandList";
export default SlashCommandList;
