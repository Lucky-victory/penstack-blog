"use client";
import {
  Box,
  Flex,
  VStack,
  Text,
  Icon,
  useColorModeValue,
  Tooltip,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useDisclosure,
  PopoverArrow,
  Portal,
  Stack,
  HStack,
  Divider,
  Image,
  IconButton,
} from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { Link } from "@chakra-ui/next-js";
import { useState, useEffect } from "react";
import { ReactNode, ElementType } from "react";
import {
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
  LuFileImage,
  LuFileStack,
  LuHome,
  LuMail,
  LuSettings,
  LuUsers,
} from "react-icons/lu";
import { NavItem, navPermissionMapping, TPermissions } from "@/src/types";
import { PermissionGuard } from "../../PermissionGuard";
import { LightDarkModeSwitch } from "../../LightDarkModeSwitch";
import { UserInfoComp } from "../UserInfoComp";
import { useSiteConfig } from "@/src/hooks/useSiteConfig";
import { AppLogo } from "../../AppLogoAndName/AppLogo";
import { SidebarNavItem } from "./NavItem";
import { NavItemWithChildren } from "./NavItemWithDropdown";
import { AppLogoAndName } from "../../AppLogoAndName";

export const navItems: NavItem[] = [
  {
    icon: LuHome,
    label: "Overview",
    href: "/dashboard/overview",
    permission: navPermissionMapping.VIEW_DASHBOARD,
  },
  {
    icon: LuFileStack,
    label: "Posts",
    href: "/dashboard/posts",
    permission: navPermissionMapping.VIEW_POSTS,
    children: [
      {
        label: "All Posts",
        href: "/dashboard/posts",
        permission: navPermissionMapping.VIEW_POSTS,
      },
      {
        label: "New Post",
        href: "/dashboard/posts/new",
        permission: navPermissionMapping.CREATE_POST,
      },
    ],
  },
  {
    icon: LuUsers,
    label: "Users",
    href: "/dashboard/users",
    permission: navPermissionMapping.VIEW_USERS,
  },
  {
    icon: LuFileImage,
    label: "Media",
    href: "/dashboard/media",
    permission: navPermissionMapping.VIEW_MEDIA,
  },
  {
    icon: LuMail,
    label: "Newsletter",
    href: "/dashboard/newsletter",
    permission: navPermissionMapping.VIEW_DASHBOARD,
  },
  {
    icon: LuSettings,
    label: "Settings",
    href: "/dashboard/settings",
    permission: navPermissionMapping.VIEW_SETTINGS,
  },
];

export const SidebarContentNav = ({
  onClose,
  isMinimized,
  toggleMinimized,
  ...rest
}: {
  onClose: () => void;
  isMinimized: boolean;
  toggleMinimized: () => void;
  [key: string]: any;
}) => {
  const bg = useColorModeValue("#fbfbfb", "#121212");
  const navBtnBg = useColorModeValue("customBlue", "gray.800");
  const navBtnBgHover = useColorModeValue("gray.200", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const hoverTextColor = useColorModeValue("gray.800", "gray.100");
  const siteConfig = useSiteConfig();
  const navBtnActiveColor = useColorModeValue("#fff", "#fff");
  const siteNameColor = useColorModeValue("gray.800", "gray.100");
  return (
    <Stack
      bg={bg}
      borderRight="1px"
      zIndex={1000}
      borderRightColor={borderColor}
      w={
        isMinimized
          ? "var(--dash-sidebar-mini-w)"
          : { base: "full", md: "var(--dash-sidebar-w)" }
      }
      pos="fixed"
      h="full"
      {...rest}
    >
      <Box>
        <Flex
          alignItems="center"
          mx={"auto"}
          mb={2}
          gap={3}
          py={3}
          justify={"center"}
        >
          {!isMinimized && (
            <>
              <AppLogoAndName logoSize={"30px"} />
            </>
          )}
          <VStack>
            {isMinimized && (
              <AppLogo src={siteConfig?.siteLogo?.value} size={"30px"} />
            )}
            <IconButton
              aria-label="Toggle Sidebar"
              onClick={toggleMinimized}
              fontSize="20"
              size="sm"
              variant={"ghost"}
              colorScheme="gray"
              color={siteNameColor}
              display={{ base: "none", md: "flex" }}
            >
              {isMinimized ? <LuChevronsRight /> : <LuChevronsLeft />}
            </IconButton>
          </VStack>
        </Flex>
      </Box>

      <VStack
        spacing={4}
        mt={4}
        h={"calc(100% - var(--dash-header-h))"}
        align="stretch"
        flex={1}
        pr={isMinimized ? 3 : 5}
        justifyContent={"space-between"}
      >
        {navItems.map((item, index) => (
          <Box key={index}>
            {item.children ? (
              <NavItemWithChildren
                item={item}
                isMinimized={isMinimized}
                navBtnBg={navBtnBg}
                navBtnBgHover={navBtnBgHover}
                textColor={textColor}
                hoverTextColor={hoverTextColor}
                navBtnActiveColor={navBtnActiveColor}
                bg={bg}
              />
            ) : (
              <SidebarNavItem
                icon={item.icon}
                href={item.href}
                permission={item.permission}
                isMinimized={isMinimized}
                onClose={onClose}
                navBtnBg={navBtnBg}
                navBtnActiveColor={navBtnActiveColor}
                navBtnBgHover={navBtnBgHover}
                textColor={textColor}
                hoverTextColor={hoverTextColor}
                bg={bg}
              >
                {item.label}
              </SidebarNavItem>
            )}
          </Box>
        ))}
        <Stack mt={"auto"} mb={5} pl={isMinimized ? 3 : 6}>
          <LightDarkModeSwitch showLabel={!isMinimized} />
        </Stack>
      </VStack>
    </Stack>
  );
};

SidebarContentNav.displayName = "SidebarContentNav";
