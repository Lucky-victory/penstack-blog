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
} from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { Link } from "@chakra-ui/next-js";
import { useState, useEffect } from "react";
import { ReactNode, ElementType } from "react";
import {
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuFileImage,
  LuFileStack,
  LuHome,
  LuSettings,
  LuUsers,
} from "react-icons/lu";
import { TPermissions } from "@/src/types";
import { ProtectedComponent } from "../../ProtectedComponent";
import { LightDarkModeSwitch } from "../../LightDarkModeSwitch";

interface NavItem {
  icon: ElementType;
  label: string;
  href: string;
  permission?: TPermissions;
  children?: Array<{
    label: string;
    href: string;
    permission?: TPermissions;
  }>;
}
const navPermissionMapping = {
  VIEW_DASHBOARD: "dashboard:view",
  VIEW_POSTS: "posts:read",
  CREATE_POST: "posts:create",
  VIEW_USERS: "users:read",
  VIEW_MEDIA: "media:read",
  VIEW_SETTINGS: "settings:read",
} as const;

const navItems: NavItem[] = [
  {
    icon: LuHome,
    label: "Overview",
    href: "/dashboard",
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
  const bg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.100", "gray.300");
  const hoverBg = useColorModeValue("blue.200", "blue.900");
  const activeHoverBg = useColorModeValue("blue.600", "blue.700");
  const childrenBg = useColorModeValue("gray.100", "gray.800");

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
    const isActive =
      pathname === href || (pathname.startsWith(href) && href !== "/dashboard");
    const content = (
      <Flex borderRadius="lg" role="group">
        <Button
          as={Link}
          variant="ghost"
          fontWeight={isActive ? "500" : "400"}
          size={nested ? "sm" : "md"}
          href={href}
          w="full"
          justifyContent={isMinimized ? "center" : "flex-start"}
          style={{ textDecoration: "none" }}
          _focus={{ boxShadow: "none" }}
          onClick={onClose}
          color={isActive ? "white" : textColor}
          bg={isActive ? "blue.500" : "transparent"}
          _hover={{
            bg: isActive ? activeHoverBg : hoverBg,
            color: isActive ? "white" : "blue.500",
          }}
        >
          {icon && (
            <Icon mr={isMinimized ? "0" : "4"} fontSize="16" as={icon} />
          )}
          {label && label}
          {!isMinimized && children}
        </Button>
      </Flex>
    );

    if (permission) {
      return (
        <ProtectedComponent requiredPermission={permission}>
          {content}
        </ProtectedComponent>
      );
    }
    return content;
  };

  const NavItemWithChildren = ({ item }: { item: NavItem }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (isMinimized) {
      return (
        <ProtectedComponent requiredPermission={item.permission!}>
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
            <PopoverContent ml={2} w="200px">
              <PopoverArrow />
              <PopoverBody p={2}>
                <VStack align="stretch" spacing={2}>
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
        </ProtectedComponent>
      );
    }

    return (
      <ProtectedComponent requiredPermission={item.permission!}>
        <Box>
          <Button
            // alignItems="center"
            py="2"
            px="4"
            mx="0"
            borderRadius="lg"
            w="full"
            cursor="pointer"
            onClick={() => toggleOpen(item.href)}
            _hover={{
              bg: openItems.includes(item.href) ? activeHoverBg : hoverBg,
              color: openItems.includes(item.href) ? "white" : "blue.500",
            }}
            bg={
              item.children?.some((child) => pathname.startsWith(child.href))
                ? "blue.500"
                : "transparent"
            }
            color={
              item.children?.some((child) => pathname.startsWith(child.href))
                ? "white"
                : textColor
            }
          >
            <Icon mr="4" fontSize="16" as={item.icon} />
            <Text flex="1">{item.label}</Text>
            <Icon
              as={LuChevronDown}
              transition="all .25s ease-in-out"
              transform={openItems.includes(item.href) ? "rotate(180deg)" : ""}
            />
          </Button>
          {openItems.includes(item.href) && (
            <VStack
              spacing={3}
              align="stretch"
              p={3}
              mt={-1}
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
      </ProtectedComponent>
    );
  };

  return (
    <Flex
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
      <Flex
        h="var(--dash-header-h)"
        alignItems="center"
        mx={6}
        justifyContent="space-between"
      >
        {!isMinimized && (
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            BA
          </Text>
        )}
        <Icon
          as={isMinimized ? LuChevronRight : LuChevronLeft}
          onClick={toggleMinimized}
          fontSize="24"
          cursor="pointer"
          display={{ base: "none", md: "block" }}
        />
      </Flex>
      <VStack spacing={4} align="stretch" flex={1} px={3}>
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
        <Box mt={"auto"} mb={5}>
          <LightDarkModeSwitch />
        </Box>
      </VStack>
    </Flex>
  );
};

SidebarContentNav.displayName = "SidebarContentNav";
