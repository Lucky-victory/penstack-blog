import { useFeaturedPost } from "@/src/hooks/useFeaturedPost";
import { formatPostPermalink } from "@/src/utils";
import {
  Avatar,
  Box,
  Grid,
  Heading,
  HStack,
  Image,
  LinkBox,
  LinkOverlay,
  Tag,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

export default function FeaturedPostCard() {
  const { featuredPost } = useFeaturedPost();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <LinkBox mb={12}>
      <Box
        bg={cardBgColor}
        borderRadius="3xl"
        overflow="hidden"
        borderWidth="1px"
        borderColor={borderColor}
        transition="all 0.2s"
        _hover={{ boxShadow: "lg" }}
      >
        {featuredPost && (
          <Grid
            templateColumns={{ base: "1fr", lg: "2fr 2fr" }}
            gap={6}
            shadow="md"
            p={4}
            minH={400}
          >
            <Box
              position="relative"
              height={{ base: "300px", md: 400, lg: "auto" }}
            >
              <Image
                rounded="2xl"
                src={featuredPost.featured_image.url}
                alt={featuredPost.featured_image.alt_text}
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
                    {featuredPost.title}
                  </Heading>
                </LinkOverlay>
                <Text color={textColor} fontSize="lg">
                  {featuredPost.summary}
                </Text>
              </VStack>
              <HStack
                spacing={4}
                mt={4}
                bg={"gray.100"}
                w={"full"}
                rounded={"xl"}
                p={3}
              >
                <Avatar
                  borderRadius={"md"}
                  boxSize={"42px"}
                  src={featuredPost.author?.avatar}
                  name={featuredPost.author?.name}
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">{featuredPost.author.name}</Text>
                  <Text color={textColor} fontSize="sm">
                    {new Date(featuredPost.published_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
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
