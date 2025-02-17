import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import { NodeViewProps } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import React from "react";
import { memo, useEffect, useMemo, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import {
  LuInfo,
  LuAlertCircle,
  LuCheckCircle,
  LuAlertTriangle,
} from "react-icons/lu";

interface PenstackBlockquoteRendererProps {
  variant: "plain" | "warning" | "info" | "success" | "danger";
  isEditing?: boolean;
  node: Partial<NodeViewProps["node"]>;
  updateAttributes?: (attrs: Record<string, any>) => void;
}
const PenstackBlockquoteRenderer = ({
  isEditing = true,
  variant,
  node,
  updateAttributes,
}: PenstackBlockquoteRendererProps) => {
  const [selectedVariant, setSelectedVariant] = useState<
    PenstackBlockquoteRendererProps["variant"]
  >(variant || "plain");
  const blockquoteVariants = useMemo(
    () => ["plain", "warning", "info", "success", "danger"] as const,
    []
  );
  const blockquoteStyles = {
    plain: {
      bg: "gray.100",
      icon: null,
    },
    warning: {
      bg: "orange.50",
      icon: LuAlertTriangle,
      iconColor: "orange.500",
    },
    info: {
      bg: "blue.50",
      icon: LuInfo,
      iconColor: "blue.500",
    },
    success: {
      bg: "green.50",
      icon: LuCheckCircle,
      iconColor: "green.500",
    },
    danger: {
      bg: "red.50",
      icon: LuAlertCircle,
      iconColor: "red.500",
    },
  };

  const blockquote = (
    <Box
      as="blockquote"
      p={4}
      my={isEditing ? 0 : 4}
      rounded={"lg"}
      bg={blockquoteStyles[selectedVariant].bg}
    >
      <HStack align="flex-start" spacing={3}>
        {blockquoteStyles[selectedVariant].icon && (
          <Box color={blockquoteStyles[selectedVariant].iconColor} mt={1}>
            {React.createElement(blockquoteStyles[selectedVariant].icon, {
              size: 20,
            })}
          </Box>
        )}
        <Box flex={1}>
          {isEditing ? <NodeViewContent /> : node?.textContent}
        </Box>
      </HStack>
    </Box>
  );
  return (
    <>
      {isEditing ? (
        <>
          <Stack>
            <HStack justify={"flex-end"} contentEditable={false}>
              <Menu>
                <MenuButton
                  variant={"ghost"}
                  textTransform={"capitalize"}
                  as={Button}
                  size={"sm"}
                  rightIcon={<LuChevronDown />}
                >
                  {selectedVariant}
                </MenuButton>
                <MenuList>
                  {blockquoteVariants.map((variant) => (
                    <MenuItem
                      key={variant}
                      onClick={() => {
                        updateAttributes?.({
                          variant,
                        });
                        setSelectedVariant(variant);
                      }}
                    >
                      {variant}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </HStack>
            {blockquote}
          </Stack>
        </>
      ) : (
        blockquote
      )}
    </>
  );
};
export default memo(PenstackBlockquoteRenderer);
