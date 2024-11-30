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
import { Link } from "@chakra-ui/next-js";
import { formatPostPermalink } from "@/src/utils";

export default function MostPopularPosts() {
  const { posts = [], loading } = usePosts({ sortBy: "popular", limit: 5 });

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
              <HStack key={post.id} justify={"space-between"}>
                <Stack key={post.id} justify={"space-between"}>
                  <HStack>
                    <Heading size={"sm"} noOfLines={1}>
                      <Link href={formatPostPermalink(post)}>
                        <Text as={"span"} color={"green.500"} mr={2}>
                          #{index + 1}
                        </Text>
                        {post.title}
                      </Link>
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
