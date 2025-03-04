import { useFeaturedPost } from "@/src/hooks/useFeaturedPost";
import {
  Box,
  Grid,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Tag,
  useColorModeValue,
  VStack,
  Image,
  Text,
  Avatar,
  Card,
} from "@chakra-ui/react";
import { Suspense } from "react";
import { FeaturedPostSkeleton } from "./LoadingSkeleton";
import { generatePostUrl, objectToQueryParams } from "@/src/utils";

export const FeaturedPost = () => {
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const { featuredPost, loading } = useFeaturedPost();
  return (
    <Suspense fallback={<FeaturedPostSkeleton />}>
      {loading ? (
        <FeaturedPostSkeleton />
      ) : (
        featuredPost && (
          <LinkBox mb={6} mt={4}>
            <Card
              overflow="hidden"
              transition="all 0.2s"
              _hover={{ boxShadow: "lg" }}
            >
              <Grid templateColumns={{ base: "1fr", lg: "3fr 2fr" }} gap={6}>
                <Box
                  position="relative"
                  height={{ base: "250px", lg: "500px" }}
                >
                  <Image
                    src={
                      featuredPost?.featured_image?.url ||
                      `/api/og?${objectToQueryParams({
                        title: featuredPost.title,
                        date: featuredPost?.published_at
                          ? featuredPost?.published_at
                          : featuredPost?.created_at,

                        category: featuredPost?.category?.name,
                        name: featuredPost?.author?.name,
                      })}`
                    }
                    alt={featuredPost?.featured_image?.alt_text || ""}
                    w="full"
                    h="full"
                    objectFit={"cover"}
                  />
                  <Tag position="absolute" top={4} left={4} size="lg">
                    Featured
                  </Tag>
                </Box>
                <VStack align="start" spacing={4} p={6} justify="center">
                  {featuredPost.category?.name && (
                    <Tag colorScheme="purple" borderRadius="full">
                      {featuredPost.category?.name}
                    </Tag>
                  )}
                  <LinkOverlay href={`${generatePostUrl(featuredPost)}`}>
                    <Heading size="2xl" mb={2}>
                      {featuredPost.title}
                    </Heading>
                  </LinkOverlay>
                  <Text color={textColor} fontSize="lg" noOfLines={3}>
                    {featuredPost.summary}
                  </Text>
                  <HStack spacing={4} mt={4}>
                    <Avatar
                      src={featuredPost.author.avatar || ""}
                      name={featuredPost.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold">{featuredPost.author.name}</Text>
                      <Text color={textColor} fontSize="sm">
                        {new Date(
                          featuredPost.published_at as Date
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
              </Grid>
            </Card>
          </LinkBox>
        )
      )}
    </Suspense>
  );
};
