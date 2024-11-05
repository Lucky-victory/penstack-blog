import { useFeaturedPost } from "@/src/hooks/useFeaturedPost";
import { formatPostPermalink, nativeFormatDate } from "@/src/utils";
import {
  Avatar,
  Box,
  Grid,
  Heading,
  HStack,
  Image,
  LinkBox,
  LinkOverlay,
  Stack,
  Tag,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import Loader from "./Loader";
import { Link } from "@chakra-ui/next-js";

export default function FeaturedPostCard() {
  const { featuredPost, loading } = useFeaturedPost();
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.300", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <LinkBox mb={12}>
      <Box
        bg={cardBgColor}
        borderRadius="3xl"
        borderWidth={1}
        borderColor={borderColor}
        boxShadow={"md"}
        transition="all 0.2s"
        _hover={{ boxShadow: "lg" }}
        minH={400}
      >
        {loading && (
          <VStack justify={"center"} height={"400"}>
            <Loader />
          </VStack>
        )}
        {featuredPost && (
          <Grid
            templateColumns={{ base: "1fr", lg: "3fr 2fr" }}
            gap={6}
            p={4}
            minH={450}
          >
            <Box position="relative" height={{ base: "300px", md: "auto" }}>
              <Image
                rounded="2xl"
                src={featuredPost?.featured_image?.url}
                alt={featuredPost?.featured_image?.alt_text}
                className="w-full h-full object-cover"
              />
            </Box>
            <VStack
              align="start"
              spacing={4}
              px={{ base: 3, lg: 6 }}
              py={{ base: 3, lg: 6 }}
              justify="space-between"
            >
              <VStack align="start">
                {featuredPost?.category?.name && (
                  <Tag
                    size="md"
                    colorScheme="blue"
                    borderRadius="md"
                    px={3}
                    py={1}
                    bg={"blue.50"}
                    color={"blue.500"}
                    textTransform={"uppercase"}
                  >
                    {featuredPost.category.name}
                  </Tag>
                )}
                <LinkOverlay href={formatPostPermalink(featuredPost)}>
                  <Heading size="2xl" mb={4}>
                    {featuredPost.title} lorem ipsum dolor sit amet
                  </Heading>
                </LinkOverlay>
                <Text color={textColor} fontSize="lg">
                  {featuredPost.summary} another summary lorem ipsum dolor
                </Text>
              </VStack>
              <HStack spacing={2}>
                <Link href={`/author/${featuredPost.author?.username}`}>
                  <Avatar
                    src={featuredPost?.author?.avatar}
                    name={featuredPost?.author?.name}
                    borderRadius="md"
                    boxSize="42px"
                  />
                </Link>
                <VStack spacing={0} align="start">
                  <Link href={`/author/${featuredPost.author?.username}`}>
                    <Text fontWeight="medium" fontSize="sm">
                      {featuredPost?.author?.name}
                    </Text>
                  </Link>
                  <Text fontSize="xs" color="gray.500">
                    {featuredPost?.published_at
                      ? nativeFormatDate(featuredPost.published_at)
                      : nativeFormatDate(featuredPost.updated_at as Date)}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Grid>
        )}
      </Box>
    </LinkBox>
  );
}
