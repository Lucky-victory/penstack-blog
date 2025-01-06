"use client";
import {
  Box,
  Card,
  CardBody,
  Grid,
  HStack,
  Icon,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import {
  LuFileStack,
  LuMessageCircle,
  LuTrendingDown,
  LuTrendingUp,
  LuUserPlus2,
  LuUsers2,
} from "react-icons/lu";
import PostViewsChart from "./PostViewsChart";
import MostPopularPosts from "./MostPopularPostArea";
import { IconType } from "react-icons";
import DashHeader from "../../../Dashboard/Header";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const OverviewCard = ({
  color,
  label,
  icon,
  value,
  isUp,
  growthCount,
  isLoading,
}: {
  label: string;
  value: string | number;
  color?: string;
  icon: IconType;
  isUp?: boolean;
  growthCount?: number;
  isLoading?: boolean;
}) => {
  return (
    <Card>
      <HStack
        rounded={"md"}
        bg={useColorModeValue("white", "gray.700")}
        borderTop={"4px solid var(--chakra-colors-" + color + "-500)"}
        p={6}
        minH={"60px"}
      >
        <VStack bg={color + ".100"} p={2} rounded={"full"}>
          <Icon as={icon} size={20} color={color + ".500"} />
        </VStack>
        <Skeleton isLoaded={!isLoading}>
          <Stack gap={1}>
            <HStack gap={2}>
              <Text
                fontWeight={600}
                fontSize={{ base: "lg", md: "x-large", lg: "xx-large" }}
                color={color + ".500"}
                as={"span"}
              >
                {value}
              </Text>
              <Text as={"span"} fontSize={"small"} fontWeight={500}>
                {label}
              </Text>
            </HStack>
            <HStack>
              {isUp ? (
                <HStack color={"green.500"} fontSize={"small"}>
                  <LuTrendingUp />{" "}
                  <Text as={"span"} fontWeight={500}>
                    +{growthCount} this week
                  </Text>
                </HStack>
              ) : (
                <HStack color={"red.500"} fontSize={"small"}>
                  <LuTrendingDown />{" "}
                  <Text as={"span"} fontWeight={500}>
                    -{growthCount} this week
                  </Text>
                </HStack>
              )}
            </HStack>
          </Stack>
        </Skeleton>
      </HStack>
    </Card>
  );
};
export default function Overview() {
  const bgColor = useColorModeValue("white", "gray.700");

  const { data: usersOverview, isLoading: isUsersLoading } = useQuery({
    staleTime: 1000 * 60 * 60 * 24,
    queryKey: ["overview_users"],
    queryFn: async () => {
      const { data } = await axios<{
        total: number;
        weeklyGrowth: number;
        isUp: boolean;
      }>("/api/analytics/overview/users");
      return data;
    },
  });
  const { data: postsOverview, isLoading: isPostsLoading } = useQuery({
    staleTime: 1000 * 60 * 60 * 24,
    queryKey: ["overview_posts_views"],
    queryFn: async () => {
      const { data } = await axios<{
        total: number;
        weeklyGrowth: number;
        isUp: boolean;
      }>("/api/analytics/overview/posts");
      return data;
    },
  });
  const { data: commentsOverview, isLoading: isCommentLoading } = useQuery({
    staleTime: 1000 * 60 * 60 * 24,
    queryKey: ["overview_comments"],
    queryFn: async () => {
      const { data } = await axios<{
        total: number;
        weeklyGrowth: number;
        isUp: boolean;
      }>("/api/analytics/overview/comments");
      return data;
    },
  });
  const { data: subscribersOverview, isLoading: isSubscriberLoading } =
    useQuery({
      staleTime: 1000 * 60 * 60 * 24,
      queryKey: ["overview_subscribers"],
      queryFn: async () => {
        const { data } = await axios<{
          total: number;
          weeklyGrowth: number;
          isUp: boolean;
        }>("/api/analytics/overview/subscribers");
        return data;
      },
    });
  return (
    <Box>
      <DashHeader></DashHeader>
      <Stack gap={{ base: 5, md: 6 }} py={5} px={4}>
        <Grid gap={6} templateColumns={"repeat(auto-fit, minmax(230px,1fr))"}>
          <OverviewCard
            isLoading={isUsersLoading}
            color="purple"
            label="Users"
            icon={LuUsers2}
            value={usersOverview?.total || 0}
            isUp={usersOverview?.isUp}
            growthCount={usersOverview?.weeklyGrowth || 0}
          />
          <OverviewCard
            color="orange"
            label="Subscribers"
            isLoading={isSubscriberLoading}
            icon={LuUserPlus2}
            value={subscribersOverview?.total || 0}
            isUp={subscribersOverview?.isUp}
            growthCount={subscribersOverview?.weeklyGrowth}
          />
          <OverviewCard
            color="blue"
            isLoading={isPostsLoading}
            label="Posts"
            icon={LuFileStack}
            value={postsOverview?.total || 0}
            isUp={postsOverview?.isUp}
            growthCount={postsOverview?.weeklyGrowth}
          />
          <OverviewCard
            color="green"
            isLoading={isCommentLoading}
            label="Comments"
            icon={LuMessageCircle}
            value={commentsOverview?.total || 0}
            isUp={commentsOverview?.isUp}
            growthCount={commentsOverview?.weeklyGrowth}
          />
        </Grid>
        <Box>
          <PostViewsChart />
        </Box>
        <Box>
          <MostPopularPosts />
        </Box>
      </Stack>
    </Box>
  );
}
