'use client'
import { Box, Flex, VStack,  Text, Icon, useColorModeValue, Drawer, DrawerContent, useDisclosure, DrawerOverlay, DrawerHeader, DrawerBody, DrawerCloseButton, Input, Avatar, Tooltip, Stack, useBreakpointValue } from "@chakra-ui/react"
import { usePathname, useRouter } from "next/navigation"
import {Link} from '@chakra-ui/next-js'
import { FiHome, FiFileText, FiUsers, FiSettings, FiChevronDown, FiMenu, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { useState, useEffect } from "react"
import { ReactNode,ElementType } from "react";
import { LuChevronDown, LuChevronLeft, LuChevronRight, LuFileStack, LuHome, LuSettings, LuUsers } from "react-icons/lu"
import {Button} from '@/src/app/components/ui/Button'
const SidebarContent = ({ onClose, isMinimized, toggleMinimized, ...rest }: { onClose: () => void, isMinimized: boolean, toggleMinimized: () => void, [key: string]: any }) => {

  const [isPostsOpen, setIsPostsOpen] = useState(false)

  const NavItem = ({ icon, children, href, nested = false }: { icon?:ElementType, children: ReactNode, href: string, nested?: boolean }) => {
    const isActive = usePathname() === href   
     const color = useColorModeValue("gray.600", "gray.300")
    const activeColor = useColorModeValue("blue.600", "blue.300")

    return (
      <Tooltip rounded='md' label={isMinimized ? children : ''} placement="right" hasArrow>
            <Flex
          
            mx={nested ? "4" : "0"}
            borderRadius="lg"
            role="group"
            // cursor="pointer"
            color={isActive ? activeColor : color}
            bg={isActive ? "blue.100" : "transparent"}
            _hover={{
              bg: "blue.50",
              color: "blue.600",
            }}
          >
            <Button as={Link} colorScheme="black"
           variant='ghost'
             fontWeight={isActive ? "500" : "400"}
              href={href} 
              style={{ textDecoration: "none" }}
              _focus={{ boxShadow: "none" }}
              onClick={onClose}
            >
            {icon && <Icon mr={isMinimized ? "0" : "4"} fontSize="16"  as={icon} />}
            {!isMinimized && children}
            </Button>
          </Flex>
      
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
      <Flex h="16" alignItems="center" mx={4} justifyContent="space-between">
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
      <VStack spacing={2} align="stretch" px={3}>
        <NavItem icon={LuHome} href="/dashboard">
          Overview
        </NavItem>
        {isMinimized ? (
          <NavItem icon={LuFileStack} href="/dashboard/posts">
            Posts
          </NavItem>
        ) : (
          <Box>
            <Flex
              align="center"
              py="2"
              px='3'
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
              <Icon mr="4" fontSize="16" as={LuFileStack} />
              <Text flex="1" as={'span'}>Posts</Text>
              <Icon as={LuChevronDown} transition="all .25s ease-in-out" transform={isPostsOpen ? "rotate(180deg)" : ""} />
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
        <NavItem icon={LuUsers} href="/dashboard/users">
          Users
        </NavItem>
        <NavItem icon={LuSettings} href="/dashboard/settings">
          Settings
        </NavItem>
      </VStack>
    </Box>
  )
}

export default function DashLayout({children}:{children:ReactNode}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isMinimized, setIsMinimized] = useState(false)
    const [windowWidth, setWindowWidth] = useState(0)

    useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth)
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
      setIsMinimized(windowWidth < 1200)
    }, [windowWidth])

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
            <Text fontSize="2xl" ml="4" fontFamily="monospace" fontWeight="bold">
              BA
            </Text>
          </Flex>
          <Flex flexDir={'column'} h={'var(--chakra-vh)'} >

          {/* Dashboard Header */}
        
          <Box  flex={1}  w={{base:'100%',md:isMinimized? 'calc(100% - var(--dash-sidebar-mini-w))':'calc(100% - var(--dash-sidebar-w))'}}  ml={{ base: 0, md: isMinimized ? "var(--dash-sidebar-mini-w)" : "var(--dash-sidebar-w)" }}  maxW="1600px" margin="0 auto" overflowY={'auto'} >
            {children}
          </Box>
            </Flex>
        </Box>
    )
}
