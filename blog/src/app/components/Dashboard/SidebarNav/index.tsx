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
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const bg = "#326cdc";
  const navBtnBg = "white";
  const navBtnBgHover = "#f3f3f3";
  const popoverBg = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.300", "gray.300");
  const hoverTextColor = useColorModeValue("gray.600", "gray.600");
  const childrenBg = "blackAlpha.400";
  const siteConfig = useSiteConfig();

  useEffect(() => {
    const activeParent = navItems.find(
      (item) =>
        item.children &&
        item.children.some((child) => pathname.startsWith(child.href))
    );
    if (activeParent) {
      setOpenItems((prev) =>
        prev.includes(activeParent.href) ? prev : [...prev, activeParent.href]
      );
    }
  }, [pathname]);

  const toggleOpen = (href: string) => {
    setOpenItems((prev) =>
      prev.includes(href)
        ? prev.filter((item) => item !== href)
        : [...prev, href]
    );
  };

  const NavItem = ({
    icon,
    children,
    href,
    nested = false,
    permission,
    label,
  }: {
    icon?: ElementType;
    children: ReactNode;
    href: string;
    nested?: boolean;
    label?: string;
    permission?: TPermissions;
  }) => {
    // const isActive =
    //   pathname === href ||
    //   (pathname.startsWith(href) &&
    //     (href !== "/dashboard" || item.href !== "/dashboard/posts"));
    const isActive =
      pathname === href ||
      (href.includes("/dashboard/posts/new") && pathname.match(href + "/*"));

    const content = (
      <Link
        display={"flex"}
        variant="unstyled"
        fontWeight={"500"}
        size={nested ? "sm" : "md"}
        pos={"relative"}
        gap={4}
        pl={isMinimized ? 3 : 5}
        href={href}
        style={{ textDecoration: "none" }}
        onClick={onClose}
        _hover={{
          _before: {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "4px",
            shadow: "md",
            height: "100%",
            backgroundColor: navBtnBgHover,
            borderRadius: "1px",
            transition: "background-color 0.2s ease-in-out",
          },
        }}
        _after={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "4px",
          shadow: "md",
          height: "100%",
          backgroundColor: navBtnBg,
          borderRadius: "1px",
          transition: "background-color 0.2s ease-in-out",
          visibility: isActive ? "visible" : "hidden",
        }}
      >
        <Flex
          rounded={{ base: "sm", md: "md" }}
          align={"center"}
          justify={isMinimized ? "center" : "flex-start"}
          gap={4}
          shadow={isActive ? "md" : "none"}
          color={isActive ? "black" : textColor}
          py={nested ? "6px" : "8px"}
          px={isMinimized ? 2 : nested ? 3 : 4}
          fontSize={nested ? "small" : "medium"}
          flex={1}
          bg={isActive ? navBtnBg : "transparent"}
          _hover={{
            bg: navBtnBgHover,
            color: isActive ? "black" : hoverTextColor,
          }}
        >
          {icon && (
            <Icon fontSize="16" as={icon} color={isActive ? bg : "inherit"} />
          )}
          {label && label}
          {!isMinimized && children}
        </Flex>
      </Link>
    );

    if (permission) {
      return (
        <PermissionGuard requiredPermission={permission} showLoader={false}>
          {content}
        </PermissionGuard>
      );
    }
    return content;
  };

  const NavItemWithChildren = ({ item }: { item: NavItem }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    if (isMinimized) {
      return (
        <PermissionGuard requiredPermission={item.permission!}>
          <Popover
            placement="right"
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            trigger="hover"
          >
            <PopoverTrigger>
              <Box>
                <NavItem icon={item.icon} href={item.href}>
                  {item.label}
                </NavItem>
              </Box>
            </PopoverTrigger>
            <PopoverContent ml={2} w="200px" rounded={"md"} bg={bg}>
              <PopoverArrow bg={bg} />
              <PopoverBody p={2} bg={childrenBg}>
                <VStack
                  align="stretch"
                  spacing={2}
                  divider={<Divider />}
                  role="group"
                >
                  {item.children?.map((child, idx) => (
                    <NavItem
                      key={idx}
                      href={child.href}
                      nested
                      label={child?.label}
                      permission={child.permission}
                    >
                      {child.label}
                    </NavItem>
                  ))}
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </PermissionGuard>
      );
    }
    const isActive =
      pathname === item.href ||
      (item.href.includes("/dashboard/posts/new") &&
        pathname.match(item.href + "/*"));

    return (
      <PermissionGuard requiredPermission={item.permission!}>
        <Box>
          <Button
            fontWeight={"500"}
            variant={"unstyled"}
            w="full"
            p={0}
            pl={isMinimized ? 3 : 5}
            _hover={{
              _before: {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "4px",
                shadow: "md",
                height: "100%",
                backgroundColor: navBtnBgHover,
                borderRadius: "1px",
                transition: "background-color 0.2s ease-in-out",
              },
            }}
            _after={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "4px",
              shadow: "md",
              height: "100%",
              backgroundColor: navBtnBg,
              borderRadius: "1px",
              transition: "background-color 0.2s ease-in-out",
              visibility: isActive ? "visible" : "hidden",
            }}
            roundedBottom={openItems.includes(item.href) ? "0" : "md"}
            size={"md"}
            cursor="pointer"
            onClick={() => toggleOpen(item.href)}
            justifyContent={isMinimized ? "center" : "space-between"}
          >
            <Flex
              rounded={{ base: "sm", md: "md" }}
              align={"center"}
              justify={isMinimized ? "center" : "space-between"}
              gap={4}
              shadow={isActive ? "md" : "none"}
              py={"8px"}
              px={isMinimized ? 2 : 4}
              fontSize={"medium"}
              w="full"
              bg={
                item.children?.some((child) =>
                  pathname.startsWith(child.href)
                ) || openItems.includes(item.href)
                  ? navBtnBg
                  : "transparent"
              }
              color={
                item.children?.some((child) =>
                  pathname.startsWith(child.href)
                ) || openItems.includes(item.href)
                  ? "black"
                  : textColor
              }
              _hover={{
                bg: openItems.includes(item.href) ? navBtnBg : navBtnBgHover,
                color: openItems.includes(item.href) ? "black" : hoverTextColor,
              }}
            >
              <HStack gap={0}>
                <Icon mr="4" fontSize="16" as={item.icon} />
                <Text flex="1">{item.label}</Text>
              </HStack>
              <Icon
                as={LuChevronDown}
                transition="all .25s ease-in-out"
                transform={
                  openItems.includes(item.href) ? "rotate(180deg)" : ""
                }
              />
            </Flex>
          </Button>
          {openItems.includes(item.href) && (
            <VStack
              spacing={3}
              align="stretch"
              px={3}
              py={4}
              mt={-1}
              ml={5}
              bg={childrenBg}
              roundedBottom="md"
            >
              {item.children?.map((child, childIndex) => (
                <NavItem
                  key={childIndex}
                  href={child.href}
                  nested
                  permission={child.permission}
                >
                  {child.label}
                </NavItem>
              ))}
            </VStack>
          )}
        </Box>
      </PermissionGuard>
    );
  };

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
          h="var(--dash-header-h)"
          alignItems="center"
          mx={6}
          mb={2}
          gap={3}
          justify={{ base: "center", md: "flex-end" }}
        >
          {!isMinimized && (
            <Text
              fontSize={"medium"}
              fontWeight="bold"
              letterSpacing={"2"}
              color={"white"}
            >
              {siteConfig?.siteName?.value}
            </Text>
          )}
          <Icon
            as={isMinimized ? LuChevronsRight : LuChevronsLeft}
            onClick={toggleMinimized}
            fontSize="20"
            cursor="pointer"
            color={navBtnBg}
            display={{ base: "none", md: "block" }}
          />
        </Flex>
      </Box>

      <VStack
        spacing={4}
        h={"calc(100% - var(--dash-header-h))"}
        align="stretch"
        flex={1}
        pr={isMinimized ? 3 : 6}
        justifyContent={"space-between"}
      >
        {navItems.map((item, index) => (
          <Box key={index}>
            {item.children ? (
              <NavItemWithChildren item={item} />
            ) : (
              <NavItem
                icon={item.icon}
                href={item.href}
                permission={item.permission}
              >
                {item.label}
              </NavItem>
            )}
          </Box>
        ))}
        <Stack mt={"auto"} mb={5} pl={isMinimized ? 3 : 6}>
          <LightDarkModeSwitch showLabel={!isMinimized} />
          <UserInfoComp showLabel={!isMinimized} />
        </Stack>
      </VStack>
    </Stack>
  );
};

SidebarContentNav.displayName = "SidebarContentNav";
