import React, { ChangeEvent, FormEvent, useState } from "react";
import {
  Box,
  Container,
  HStack,
  Button,
  IconButton,
  useColorMode,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Divider,
  InputGroup,
  Input,
  InputRightElement,
  Icon,
  Hide,
} from "@chakra-ui/react";
import {
  LuMenu,
  LuChevronDown,
  LuGithub,
  LuTwitter,
  LuSearch,
} from "react-icons/lu";
import { usePathname, useRouter } from "next/navigation";
import { useQueryParams } from "@/src/hooks";
import { Link } from "@chakra-ui/next-js";
import { LightDarkModeSwitch } from "../LightDarkModeSwitch";
import { AuthButtons } from "./AuthButtons";
import { isActive } from "@tiptap/core";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchValue, setSearchValue] = useState("");
  const { queryParams, setQueryParam } = useQueryParams();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const navLinkHoverBgColor = useColorModeValue("blue.500", "blue.500");
  const pathname = usePathname();
  const topics = [
    { name: "React", href: "/topic/react" },
    { name: "TypeScript", href: "/topic/typescript" },
    { name: "Node.js", href: "/topic/nodejs" },
    { name: "Python", href: "/topic/python" },
    { name: "DevOps", href: "/topic/devops" },
  ];

  const resources = [
    { name: "Tutorials", href: "/resources/tutorials" },
    { name: "Guides", href: "/resources/guides" },
    { name: "Newsletter", href: "/newsletter" },
    { name: "About", href: "/about" },
  ];
  const router = useRouter();
  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search");
    router.push(`/search?q=${searchQuery}`);
  }
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    setSearchValue(value);
  }
  function isActiveUrl(url: string) {
    return pathname === url;
  }
  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={100}
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      backdropFilter="blur(10px)"
      backgroundColor={useColorModeValue(
        "rgba(255, 255, 255, 0.8)",
        "rgba(26, 32, 44, 0.8)"
      )}
    >
      <Container
        maxW="container.xl"
        py={2}
        borderBottom="2px"
        borderColor={borderColor}
      >
        <HStack justify="space-between" align="center">
          {/* Logo */}
          <Text
            as={Link}
            href="/"
            fontSize="2xl"
            fontWeight="bold"
            color={useColorModeValue("black", "white")}
          >
            TechBlog
          </Text>

          {/* Desktop Navigation */}
          <HStack spacing={8} display={{ base: "none", lg: "flex" }}></HStack>

          {/* Right Side Actions */}
          <HStack spacing={4}>
            {/* Social Icons */}
            <HStack spacing={2} display={{ base: "none", lg: "flex" }}>
              <IconButton
                rounded={"full"}
                as={Link}
                isExternal
                href="https://github.com/lucky-victory"
                aria-label="GitHub"
                icon={<LuGithub size={20} />}
                variant="ghost"
                _hover={{ bg: hoverBgColor }}
                colorScheme="black"
              />
              <IconButton
                rounded={"full"}
                as={Link}
                isExternal
                href="https://twitter.com/lucky_victory1"
                aria-label="Twitter"
                icon={<LuTwitter size={20} />}
                variant="ghost"
                _hover={{ bg: hoverBgColor }}
                colorScheme="black"
              />
              <LightDarkModeSwitch />
              <AuthButtons />
            </HStack>
            <Hide above="lg">
              <LightDarkModeSwitch />
            </Hide>

            <IconButton
              colorScheme="black"
              display={{ base: "flex", lg: "none" }}
              aria-label="Open menu"
              icon={<LuMenu size={20} />}
              onClick={onOpen}
              variant="ghost"
              _hover={{ bg: hoverBgColor }}
            />
          </HStack>
        </HStack>
      </Container>
      <Container maxW="container.xl">
        <HStack
          align="center"
          spacing={3}
          display={{ base: "none", lg: "flex" }}
          py={2}
        >
          <Link
            textTransform="uppercase"
            fontWeight={500}
            href={"/"}
            bg={isActiveUrl("/") ? "blue.500" : ""}
            color={isActiveUrl("/") ? "white" : ""}
            rounded={"full"}
            px={4}
            py={2}
            _hover={{
              bg: isActiveUrl("/") ? "blue.600" : navLinkHoverBgColor,
              color: "white",
            }}
          >
            Home
          </Link>
          <Link
            textTransform="uppercase"
            fontWeight={500}
            href={"/"}
            bg={isActiveUrl("/articles") ? "blue.500" : ""}
            color={isActiveUrl("/articles") ? "white" : ""}
            rounded={"full"}
            px={4}
            py={2}
            _hover={{
              bg: isActiveUrl("/articles") ? "blue.600" : navLinkHoverBgColor,
              color: "white",
            }}
          >
            Articles
          </Link>
          {resources.map((resource) => (
            <Link
              key={resource.name}
              textTransform="uppercase"
              fontWeight={500}
              href={resource.href}
              rounded={"full"}
              px={4}
              py={2}
              bg={isActiveUrl(resource.href) ? "blue.500" : ""}
              color={isActiveUrl(resource.href) ? "white" : ""}
              _hover={{
                bg: isActiveUrl(resource.href)
                  ? "blue.600"
                  : navLinkHoverBgColor,
                color: "white",
              }}
            >
              {resource.name}
            </Link>
          ))}

          {/* Search Area */}
          <HStack ml="auto" spacing={4} display={{ base: "none", lg: "flex" }}>
            {/* Topics Dropdown */}
            <Menu>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    textTransform="uppercase"
                    fontWeight={500}
                    size="sm"
                    colorScheme="black"
                    variant="outline"
                  >
                    <HStack>
                      <Text>All Categories</Text>
                      <Icon
                        as={LuChevronDown}
                        transition={"0.2s ease-out"}
                        transform={isOpen ? "rotate(-180deg)" : "rotate(0deg)"}
                      ></Icon>
                    </HStack>
                  </MenuButton>
                  <MenuList rounded="xl">
                    {topics.map((topic) => (
                      <MenuItem key={topic.name} as={Link} href={topic.href}>
                        {topic.name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </>
              )}
            </Menu>
            <form onSubmit={handleFormSubmit}>
              <InputGroup maxW="250px">
                <Input
                  rounded={"full"}
                  placeholder="Search articles..."
                  _placeholder={{ color: "gray.500" }}
                  _hover={{ borderColor: hoverBgColor }}
                  value={searchValue}
                  name="search"
                  onChange={handleInputChange}
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Search"
                    // colorScheme="black"
                    rounded={"full"}
                    icon={<LuSearch size={16} />}
                    variant="ghost"
                  />
                </InputRightElement>
              </InputGroup>
            </form>
          </HStack>
        </HStack>
      </Container>
      {/* Mobile Menu Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing={4}>
              <Text fontWeight="bold" color={textColor}>
                Categories
              </Text>
              {topics.map((topic) => (
                <Button
                  key={topic.name}
                  rounded={"full"}
                  as={Link}
                  href={topic.href}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                  onClick={onClose}
                >
                  {topic.name}
                </Button>
              ))}

              <Divider />

              <Text fontWeight="bold" color={textColor}>
                Resources
              </Text>
              {resources.map((resource) => (
                <Button
                  key={resource.name}
                  rounded={"full"}
                  as={Link}
                  href={resource.href}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                  onClick={onClose}
                >
                  {resource.name}
                </Button>
              ))}

              <Divider />

              <Button
                rounded={"full"}
                as={Link}
                href="/search"
                variant="ghost"
                justifyContent="flex-start"
                w="full"
                onClick={onClose}
              >
                Search
              </Button>

              <HStack spacing={4} pt={4}>
                <IconButton
                  rounded={"full"}
                  as={Link}
                  isExternal
                  colorScheme="black"
                  href="https://github.com/yourusername"
                  aria-label="GitHub"
                  icon={<LuGithub size={20} />}
                  variant="ghost"
                />
                <IconButton
                  rounded={"full"}
                  as={Link}
                  isExternal
                  colorScheme="black"
                  href="https://twitter.com/yourusername"
                  aria-label="Twitter"
                  icon={<LuTwitter size={20} />}
                  variant="ghost"
                />
              </HStack>
              <AuthButtons />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
