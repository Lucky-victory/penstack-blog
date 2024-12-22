"use client";
import {
  Box,
  Flex,
  VStack,
  Text,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  DrawerOverlay,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  Input,
  Avatar,
  Tooltip,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { Link } from "@chakra-ui/next-js";

import { useState, useEffect } from "react";
import { ReactNode, ElementType } from "react";

import { SidebarContentNav } from "../../components/Dashboard/SidebarNav";
import { LuMenu } from "react-icons/lu";
import NetworkAvailabiltyCheck from "../../components/NetworkAvailabiltyCheck";
import { PermissionGuard } from "../../components/PermissionGuard";
import { useSiteConfig } from "@/src/hooks/useSiteConfig";

export default function DashLayout({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMinimized, setIsMinimized] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const siteConfig = useSiteConfig();
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsMinimized(windowWidth < 1200);
  }, [windowWidth]);

  const toggleMinimized = () => setIsMinimized(!isMinimized);

  return (
    <NetworkAvailabiltyCheck>
      <PermissionGuard requiredPermission="dashboard:access" shouldRedirect>
        <Box
          minH="var(--chakra-vh)"
          bg={useColorModeValue("gray.100", "gray.900")}
        >
          <SidebarContentNav
            onClose={() => onClose}
            display={{ base: "none", md: "block" }}
            isMinimized={isMinimized}
            toggleMinimized={toggleMinimized}
          />
          <Drawer
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            returnFocusOnClose={false}
            onOverlayClick={onClose}
            size={"xs"}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton zIndex={2000} />

              <DrawerBody px={0} p={0} mr={0}>
                <SidebarContentNav
                  onClose={onClose}
                  isMinimized={false}
                  toggleMinimized={() => {}}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
          {/* mobilenav */}
          <Flex
            ml={{
              base: 0,
              md: isMinimized
                ? "var(--dash-sidebar-mini-w)"
                : "var(--dash-sidebar-w)",
            }}
            px={{ base: 4, md: 16 }}
            h={"var(--dash-header-h)"}
            alignItems="center"
            bg={useColorModeValue("white", "gray.900")}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue("gray.200", "gray.700")}
            justifyContent="flex-start"
            display={{ base: "flex", md: "none" }}
          >
            <Icon as={LuMenu} onClick={onOpen} fontSize="20" cursor="pointer" />
            <Text fontSize="lg" ml="4" fontWeight="medium" letterSpacing={1}>
              {siteConfig?.siteName?.value}
            </Text>
          </Flex>
          <Flex flexDir={"column"} h={"var(--chakra-vh)"}>
            {/* Dashboard Header */}

            <Box
              flex={1}
              w={{
                base: "100%",
                md: isMinimized
                  ? "calc(100% - var(--dash-sidebar-mini-w))"
                  : "calc(100% - var(--dash-sidebar-w))",
              }}
              ml={{
                base: 0,
                md: isMinimized
                  ? "var(--dash-sidebar-mini-w)"
                  : "var(--dash-sidebar-w)",
              }}
              maxW="container.2xl"
              margin="0 auto"
              overflowY={"auto"}
              // px={{ base: 4, md: 5, lg: 6 }}
            >
              {children}
            </Box>
          </Flex>
        </Box>
      </PermissionGuard>
    </NetworkAvailabiltyCheck>
  );
}
