"use client";
import { useAuth } from "@/src/hooks/useAuth";
import {
  Avatar,
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
} from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { ReactNode } from "react";
import { LuChevronDown } from "react-icons/lu";

export default function DashHeader({
  children,
  isMinimized = false,
  showUserAvatar = false,
  ...rest
}: {
  children?: ReactNode;
  isMinimized?: boolean;
  showUserAvatar?: boolean;
  [key: string]: any;
}) {
  const bg = useColorModeValue("white", "gray.900");
  const { user } = useAuth();
  return (
    <Flex
      // ml={{ base: 0, md: isMinimized ? "var(--dash-sidebar-mini-w)" : "var(--dash-sidebar-w)" }}
      px={{ base: 4, md: 5 }}
      py={2}
      minH="12"
      maxH={"var(--dash-header-h)"}
      flexShrink={0}
      pos={"sticky"}
      top={0}
      zIndex={10}
      alignItems="center"
      bg={bg}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="space-between"
      {...rest}
    >
      <HStack justify={"space-between"} w={"full"}>
        <HStack ml={"auto"}>
          <Menu>
            <MenuButton
              as={Button}
              leftIcon={
                <Avatar size={"sm"} name={user?.name} src={user?.avatar} />
              }
              rightIcon={<LuChevronDown />}
              variant={"outline"}
              rounded={"full"}
            >
              Hi, {user?.name?.split(" ")[0]}
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    signOut();
                  }}
                >
                  Logout
                </Button>
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>
    </Flex>
  );
}
