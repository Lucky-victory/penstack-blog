import React from "react";
import {
  Box,
  Container,
  Flex,
  Grid,
  HStack,
  IconButton,
  Link,
  Stack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { LuGithub, LuTwitter, LuMail } from "react-icons/lu";
import { Newsletter } from "../NewsLetter";
import { useSiteConfig } from "@/src/hooks/useSiteConfig";
import { AppLogo } from "../AppLogoAndName/AppLogo";
import { AppLogoAndName } from "../AppLogoAndName";

const Footer = () => {
  const bgColor = useColorModeValue("black", "gray.900");
  const textColor = "gray.400";
  const hoverColor = useColorModeValue("gray.500", "gray.300");
  const siteConfig = useSiteConfig();
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
    <Box as="footer" bg={bgColor}>
      <Container
        maxW="container.xl"
        py={8}
        minH={150}
        px={{ base: 4, md: 8, lg: 10 }}
        alignContent={"center"}
      >
        <Grid gridTemplate={["1fr", "1fr 1fr", "1fr 1fr 1fr 1fr"]} gap={6}>
          <Stack>
            <AppLogoAndName logoSize={"25px"} nameSize={"large"} />
            <Text fontSize="sm" color={textColor} maxW={300}>
              {siteConfig?.siteDescription?.value}
            </Text>
          </Stack>
          <Box mb={10} color={textColor}>
            <Newsletter />
          </Box>
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ md: "center" }}
            gap={{ base: 6, md: 0 }}
          >
            <VStack align={"start"} spacing={4}>
              <Text fontSize="sm" color={textColor}>
                &copy; {new Date().getFullYear()} {siteConfig?.siteName?.value}.
                All rights reserved.
              </Text>
            </VStack>

            <Flex gap={6} flexDir={{ base: "column", sm: "row" }}>
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
                <IconButton
                  as={Link}
                  key={link.label}
                  aria-label={link.label}
                  href={link.href}
                  color={textColor}
                  _hover={{ color: hoverColor }}
                  display="flex"
                  alignItems="center"
                  colorScheme="gray"
                  rounded={"full"}
                  // bg={bgColor}
                >
                  <link.icon size={20} />
                </IconButton>
              ))}
            </Flex>
          </Flex>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
