"use client";
import {
  Box,
  Flex,
  Text,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  DrawerOverlay,
  DrawerBody,
  DrawerCloseButton,
} from "@chakra-ui/react";

import { useState, useEffect, memo } from "react";
import { ReactNode } from "react";

import { DashboardSidebar } from "../../../Dashboard/Sidebar";
import { LuMenu } from "react-icons/lu";
import NetworkAvailabiltyCheck from "../../../NetworkAvailabiltyCheck";
import { PermissionGuard } from "../../../PermissionGuard";
import { useSiteConfig } from "@/src/context/SiteConfig";
import { useDashboardSidebarState } from "@/src/hooks/useDashboardSidebarState";

export default memo(function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isMinimized, toggleMinimized } = useDashboardSidebarState();
  const siteConfig = useSiteConfig();

  return (
    <NetworkAvailabiltyCheck>
      <PermissionGuard requiredPermission="dashboard:access" shouldRedirect>
        <Box
          minH="var(--chakra-vh)"
          bg={useColorModeValue("gray.200", "charcoalBlack")}
        >
          <DashboardSidebar
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
                <DashboardSidebar
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
            // bg={useColorModeValue("white", "gray.900")}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue("gray.200", "gray.700")}
            justifyContent="flex-start"
            display={{ base: "flex", md: "none" }}
          >
            <Icon as={LuMenu} onClick={onOpen} fontSize="20" cursor="pointer" />
            <Text fontSize="lg" ml="4" fontWeight="bold" letterSpacing={1}>
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
            >
              {children}
            </Box>
          </Flex>
        </Box>
      </PermissionGuard>
    </NetworkAvailabiltyCheck>
  );
});
