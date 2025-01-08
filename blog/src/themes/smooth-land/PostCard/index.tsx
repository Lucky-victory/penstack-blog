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
} from "@chakra-ui/react";
import { decode } from "html-entities";

export default function PostCard({
  post,
  showAuthor = true,
}: {
  showAuthor?: boolean;
  post: PostSelect;
}) {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const tagBgColor = useColorModeValue("blue.50", "black");
  const tagColor = useColorModeValue("blue.600", "blue.300");
  const bgColor = useColorModeValue("white", "gray.900");
  return (
    <Card
      as={LinkBox}
      key={post.id}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      shadow={"none"}
      borderRadius="xl"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ boxShadow: "0 0 0 2px var(--chakra-colors-blue-500)" }}
    >
      <Box position="relative" p={3} pb={0}>
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
          height="220"
          width="full"
          rounded={"xl"}
        />
        {post?.category && post?.category?.name && (
          <Box position="absolute" top={5} right={5}>
            <Tag
              size="md"
              top={3}
              right={3}
              colorScheme="blue"
              bg={tagBgColor}
              color={tagColor}
              borderRadius="lg"
              px={3}
              py={1}
            >
              {post?.category?.name}
            </Tag>
          </Box>
        )}
      </Box>
      <CardBody>
        <VStack align={"start"} spacing={2}>
          <LinkOverlay
            href={formatPostPermalink(post)}
            _hover={{ textDecoration: "underline" }}
          >
            <Heading size={"md"} my={2} letterSpacing={0.5}>
              {post.title}
            </Heading>
          </LinkOverlay>
          {showAuthor && (
            <Link href={`/author/${post.author?.username}`}>
              <HStack gap={3} display={"inline-flex"}>
                <Avatar
                  src={post?.author?.avatar}
                  name={post?.author?.name}
                  size="sm"
                />
                <Text
                  fontWeight="bold"
                  as={"span"}
                  _hover={{ textDecoration: "underline" }}
                >
                  {post?.author?.name}
                </Text>
              </HStack>
            </Link>
          )}
          <Text fontSize="sm" as={"span"} color="gray.500">
            {post?.published_at
              ? formatDate(new Date(post?.published_at))
              : formatDate(new Date(post?.updated_at as Date))}
          </Text>
          <Text noOfLines={3} color={textColor}>
            {post.summary || stripHtml(decode(post.content))}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
}
// TODO: fix the card being longer than the other
