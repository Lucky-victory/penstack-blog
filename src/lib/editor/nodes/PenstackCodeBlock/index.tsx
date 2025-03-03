import {
  Box,
  Button,
  DarkMode,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { NodeViewProps } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { memo, useMemo } from "react";
import { LuChevronDown } from "react-icons/lu";

import { FixedSizeList } from "react-window";

interface PenstackCodeblockComponentProps extends NodeViewProps {}

export const PenstackCodeblockComponent: React.FC<
  PenstackCodeblockComponentProps
> = ({
  updateAttributes,
  node: {
    attrs: { language: defaultLanguage },
  },
  extension,
}) => {
  const languages = extension.options.lowlight.listLanguages();
  const heights = useMemo(
    () => ({
      itemHeight: 30,
      listHeight: 280,
    }),
    []
  );
  const LanguageRow = memo(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const item = languages[index];
      const hoverBg = useColorModeValue("brand.100", "brand.500");
      const hoverColor = useColorModeValue("black", "white");

      return (
        <MenuItem
          value={item}
          rounded="full"
          bg={defaultLanguage === item ? "brand.500" : ""}
          color={defaultLanguage === item ? "white" : ""}
          _hover={{
            bg: hoverBg,
            color: hoverColor,
          }}
          onClick={() => updateAttributes({ language: item })}
          style={{ ...style, marginTop: "8px" }}
        >
          {item}
        </MenuItem>
      );
    }
  );
  LanguageRow.displayName = "LanguageRow";
  return (
    <Stack
      as={NodeViewWrapper}
      className="penstack-code-block"
      spellCheck="false"
    >
      <HStack justify={"flex-end"} p={0}>
        <Menu>
          {({ isOpen }) => (
            <>
              <DarkMode>
                <MenuButton
                  variant={"ghost"}
                  colorScheme="gray"
                  size={"xs"}
                  as={Button}
                  rightIcon={
                    <Icon
                      as={LuChevronDown}
                      transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
                    />
                  }
                >
                  {defaultLanguage || "auto"}
                </MenuButton>
              </DarkMode>
              <MenuList maxH={heights.listHeight} px={2}>
                <FixedSizeList
                  height={heights.listHeight}
                  itemCount={languages?.length}
                  itemSize={heights.itemHeight}
                  width="100%"
                >
                  {LanguageRow}
                </FixedSizeList>
              </MenuList>
            </>
          )}
        </Menu>
      </HStack>
      <Box as="pre">
        <NodeViewContent as="code" />
      </Box>
    </Stack>
  );
};
export default memo(PenstackCodeblockComponent);
