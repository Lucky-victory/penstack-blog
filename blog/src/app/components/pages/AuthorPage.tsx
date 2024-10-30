"use client";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Container,
  Image,
  Text,
  Heading,
  VStack,
  HStack,
  Grid,
  Input,
  Button,
  FormControl,
  useColorModeValue,
  Flex,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Tag,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { LuMail, LuTwitter, LuGithub, LuLink, LuSend } from "react-icons/lu";
import { Newsletter } from "../NewsLetter";
import { PostSelect } from "@/src/types";
import PostCard from "../PostCard";

// Sample data remains the same
const author = {
  name: "Sarah Johnson",
  role: "Senior Technical Writer",
  avatar: "https://picsum.photos/200/200",
  bio: "Passionate about explaining complex technical concepts in simple terms. Writing about web development, software architecture, and developer productivity.",
  socials: {
    twitter: "@sarahjohnson",
    github: "sarahjohnson",
    email: "sarah@example.com",
    website: "sarahjohnson.dev",
  },
};

const articles = [
  {
    id: 1,
    title: "Understanding React Server Components",
    content: "",
    slug: "understanding-react-server-components",
    post_id: "jdkvp0",
    summary:
      "A deep dive into the next evolution of React's component model and how it changes the way we build applications.",
    published_at: "2024-03-15",
    category: { name: "React" },
    featured_image: { src: "https://picsum.photos/400/200" },
    author: {
      name: "Sarah Johnson",
      avatar: "https://picsum.photos/200/200",
    },
  },
  {
    id: 2,
    title: "The Future of Web Development",
    content: "",
    slug: "the-future-of-web-development",
    post_id: "jdkvp1",
    summary:
      "Exploring upcoming trends and technologies that will shape the future of web development in the next decade.",
    published_at: "2024-03-10",
    category: { name: "Web Development" },
    featured_image: { src: "https://picsum.photos/400/200" },
    author: {
      name: "Sarah Johnson",
      avatar: "https://picsum.photos/200/200",
    },
  },
  {
    id: 3,
    title: "Maximizing Developer Productivity",
    content: "",
    slug: "maximizing-developer-productivity",
    post_id: "jdkvp2",
    summary:
      "Essential tips and tools for improving your workflow and becoming a more efficient developer.",
    published_at: "2024-03-05",
    category: { name: "Productivity" },
    featured_image: { src: "https://picsum.photos/400/200" },
    author: {
      name: "Sarah Johnson",
      avatar: "https://picsum.photos/200/200",
    },
  },
  {
    id: 4,
    title: "The Power of Design Systems",
    slug: "the-power-of-design-systems",
    post_id: "jdkvp3",
    content: "",
    summary:
      "The importance of design systems in maintaining consistency and efficiency in web development projects.",
    published_at: "2024-03-01",
    category: { name: "Design" },
    featured_image: { src: "https://picsum.photos/400/200" },
    author: {
      name: "Sarah Johnson",
      avatar: "https://picsum.photos/200/200",
    },
  },
];

const ArticleCard = ({ article }: { article: PostSelect }) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  return <PostCard post={article} />;
};

const AuthorPage = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Box minH="100vh" bg={bgColor} py={12}>
      <Container maxW="7xl">
        {/* Author Profile Section */}
        <Card
          bg={cardBgColor}
          borderRadius="3xl"
          p={{ base: 4, md: 6, lg: 8 }}
          mb={12}
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "center", md: "start" }}
            gap={8}
          >
            <Image
              src={author.avatar}
              alt={author.name}
              w="128px"
              h="128px"
              borderRadius="full"
              objectFit="cover"
            />

            <VStack
              flex={1}
              align={{ base: "center", md: "start" }}
              spacing={4}
            >
              <Heading size="xl">{author.name}</Heading>
              <Text color="blue.500" fontWeight="medium">
                {author.role}
              </Text>
              <Text color={textColor} maxW="2xl">
                {author.bio}
              </Text>

              <HStack
                spacing={4}
                wrap="wrap"
                justify={{ base: "center", md: "start" }}
              >
                <Link
                  isExternal
                  href={`https://twitter.com/${author.socials.twitter}`}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  color={textColor}
                  _hover={{ color: "blue.500" }}
                >
                  <LuTwitter size={20} />
                  <Text>{author.socials.twitter}</Text>
                </Link>
                <Link
                  isExternal
                  href={`https://github.com/${author.socials.github}`}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  color={textColor}
                  _hover={{ color: "blue.500" }}
                >
                  <LuGithub size={20} />
                  <Text>{author.socials.github}</Text>
                </Link>
                <Link
                  isExternal
                  href={`mailto:${author.socials.email}`}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  color={textColor}
                  _hover={{ color: "blue.500" }}
                >
                  <LuMail size={20} />
                  <Text>{author.socials.email}</Text>
                </Link>
                <Link
                  isExternal
                  href={`https://${author.socials.website}`}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  color={textColor}
                  _hover={{ color: "blue.500" }}
                >
                  <LuLink size={20} />
                  <Text>{author.socials.website}</Text>
                </Link>
              </HStack>
            </VStack>
          </Flex>
        </Card>

        <Newsletter />

        <Box>
          <Heading size="lg" mb={8}>
            Latest Articles
          </Heading>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={8}
          >
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthorPage;
