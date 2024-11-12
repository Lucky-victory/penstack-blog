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
} from "@chakra-ui/react";
import {
  LuSun,
  LuMoon,
  LuMenu,
  LuChevronDown,
  LuGithub,
  LuTwitter,
  LuSearch,
} from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useQueryParams } from "@/src/hooks";
import { Link } from "@chakra-ui/next-js";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchValue, setSearchValue] = useState("");
  const { queryParams, setQueryParam } = useQueryParams();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");

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
    router.push(`/search?query=${searchQuery}`);
  }
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    console.log(value);

    setSearchValue(value);
    setQueryParam("query", value);
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
      <Container maxW="container.xl" py={4}>
        <HStack justify="space-between" align="center">
          {/* Logo */}
          <Text
            as="a"
            href="/"
            fontSize="2xl"
            fontWeight="bold"
            color={useColorModeValue("blue.600", "blue.400")}
          >
            TechBlog
          </Text>

          {/* Desktop Navigation */}
          <HStack spacing={8} display={{ base: "none", md: "flex" }}>
            {/* Topics Dropdown */}
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                rightIcon={<LuChevronDown size={16} />}
                _hover={{ bg: hoverBgColor }}
              >
                Topics
              </MenuButton>
              <MenuList>
                {topics.map((topic) => (
                  <MenuItem
                    key={topic.name}
                    as={Link}
                    href={topic.href}
                    _hover={{ bg: hoverBgColor }}
                  >
                    {topic.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            {/* Resources Dropdown */}
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                rightIcon={<LuChevronDown size={16} />}
                _hover={{ bg: hoverBgColor }}
              >
                Resources
              </MenuButton>
              <MenuList>
                {resources.map((resource) => (
                  <MenuItem
                    key={resource.name}
                    as={Link}
                    href={resource.href}
                    _hover={{ bg: hoverBgColor }}
                  >
                    {resource.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            {/* Search Area */}
            <form onSubmit={handleFormSubmit}>
              <InputGroup maxW="300px">
                <Input
                  placeholder="Search articles..."
                  _placeholder={{ color: "gray.500" }}
                  _hover={{ borderColor: hoverBgColor }}
                  value={searchValue}
                  borderRadius="md"
                  name="search"
                  onChange={handleInputChange}
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Search"
                    icon={<LuSearch size={16} />}
                    variant="ghost"
                    _hover={{ bg: hoverBgColor }}
                  />
                </InputRightElement>
              </InputGroup>
            </form>
          </HStack>

          {/* Right Side Actions */}
          <HStack spacing={4}>
            {/* Social Icons */}
            <HStack spacing={2} display={{ base: "none", md: "flex" }}>
              <IconButton
                as="a"
                href="https://github.com/yourusername"
                aria-label="GitHub"
                icon={<LuGithub size={20} />}
                variant="ghost"
                _hover={{ bg: hoverBgColor }}
              />
              <IconButton
                as="a"
                href="https://twitter.com/yourusername"
                aria-label="Twitter"
                icon={<LuTwitter size={20} />}
                variant="ghost"
                _hover={{ bg: hoverBgColor }}
              />
            </HStack>

            {/* Theme Toggle */}
            <IconButton
              aria-label="Toggle color mode"
              icon={
                colorMode === "light" ? (
                  <LuMoon size={20} />
                ) : (
                  <LuSun size={20} />
                )
              }
              onClick={toggleColorMode}
              variant="ghost"
              _hover={{ bg: hoverBgColor }}
            />

            {/* Mobile Menu Button */}
            <IconButton
              display={{ base: "flex", md: "none" }}
              aria-label="Open menu"
              icon={<LuMenu size={20} />}
              onClick={onOpen}
              variant="ghost"
              _hover={{ bg: hoverBgColor }}
            />
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
                Topics
              </Text>
              {topics.map((topic) => (
                <Button
                  key={topic.name}
                  as="a"
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
                  as="a"
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
                as="a"
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
                  as="a"
                  href="https://github.com/yourusername"
                  aria-label="GitHub"
                  icon={<LuGithub size={20} />}
                  variant="ghost"
                />
                <IconButton
                  as="a"
                  href="https://twitter.com/yourusername"
                  aria-label="Twitter"
                  icon={<LuTwitter size={20} />}
                  variant="ghost"
                />
              </HStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
