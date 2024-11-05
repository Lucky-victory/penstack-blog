"use client";
import React from "react";
import {
  Box,
  Grid,
  Heading,
  Text,
  Image,
  HStack,
  VStack,
  Badge,
  IconButton,
  useColorModeValue,
  Stack,
  Avatar,
  Tag,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { LuBookmark } from "react-icons/lu";
import NewPostCard from "../NewPostCard";

const LatestNews = () => {
  const news = [
    {
      title: "The Sweet Science Unveiled: A Ringside Journey",
      content:
        "Step Into The Boxing Ring: Stories, Strategies, And The Unyielding Spirit Of Champions",
      summary:
        "Step Into The Boxing Ring: Stories, Strategies, And The Unyielding Spirit Of Champions",
      featured_image: {
        url: "https://picsum.photos/400/200",
        alt_text: "Boxing ring journey",
      },
      category: {
        name: "boxing",
      },
      author: {
        name: "James",
        avatar: "https://picsum.photos/32/32",
      },
      published_at: "2023-08-18",
      updated_at: "2023-08-18",
    },
    {
      title: "Hoops And Heroes: Exploring The Thrilling World of Basketball",
      content:
        "Beyond The Court: Dunking Into The Heart Of Basketball Culture And Unforgettable Moments",
      summary:
        "Beyond The Court: Dunking Into The Heart Of Basketball Culture And Unforgettable Moments",
      featured_image: {
        url: "https://picsum.photos/400/200",
        alt_text: "Basketball culture",
      },
      category: {
        name: "basketball",
      },
      author: {
        name: "Sergio",
        avatar: "https://picsum.photos/32/32",
      },
      published_at: "2023-08-07",
      updated_at: "2023-08-07",
    },
    {
      title: "Beyond The Ropes: The Timeless Artistry",
      content:
        "Inside The Square Circle: A Closer Look At The Passion, Perseverance, And Glory Of Boxing",
      summary:
        "Inside The Square Circle: A Closer Look At The Passion, Perseverance, And Glory Of Boxing",
      featured_image: {
        url: "https://picsum.photos/400/200",
        alt_text: "Boxing artistry",
      },
      category: {
        name: "boxing",
      },
      author: {
        name: "Jonatan",
        avatar: "https://picsum.photos/32/32",
      },
      published_at: "2023-10-27",
      updated_at: "2023-10-27",
    },
    {
      title: "Carving The Snow: Adventures In The World",
      content:
        "Chasing Powder Dreams: Stories From The Slopes And The Thrill Of The Snowboarder's Descent",
      summary:
        "Chasing Powder Dreams: Stories From The Slopes And The Thrill Of The Snowboarder's Descent",
      featured_image: {
        url: "https://picsum.photos/400/200",
        alt_text: "Snowboarding adventures",
      },
      category: {
        name: "snowboarding",
      },
      author: {
        name: "Lorana",
        avatar: "https://picsum.photos/32/32",
      },
      published_at: "2023-09-06",
      updated_at: "2023-09-06",
    },
    {
      title: "Roaring Engines And Speed Demons",
      content:
        "Beyond The Finish Line: Exploring The Relentless Power And Precision Of Motorsports",
      summary:
        "Beyond The Finish Line: Exploring The Relentless Power And Precision Of Motorsports",
      featured_image: {
        url: "https://picsum.photos/400/200",
        alt_text: "Motorsports",
      },
      category: {
        name: "motorsports",
      },
      author: {
        name: "Admin",
        avatar: "https://picsum.photos/32/32",
      },
      published_at: "2023-06-15",
      updated_at: "2023-06-15",
    },
    {
      title: "Courtside Chronicles: A Deep Dive Into The Game",
      content:
        "Bouncing Beyond Boundaries: The Passion, Precision And Power Of Professional Sports",
      summary:
        "Bouncing Beyond Boundaries: The Passion, Precision And Power Of Professional Sports",
      featured_image: {
        url: "https://picsum.photos/400/200",
        alt_text: "Basketball chronicles",
      },
      category: {
        name: "basketball",
      },
      author: {
        name: "Admin",
        avatar: "https://picsum.photos/32/32",
      },
      published_at: "2023-06-03",
      updated_at: "2023-06-03",
    },
  ];
  return (
    <Box maxW="7xl" mx="auto" px={4} py={8} bg={"gray.100"}>
      <Heading mb={8} size="lg">
        Latest News
      </Heading>
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
      >
        {news.map((item, index) => (
          <NewPostCard key={index} post={item} />
        ))}
      </Grid>

      <Box
        mt={8}
        p={6}
        borderRadius="lg"
        bgGradient="linear(to-r, blue.500, purple.500)"
        color="white"
        position="relative"
        overflow="hidden"
      >
        <Heading size="lg" mb={2}>
          Discover the member
        </Heading>
        <Heading size="xl" mb={4}>
          Benefits of USA cycling!
        </Heading>
        <Badge colorScheme="whiteAlpha">Debits - 03 June 2023</Badge>
      </Box>
    </Box>
  );
};

export default LatestNews;
