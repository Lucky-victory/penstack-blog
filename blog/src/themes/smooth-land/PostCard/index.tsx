import { PostSelect } from "@/src/types";
import { formatDate, formatPostPermalink } from "@/src/utils";
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

export default function PostCard({
  post,
  showAuthor = true,
}: {
  showAuthor?: boolean;
  post: PostSelect;
}) {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const bgColor = useColorModeValue("white", "gray.800");
  return (
    <Card
      as={LinkBox}
      key={post.id}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="3xl"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ boxShadow: "0 0 0 4px var(--chakra-colors-blue-500)" }}
    >
      <Box position="relative">
        <Image
          src={
            (post.featured_image?.url as string) ||
            "https://picsum.photos/500/400"
          }
          alt={post.featured_image?.alt_text}
          objectFit="cover"
          height="200"
          width="full"
        />
        {post?.category && post?.category?.name && (
          <Box position="absolute" top={3} right={3}>
            <Tag
              size="md"
              top={3}
              right={3}
              colorScheme="blue"
              bg={"blue.500"}
              color={"white"}
              borderRadius="full"
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
            _hover={{ textDecoration: "none" }}
          >
            <Heading size={"md"}>{post.title}</Heading>
          </LinkOverlay>
          {showAuthor && (
            <Link href={`/author/${post.author?.username}`}>
              <HStack gap={3} display={"inline-flex"}>
                <Avatar
                  src={post?.author?.avatar}
                  name={post?.author?.name}
                  size="sm"
                />
                <Text fontWeight="bold" as={"span"}>
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
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa
            delectus culpa, neque sint dignissimos atque nulla qui cum obcaecati
            voluptatibus?
            {post.summary ? post.summary : post.content}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
}
// TODO: fix the card being longer than the other
