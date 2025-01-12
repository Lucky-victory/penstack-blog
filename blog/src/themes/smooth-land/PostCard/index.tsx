import { PostSelect } from "@/src/types";
import {
  formatDate,
  formatPostPermalink,
  objectToQueryParams,
  stripHtml,
} from "@/src/utils";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Card,
  CardBody,
  Heading,
  HStack,
  Image,
  LinkBox,
  LinkOverlay,
  Tag,
  Text,
  useColorModeValue,
  VStack,
  Avatar,
  Stack,
} from "@chakra-ui/react";
import { decode } from "html-entities";

export default function PostCard({
  post,
  showAuthor = true,
}: {
  showAuthor?: boolean;
  post: PostSelect;
}) {
  const textColor = useColorModeValue("gray.500", "gray.400");
  const tagBgColor = useColorModeValue("blackAlpha.700", "black");
  const tagColor = useColorModeValue("gray.50", "gray.300");
  const bgColor = useColorModeValue("transparent", "gray.900");
  return (
    <Card
      as={LinkBox}
      key={post.id}
      bg={bgColor}
      shadow={"none"}
      borderRadius="xl"
      overflow="hidden"
      transition="all 0.3s"
      px={3}
      _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
    >
      <Box position="relative" pb={0} rounded={"xl"} overflow={"hidden"}>
        <Image
          src={
            (post.featured_image?.url as string) ||
            `/api/og?${objectToQueryParams({
              title: post.title,
              date: post?.published_at ? post?.published_at : post?.created_at,
              username: post?.author?.username,
              avatar: post?.author?.avatar,
              name: post?.author?.name,
              category: post?.category?.name,
            })}`
          }
          alt={post.featured_image?.alt_text}
          objectFit="cover"
          height="190"
          width="full"
        />
        {post?.category && post?.category?.name && (
          <Box position="absolute" top={3} left={3}>
            <Tag
              size="sm"
              // top={3}
              // right={3}
              variant={"unstyled"}
              bg={tagBgColor}
              color={tagColor}
              borderRadius="full"
              fontWeight={"normal"}
              px={3}
              py={2}
            >
              {post?.category?.name}
            </Tag>
          </Box>
        )}
      </Box>
      <CardBody px={0} py={3} display={"flex"} flexDir={"column"}>
        <Stack flex={1}>
          <VStack align={"start"} spacing={1} flex={1}>
            <HStack mb={2}>
              <Text fontSize="small" as={"span"} color={textColor}>
                {post?.published_at
                  ? `${formatDate(new Date(post?.published_at))}`
                  : formatDate(new Date(post?.updated_at as Date))}
              </Text>
              <Box w={"1"} h={1} bg={textColor} rounded="full"></Box>
              <Text fontSize="small" as={"span"} color={textColor}>
                {post.reading_time || 1} mins read
              </Text>
            </HStack>
            <LinkOverlay
              href={formatPostPermalink(post)}
              _hover={{ textDecoration: "underline", color: "blue.500" }}
            >
              <Heading
                size={"md"}
                fontWeight={500}
                noOfLines={2}
                lineHeight={1}
              >
                {post.title}
              </Heading>
            </LinkOverlay>

            <Text noOfLines={2} color={textColor} fontSize={"small"}>
              {post.summary || stripHtml(decode(post.content))}
            </Text>
          </VStack>
          {showAuthor && (
            <Link href={`/author/${post.author?.username}`}>
              <HStack gap={3} display={"inline-flex"}>
                <Avatar
                  src={post?.author?.avatar}
                  name={post?.author?.name}
                  size="xs"
                />
                <Text
                  fontWeight="500"
                  as={"span"}
                  fontSize={"small"}
                  _hover={{ textDecoration: "underline" }}
                >
                  {post?.author?.name}
                </Text>
              </HStack>
            </Link>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
}
