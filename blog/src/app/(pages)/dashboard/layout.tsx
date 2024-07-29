'use client'
import { Box, Flex, VStack, Link, Text, Icon, useColorModeValue, Drawer, DrawerContent, useDisclosure, DrawerOverlay, DrawerHeader, DrawerBody, DrawerCloseButton, Input, Avatar, Tooltip, Stack } from "@chakra-ui/react"
import { usePathname, useRouter } from "next/navigation"
import NextLink from "next/link"
import { FiHome, FiFileText, FiUsers, FiSettings, FiChevronDown, FiMenu, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { useState } from "react"
import { ReactNode,ElementType } from "react";

const SidebarContent = ({ onClose, isMinimized, toggleMinimized, ...rest }: { onClose: () => void, isMinimized: boolean, toggleMinimized: () => void, [key: string]: any }) => {

  const [isPostsOpen, setIsPostsOpen] = useState(false)

  const NavItem = ({ icon, children, href, nested = false }: { icon?:ElementType, children: ReactNode, href: string, nested?: boolean }) => {
    const isActive = usePathname() === href   
     const color = useColorModeValue("gray.600", "gray.300")
    const activeColor = useColorModeValue("blue.600", "blue.300")

    return (
      <Tooltip label={isMinimized ? children : ''} placement="right" hasArrow>
        <Link
          as={NextLink}
          href={href}
          style={{ textDecoration: "none" }}
          _focus={{ boxShadow: "none" }}
          onClick={onClose}
        >
          <Flex
            align="center"
            p="3"
            mx={nested ? "4" : "0"}
            borderRadius="lg"
            role="group"
            cursor="pointer"
            color={isActive ? activeColor : color}
            bg={isActive ? "blue.100" : "transparent"}
            _hover={{
              bg: "blue.50",
              color: "blue.600",
            }}
          >
            {icon && <Icon mr={isMinimized ? "0" : "4"} fontSize="16"  as={icon} />}
            {!isMinimized && children}
          </Flex>
        </Link>
      </Tooltip>
    )
  }

  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={isMinimized ? "var(--dash-sidebar-mini-w)" : { base: "full", md: "var(--dash-sidebar-w)" }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx={isMinimized ? "2" : "8"} justifyContent="space-between">
        {!isMinimized && (
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            Blog Admin
          </Text>
        )}
        <Icon
          as={isMinimized ? FiChevronRight : FiChevronLeft}
          onClick={toggleMinimized}
          fontSize="24"
          cursor="pointer"
          display={{ base: "none", md: "block" }}
        />
      </Flex>
      <VStack spacing={2} align="stretch" px={3}>
        <NavItem icon={FiHome} href="/dashboard">
          Overview
        </NavItem>
        {isMinimized ? (
          <NavItem icon={FiFileText} href="/dashboard/posts">
            Posts
          </NavItem>
        ) : (
          <Box>
            <Flex
              align="center"
              p="3"
              mx="0"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              onClick={() => setIsPostsOpen(!isPostsOpen)}
              _hover={{
                bg: "blue.50",
                color: "blue.600",
              }}
            >
              <Icon mr="4" fontSize="16" as={FiFileText} />
              <Text flex="1">Posts</Text>
              <Icon as={FiChevronDown} transition="all .25s ease-in-out" transform={isPostsOpen ? "rotate(180deg)" : ""} />
            </Flex>
            {isPostsOpen && (
              <VStack spacing={2} align="stretch" mt={2}>
                <NavItem href="/dashboard/posts" nested>
                  All Posts
                </NavItem>
                <NavItem href="/dashboard/posts/new" nested>
                  New Post
                </NavItem>
              </VStack>
            )}
          </Box>
        )}
        <NavItem icon={FiUsers} href="/dashboard/users">
          Users
        </NavItem>
        <NavItem icon={FiSettings} href="/dashboard/settings">
          Settings
        </NavItem>
      </VStack>
    </Box>
  )
}

export default function DashLayout({children}:{children:ReactNode}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isMinimized, setIsMinimized] = useState(false)

    const toggleMinimized = () => setIsMinimized(!isMinimized)

    return (
        <Box minH="var(--chakra-vh)" bg={useColorModeValue("gray.100", "gray.900")}>
          <SidebarContent
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
            size={{ base: "full", sm: "sm" }}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Menu</DrawerHeader>
              <DrawerBody>
                <SidebarContent onClose={onClose} isMinimized={false} toggleMinimized={() => {}} />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
          {/* mobilenav */}
          <Flex
            ml={{ base: 0, md: isMinimized ? "var(--dash-sidebar-mini-w)" : "var(--dash-sidebar-w)" }}
            px={{ base: 4, md: 16 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue("white", "gray.900")}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue("gray.200", "gray.700")}
            justifyContent="flex-start"
            display={{ base: "flex", md: "none" }}
          >
            <Icon
              as={FiMenu}
              onClick={onOpen}
              fontSize="20"
              cursor="pointer"
            />
            <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
              Blog Admin
            </Text>
          </Flex>
          <Flex flexDir={'column'} h={'var(--chakra-vh)'} >

          {/* Dashboard Header */}
          <Flex
            ml={{ base: 0, md: isMinimized ? "var(--dash-sidebar-mini-w)" : "var(--dash-sidebar-w)" }}
            px={{ base: 4, md: 5 }}
            height="14" flexShrink={0}
            alignItems="center"
            bg={useColorModeValue("white", "gray.900")}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue("gray.200", "gray.700")}
            justifyContent="space-between"
            >
            <Flex alignItems="center">
              <Icon as={FiSearch} fontSize="20" color="gray.400" />
              <Input placeholder="Search..." ml="4" variant="unstyled" />
            </Flex>
            <Flex alignItems="center">
              <Avatar size="sm" />
            </Flex>
          </Flex>
          <Box  flex={1}  w={isMinimized? 'calc(100% - var(--dash-sidebar-mini-w))':'calc(100% - var(--dash-sidebar-w))'} px={3} ml={{ base: 0, md: isMinimized ? "var(--dash-sidebar-mini-w)" : "var(--dash-sidebar-w)" }}  maxW="1600px" margin="0 auto" overflowY={'auto'} >
            {children}
          </Box>
            </Flex>
        </Box>
    )
}
