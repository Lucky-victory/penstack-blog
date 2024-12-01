import { useFeaturedPost } from "@/src/hooks/useFeaturedPost";
import {
  formatPostPermalink,
  nativeFormatDate,
  objectToQueryParams,
  stripHtml,
} from "@/src/utils";
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
import Loader from "../../../app/components/Loader";
import { decode } from "html-entities";

export default function FeaturedPostCard() {
  const { featuredPost, loading } = useFeaturedPost();
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.300", "gray.700");
  const textColor = useColorModeValue("white", "white");

  return (
    <Box
      mt={2}
      bg={cardBgColor}
      rounded="3xl"
      overflow={"hidden"}
      borderWidth={2}
      borderColor={borderColor}
      transition="all 0.2s"
      pos={"relative"}
      h={{ base: "auto", md: 500, lg: 600 }}
      minH={450}
    >
      {loading && (
        <VStack justify={"center"} height={"400"}>
          <Loader />
        </VStack>
      )}
      {!loading && featuredPost && (
        <>
          <Box position="absolute" h={"full"} w={"full"}>
            <Image
              w={"full"}
              h={"full"}
              objectFit={"cover"}
              src={
                featuredPost?.featured_image?.url ||
                `/api/og?${objectToQueryParams({
                  title: featuredPost.title,
                  date: featuredPost?.published_at
                    ? featuredPost?.published_at
                    : featuredPost?.created_at,
                  username: featuredPost?.author?.username,
                  avatar: featuredPost?.author?.avatar,
                  name: featuredPost?.author?.name,
                  category: featuredPost?.category?.name,
                })}`
              }
              alt={featuredPost?.featured_image?.alt_text || ""}
            />
          </Box>
          <Stack
            justify={"flex-end"}
            pos={"relative"}
            // zIndex={20}
            h={"full"}
            minH={450}
            backgroundImage="linear-gradient(130deg, transparent, rgba(0, 0, 0, 1))"
          >
            <VStack
              align="start"
              spacing={4}
              px={{ base: 3, sm: 6, lg: 8 }}
              py={{ base: 3, sm: 6, lg: 8 }}
              justify="space-between"
            >
              <VStack align="start" maxW={900}>
                {/* {featuredPost?.category?.name && (
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
                )} */}
                <Box>
                  <Text color={textColor} fontWeight={500} fontSize={"large"}>
                    Featured
                  </Text>
                </Box>
                <LinkOverlay href={formatPostPermalink(featuredPost)}>
                  <Heading color={"white"} size="2xl" mb={4}>
                    {featuredPost.title}
                  </Heading>
                </LinkOverlay>
                <Text color={textColor} fontSize="lg" noOfLines={3}>
                  {featuredPost.summary ||
                    stripHtml(decode(featuredPost.content))}
                </Text>
              </VStack>
              {/* <HStack spacing={2}>
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
              </HStack> */}
            </VStack>
          </Stack>
        </>
      )}
    </Box>
  );
}
