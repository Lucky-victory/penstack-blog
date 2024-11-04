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
} from "@chakra-ui/react";
import { LuBookmark } from "react-icons/lu";

const NewsCard = ({ title, description, author, date, image }) => {
  const bgColor = useColorModeValue("white", "gray.700");

  return (
    <Stack
      borderRadius="2xl"
      overflow="hidden"
      bg={bgColor}
      position="relative"
      shadow={"md"}
      p={3}
    >
      <Image
        src={image}
        alt={title}
        w="full"
        h="200px"
        objectFit="cover"
        rounded={"2xl"}
      />

      <VStack align="stretch" flex={1} justify={"space-between"} spacing={2}>
        <Box p={2}>
          <Heading size="md" noOfLines={2}>
            {title}
          </Heading>
          <Text fontSize="sm" color="gray.500" noOfLines={2}>
            {description}
          </Text>
        </Box>

        <HStack
          justify="space-between"
          align="center"
          bg={"gray.100"}
          p={2}
          borderRadius="xl"
        >
          <HStack spacing={2}>
            <Avatar
              src="https://picsum.photos/32/32"
              name={author}
              borderRadius="md"
              boxSize="32px"
            />
            <VStack spacing={0} align="start">
              <Text fontWeight="medium" fontSize="sm">
                {author}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {date}
              </Text>
            </VStack>
          </HStack>
          <IconButton
            icon={<LuBookmark size={18} />}
            variant="ghost"
            aria-label="Bookmark"
            size="sm"
          />
        </HStack>
      </VStack>
    </Stack>
  );
};

const LatestNews = () => {
  const news = [
    {
      title: "He Sweet Science Unveiled: A Ringside Journey",
      description:
        "Step Into The Boxing Ring: Stories, Strategies, And The Unyielding Spirit Of Champions",
      author: "James",
      date: "August 18, 2023",
      image: "https://picsum.photos/400/200",
    },
    {
      title: "Hoops And Heroes: Exploring The Thrilling World of Basketball",
      description:
        "Beyond The Court: Dunking Into The Heart Of Basketball Culture And Unforgettable Moments",
      author: "Sergio",
      date: "August 07, 2023",
      image: "https://picsum.photos/400/200",
    },
    {
      title: "Beyond The Ropes: The Timeless Artistry",
      description:
        "Inside The Square Circle: A Closer Look At The Passion, Perseverance, And Glory Of Boxing",
      author: "Jonatan",
      date: "October 27, 2023",
      image: "https://picsum.photos/400/200",
    },
    {
      title: "Carving The Snow: Adventures In The World",
      description:
        "Chasing Powder Dreams: Stories From The Slopes And The Thrill Of The Snowboarder's Descent",
      author: "Lorana",
      date: "September 06, 2023",
      image: "https://picsum.photos/400/200",
    },
    {
      title: "Roaring Engines And Speed Demons",
      description:
        "Beyond The Finish Line: Exploring The Relentless Power And Precision Of Motorsports",
      author: "Admin",
      date: "June 15, 2023",
      image: "https://picsum.photos/400/200",
    },
    {
      title: "Courtside Chronicles: A Deep Dive Into The Game",
      description:
        "Bouncing Beyond Boundaries: The Passion, Precision And Power Of Professional Sports",
      author: "Admin",
      date: "June 03, 2023",
      image: "https://picsum.photos/400/200",
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
          <NewsCard key={index} {...item} />
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
