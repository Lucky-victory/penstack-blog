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
import { FeaturedPostType } from "@/src/types";

export const FeaturedPost = ({ post }: { post: FeaturedPostType }) => {
  const textColor = useColorModeValue("gray.600", "gray.300");


  return (
    <Suspense fallback={<FeaturedPostSkeleton />}>
     
        {post && (
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
                      post?.featured_image?.url ||
                      `/api/og?${objectToQueryParams({
                        title: post?.title,
                        date: post?.published_at
                          ? post?.published_at
                          : post?.created_at,

                        category: post?.category?.name,
                        name: post?.author?.name,
                      })}`
                    }
                    alt={post?.featured_image?.alt_text || ""}
                    w="full"
                    h="full"
                    objectFit={"cover"}
                  />
                  <Tag position="absolute" top={4} left={4} size="lg">
                    Featured
                  </Tag>
                </Box>
                <VStack align="start" spacing={4} p={6} justify="center">
                  {post?.category?.name && (
                    <Tag colorScheme="purple" borderRadius="full">
                      {post?.category?.name}
                    </Tag>
                  )}
                  <LinkOverlay href={`${generatePostUrl(post)}`}>
                    <Heading size="2xl" mb={2}>
                      {post?.title}
                    </Heading>
                  </LinkOverlay>
                  <Text color={textColor} fontSize="lg" noOfLines={3}>
                    {post?.summary}
                  </Text>
                  <HStack spacing={4} mt={4}>
                    <Avatar
                      src={post?.author?.avatar || ""}
                      name={post?.author?.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold">{post?.author?.name}</Text>
                      <Text color={textColor} fontSize="sm">
                        {new Date(
                          post?.published_at as Date
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
      }
    </Suspense>
  );
};
