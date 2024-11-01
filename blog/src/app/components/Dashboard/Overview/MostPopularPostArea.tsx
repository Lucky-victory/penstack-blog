import { usePosts } from "@/src/hooks";
import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  HStack,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LuArrowUp, LuEye, LuTrendingUp } from "react-icons/lu";
import Loader from "../../Loader";
import { format } from "date-fns";
const samplePosts = [
  {
    id: 1,
    title:
      "This a post with a long title that is very long and will be truncated",
    slug: "post-1",
    views: 100,
    likes: 50,
    comments: 10,
    shares: 20,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: new Date(),
    author: {
      name: "John Doe",
      avatar: "https://via.placeholder.com/150",
    },
    category: {
      name: "Category 1",
      slug: "category-1",
    },
    featured_image: {
      url: "https://via.placeholder.com/150",
      alt_text: "Post 1",
      caption: "Post 1",
    },
    tags: [
      {
        name: "Tag 1",
        slug: "tag-1",
      },
      {
        name: "Tag 2",
        slug: "tag-2",
      },
    ],
  },
  {
    id: 2,
    title: "Post 2",
    slug: "post-2",
    views: 100,
    author: {
      name: "Mike Doe",
      avatar: "https://via.placeholder.com/150",
    },
    published_at: new Date("2023-01-01"),
  },
];
export default function MostPopularPosts() {
  const { posts = [], loading } = usePosts();

  return (
    <Card minH={200} rounded={"20px"}>
      <CardHeader>
        <Heading size={"md"}>Most Popular Posts</Heading>
      </CardHeader>
      <CardBody>
        {loading && (
          <VStack>
            <Loader />
          </VStack>
        )}
        {!loading && !posts.length && (
          <VStack justify={"center"}>
            <Text color={"gray.400"} fontWeight={500}>
              No posts found
            </Text>
          </VStack>
        )}
        {!loading && posts && posts?.length > 0 && (
          <Stack gap={1} divider={<StackDivider />}>
            {posts.map((post, index) => (
              <HStack
                key={post.id}
                justify={"space-between"}
                divider={<StackDivider />}
              >
                <Stack key={post.id} justify={"space-between"}>
                  <HStack>
                    <Heading size={"sm"} noOfLines={1}>
                      <Text as={"span"} color={"green.500"} mr={2}>
                        #{index + 1}
                      </Text>
                      {post.title}
                    </Heading>
                  </HStack>
                  <HStack fontSize={"small"} color={"gray.400"}>
                    <LuEye />
                    <Text>{post?.views?.count} views</Text>
                  </HStack>
                </Stack>
                <HStack>
                  <Avatar
                    size={"sm"}
                    src={post?.author?.avatar}
                    name={post?.author?.name}
                  />
                  <Stack gap={1}>
                    <Text noOfLines={1} fontWeight={500}>
                      {post?.author?.name}
                    </Text>
                    <Text fontSize={"small"} color={"gray.400"}>
                      {format(post?.published_at as Date, "dd.MM.yyyy")}
                    </Text>
                  </Stack>
                </HStack>
              </HStack>
            ))}
          </Stack>
        )}
      </CardBody>
    </Card>
  );
}
