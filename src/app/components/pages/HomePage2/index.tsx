"use client";
import React from "react";
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Tag,
  useColorModeValue,
  LinkBox,
  LinkOverlay,
  Image,
} from "@chakra-ui/react";
import PostCard from "../../../../themes/smooth-land/PostCard";
import { FeaturedPost } from "@/src/themes/raised-land/FeaturedPost";

const FrontPage2 = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const featuredPost = {
    id: 1,
    title: "Understanding React Server Components: A Deep Dive",
    summary:
      "Explore the revolutionary approach to building React applications with Server Components. Learn how they can improve your app's performance and developer experience.",
    category: { name: "React" },
    author: {
      name: "Sarah Chen",
      avatar: "https://picsum.photos/40/40",
      username: "sarahchen",
    },
    published_at: "2024-03-15",
    featured_image: {
      url: "https://picsum.photos/1200/600",
      alt_text: "React Server Components Diagram",
    },
  };

  const recentPosts = [
    {
      id: 2,
      title: "TypeScript 5.0 Features You Should Know About",
      category: { name: "TypeScript" },
      author: {
        name: "Alex Johnson",
        avatar: "https://picsum.photos/40/40",
        username: "alexj",
      },
      published_at: "2024-03-10",
      featured_image: {
        url: "https://picsum.photos/500/300",
        alt_text: "TypeScript Code",
      },
    },
    {
      id: 3,
      title: "Building Scalable APIs with GraphQL",
      category: { name: "Backend" },
      author: {
        name: "Maria Garcia",
        avatar: "https://picsum.photos/40/40",
        username: "mariag",
      },
      published_at: "2024-03-08",
      featured_image: {
        url: "https://picsum.photos/500/300",
        alt_text: "GraphQL Schema",
      },
    },
    {
      id: 4,
      title: "Modern CSS Layout Techniques",
      category: { name: "CSS" },
      author: {
        name: "David Kim",
        avatar: "https://picsum.photos/40/40",
        username: "davidk",
      },
      published_at: "2024-03-05",
      featured_image: {
        url: "https://picsum.photos/500/300",
        alt_text: "CSS Grid Layout",
      },
    },
  ];

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="7xl">
        {/* Featured Post Section */}
        <FeaturedPost />

        {/* Recent Posts Section */}
        <VStack align="start" spacing={8}>
          <Heading size="xl">Recent Articles</Heading>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={8}
            width="full"
          >
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post as any} />
            ))}
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default FrontPage2;
