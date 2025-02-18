import {
  Box,
  Button,
  HStack,
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
      itemHeight: 35,
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
  return (
    <Stack
      as={NodeViewWrapper}
      className="penstack-code-block"
      spellCheck="false"
      maxH={"auto!important"}
    >
      <HStack justify={"flex-end"}>
        <Menu isLazy>
          <MenuButton
            variant={"ghost"}
            size={"xs"}
            as={Button}
            rightIcon={<LuChevronDown />}
          >
            {defaultLanguage || "auto"}
          </MenuButton>
          <MenuList maxH={heights.listHeight}>
            <FixedSizeList
              height={heights.listHeight}
              itemCount={languages?.length}
              itemSize={heights.itemHeight}
              width="100%"
            >
              {LanguageRow}
            </FixedSizeList>
          </MenuList>
        </Menu>
      </HStack>
      <Box as="pre">
        <NodeViewContent as="code" />
      </Box>
    </Stack>
  );
};
export default memo(PenstackCodeblockComponent);
