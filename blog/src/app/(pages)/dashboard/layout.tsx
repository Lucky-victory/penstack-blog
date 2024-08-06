'use client'
import { Box, Flex, VStack, Text, Icon, useColorModeValue, Drawer, DrawerContent, useDisclosure, DrawerOverlay, DrawerHeader, DrawerBody, DrawerCloseButton, Input, Avatar, Tooltip, Stack, useBreakpointValue } from "@chakra-ui/react"
import { usePathname, useRouter } from "next/navigation"
import {Link} from '@chakra-ui/next-js'

import { useState, useEffect } from "react"
import { ReactNode,ElementType } from "react";
import { LuChevronDown, LuChevronLeft, LuChevronRight, LuFileStack, LuHome, LuSettings, LuUsers,LuMenu } from "react-icons/lu"
import {Button} from '@/src/app/components/ui/Button'

const navItems = [
  { icon: LuHome, label: "Overview", href: "/dashboard" },
  {
    icon: LuFileStack,
    label: "Posts",
    href: "/dashboard/posts",
    children: [
      { label: "All Posts", href: "/dashboard/posts" },
      { label: "New Post", href: "/dashboard/posts/new" }
    ]
  },
  { icon: LuUsers, label: "Users", href: "/dashboard/users" },
  { icon: LuSettings, label: "Settings", href: "/dashboard/settings" }
];

const SidebarContent = ({ onClose, isMinimized, toggleMinimized, ...rest }: { onClose: () => void, isMinimized: boolean, toggleMinimized: () => void, [key: string]: any }) => {

  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<string[]>([]);

  useEffect(() => {
    const activeParent = navItems.find(item => 
      item.children && item.children.some(child => pathname.startsWith(child.href))
    );
    if (activeParent) {
      setOpenItems(prev => prev.includes(activeParent.href) ? prev : [...prev, activeParent.href]);
    }
  }, [pathname]);

  const toggleOpen = (href: string) => {
    setOpenItems(prev => 
      prev.includes(href) ? prev.filter(item => item !== href) : [...prev, href]
    );
  };

  const NavItem = ({ icon, children, href, nested = false }: { icon?:ElementType, children: ReactNode, href: string, nested?: boolean }) => {
    const isActive = pathname === href;
    const color = useColorModeValue("gray.600", "gray.300");
    const activeColor = 'white';
    
    return (
      <Tooltip rounded='md' label={isMinimized ? children : ''} placement="right" hasArrow>
        <Flex
          // ml={nested ? "4" : "0"}
          borderRadius="lg"
          role="group"
          color={isActive ? activeColor : color}
          bg={isActive ? 'blue.500' : "transparent"}
          _hover={{
            bg: isActive ? 'blue.700' : "blue.100",
            color: isActive ?  'white' : "blue.600",
          }}
        >
          <Button as={Link} colorScheme="black"
            variant='ghost'
            fontWeight={isActive ? "500" : "400"}
            size={nested?'sm':'md'}
            href={href}  w='full' justifyContent={isMinimized?'center':'flex-start'}
            style={{ textDecoration: "none" }}
            _focus={{ boxShadow: "none" }}
            onClick={onClose}
          >
            {icon && <Icon mr={isMinimized ? "0" : "4"} fontSize="16" as={icon} />}
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
      <Flex h={'var(--dash-header-h)'} alignItems="center" mx={6} justifyContent="space-between">
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
      <VStack spacing={4} align="stretch" px={3}>
        {navItems.map((item, index) => (
          <Box key={index}>
            {isMinimized ? (
              <NavItem icon={item.icon} href={item.href}>
                {item.label}
              </NavItem>
            ) : (
              <>
                {item.children ? (
                  <Box>
                    <Flex pos={'relative'}
                      align="center"
                      py="2"
                      px='4'
                      mx="0"
                      borderRadius="lg"
                      
                      cursor="pointer"
                      onClick={() => toggleOpen(item.href)}
                      _hover={{
                        bg:openItems.includes(item.href) ?"blue.700": "blue.50",
                        color: openItems.includes(item.href) ?'white':"blue.600",
                      }}
                      bg={item.children.some(child => pathname.startsWith(child.href)) ? "blue.500" : "transparent"}
                      color={item.children.some(child => pathname.startsWith(child.href)) ? "white" : "inherit"} 
                    >
                      <Icon mr="4" fontSize="16" as={item.icon} />
                      <Text flex="1" as={'span'}>{item.label}</Text>
                      <Icon as={LuChevronDown} transition="all .25s ease-in-out" transform={openItems.includes(item.href) ? "rotate(180deg)" : ""} />
                    </Flex>
                    {openItems.includes(item.href) && (
                      <VStack role="group" spacing={3} align="stretch" p={3} mt={-1} zIndex={1} bg={'gray.100'} roundedBottom={'md'}>
                        {item.children.map((child, childIndex) => (
                          <NavItem key={childIndex} href={child.href} nested>
                            {child.label}
                          </NavItem>
                        ))}
                      </VStack>
                    )}
                  </Box>
                ) : (
                  <NavItem icon={item.icon} href={item.href}>
                    {item.label}
                  </NavItem>
                )}
              </>
            )}
          </Box>
        ))}
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
           h={'var(--dash-header-h)'}
            alignItems="center"
            bg={useColorModeValue("white", "gray.900")}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue("gray.200", "gray.700")}
            justifyContent="flex-start"
            display={{ base: "flex", md: "none" }}
          >
            <Icon
              as={LuMenu}
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
