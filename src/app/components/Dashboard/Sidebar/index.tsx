"use client";
import {
  Box,
  Flex,
  VStack,
  useColorModeValue,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import {
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
import { LightDarkModeSwitch } from "../../LightDarkModeSwitch";
import { AppLogo } from "../../AppLogoAndName/AppLogo";
import { SidebarNavItem } from "./NavItem";
import { NavItemWithChildren } from "./NavItemWithDropdown";
import { AppLogoAndName } from "../../AppLogoAndName";
import { useSiteConfig } from "@/src/context/SiteConfig";
import { Link } from "@chakra-ui/next-js";
import { useMemo } from "react";
import { dashboardNavLinks } from "@/src/lib/dashboard/nav-links";

export const DashboardSidebar = ({
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
  const navItems: NavItem[] = useMemo(() => dashboardNavLinks, []);
  const bg = useColorModeValue("white", "charcoalBlack");
  const navBtnBg = useColorModeValue("brand.600", "brand.300");
  const navBtnBgHover = useColorModeValue("gray.200", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const hoverTextColor = useColorModeValue("gray.800", "gray.100");
  const siteConfig = useSiteConfig();
  const navBtnActiveColor = useColorModeValue("#fff", "black");
  const siteNameColor = useColorModeValue("gray.800", "gray.100");
  return (
    <Flex
      flexDir={"column"}
      bg={bg}
      borderRight="1px"
      zIndex={1000}
      borderRightColor={borderColor}
      w={
        isMinimized
          ? "var(--dash-sidebar-mini-w)"
          : { base: "full", md: "var(--dash-sidebar-w)" }
      }
      h="full"
      pos="fixed"
      {...rest}
    >
      <Box>
        <Flex
          alignItems="center"
          mx={"auto"}
          mb={2}
          gap={3}
          py={3}
          px={isMinimized ? 0 : 4}
          justify={"center"}
        >
          {!isMinimized && (
            <Box flex={1}>
              <AppLogoAndName logoSize={"30px"} />
              <Link href={"/"} color={navBtnBg} fontSize={"small"}>
                visit site
              </Link>
            </Box>
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
              alignSelf={"start"}
              colorScheme="gray"
              color={siteNameColor}
              // display={{ base: "none", md: "flex" }}
            >
              {isMinimized ? <LuChevronsRight /> : <LuChevronsLeft />}
            </IconButton>
          </VStack>
        </Flex>
      </Box>

      <Stack
        spacing={4}
        mt={4}
        h={"calc(100% - var(--dash-header-h))"}
        align="stretch"
        flex={1}
        px={isMinimized ? 3 : 4}
        justifyContent={"space-between"}
      >
        {navItems.map((item, index) => (
          <>
            {item.children ? (
              <NavItemWithChildren
                item={item}
                key={index}
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
                key={index}
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
          </>
        ))}
        <Stack mt={"auto"} mb={8} pl={isMinimized ? 0 : 3}>
          <LightDarkModeSwitch showLabel={!isMinimized} />
        </Stack>
      </Stack>
    </Flex>
  );
};

DashboardSidebar.displayName = "DashboardSidebar";
