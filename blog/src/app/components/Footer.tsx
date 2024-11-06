import React from "react";
import {
  Box,
  Container,
  Flex,
  Link,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { LuGithub, LuTwitter, LuMail } from "react-icons/lu";

const Footer = () => {
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const hoverColor = useColorModeValue("gray.700", "gray.300");

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Topics", href: "/topics" },
    { label: "Resources", href: "/resources" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const socialLinks = [
    {
      label: "GitHub",
      href: "https://github.com/yourusername",
      icon: LuGithub,
    },
    {
      label: "Twitter",
      href: "https://twitter.com/yourusername",
      icon: LuTwitter,
    },
    { label: "Email", href: "mailto:hello@example.com", icon: LuMail },
  ];

  return (
    <Box as="footer" bg={bgColor} py={8}>
      <Container maxW="7xl">
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          gap={{ base: 6, md: 0 }}
        >
          <VStack align={{ base: "center", md: "start" }} spacing={4}>
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              TechBlog
            </Text>
            <Text fontSize="sm" color={textColor}>
              &copy; {new Date().getFullYear()} TechBlog. All rights reserved.
            </Text>
          </VStack>

          <Flex gap={6}>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                color={textColor}
                _hover={{ color: hoverColor }}
              >
                {item.label}
              </Link>
            ))}
          </Flex>

          <Flex gap={4}>
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                color={textColor}
                _hover={{ color: hoverColor }}
                display="flex"
                alignItems="center"
              >
                <link.icon size={20} />
              </Link>
            ))}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
