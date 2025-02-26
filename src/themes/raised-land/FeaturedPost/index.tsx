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
} from "@chakra-ui/react";
import { Suspense } from "react";
import { FeaturedPostSkeleton } from "./LoadingSkeleton";
import { objectToQueryParams } from "@/src/utils";

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
              <Grid templateColumns={{ base: "1fr", lg: "3fr 2fr" }} gap={6}>
                <Box position="relative" height={{ base: "300px", lg: "auto" }}>
                  <Image
                    src={
                      featuredPost?.featured_image?.url ||
                      `/api/og?${objectToQueryParams({
                        title: featuredPost.title,
                        date: featuredPost?.published_at
                          ? featuredPost?.published_at
                          : featuredPost?.created_at,

                        category: featuredPost?.category?.name,
                      })}`
                    }
                    alt={featuredPost?.featured_image?.alt_text || ""}
                    className="w-full h-full object-cover"
                  />
                  <Tag position="absolute" top={4} left={4} size="lg">
                    Featured
                  </Tag>
                </Box>
                <VStack align="start" spacing={4} p={6} justify="center">
                  <Tag colorScheme="purple" borderRadius="full">
                    {featuredPost.category?.name}
                  </Tag>
                  <LinkOverlay href={`/post/${featuredPost.id}`}>
                    <Heading size="2xl" mb={4}>
                      {featuredPost.title}
                    </Heading>
                  </LinkOverlay>
                  <Text color={textColor} fontSize="lg">
                    {featuredPost.summary}
                  </Text>
                  <HStack spacing={4} mt={4}>
                    <Avatar
                      src={featuredPost.author.avatar}
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
            </Box>
          </LinkBox>
        )
      )}
    </Suspense>
  );
};
