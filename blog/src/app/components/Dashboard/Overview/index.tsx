"use client";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import {
  LuArrowUp,
  LuFileStack,
  LuGroup,
  LuMessageCircle,
  LuStickyNote,
  LuTrendingDown,
  LuTrendingUp,
  LuTriangle,
  LuUserCheck,
  LuUserPlus2,
  LuUsers2,
} from "react-icons/lu";
import PostViewsChart from "./PostViewsChart";
import MostPopularPosts from "./MostPopularPostArea";
import { IconType } from "react-icons";

export const OverviewCard = ({
  color,
  label,
  icon,
  value,
  isUp,
  growthCount,
}: {
  label: string;
  value: string;
  color?: string;
  icon: IconType;
  isUp?: boolean;
  growthCount?: number;
}) => {
  return (
    <HStack
      rounded={"md"}
      bg={"white"}
      shadow={"md"}
      borderTop={"4px solid var(--chakra-colors-" + color + "-500)"}
      p={6}
      minH={"60px"}
    >
      <VStack bg={color + ".50"} p={2} rounded={"sm"}>
        <Icon as={icon} size={20} color={color + ".500"} />
      </VStack>
      <Stack gap={1}>
        <HStack gap={2}>
          <Text
            fontWeight={600}
            fontSize={"large"}
            color={color + ".500"}
            as={"span"}
          >
            {value}
          </Text>
          <Text as={"span"} fontSize={"small"}>
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
    </HStack>
  );
};
export default function Overview() {
  const bgColor = useColorModeValue("white", "gray.700");

  return (
    <Stack gap={{ base: 5, md: 6 }} py={5} px={4}>
      <Grid
        gap={6}
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(auto-fit, minmax(200px,1fr))",
        }}
      >
        <OverviewCard
          color="purple"
          label="Users"
          icon={LuUsers2}
          value="142"
          isUp
          growthCount={12}
        />
        <OverviewCard
          color="orange"
          label="Subscribers"
          icon={LuUserPlus2}
          value="32"
          isUp={false}
          growthCount={14}
        />
        <OverviewCard
          color="blue"
          label="Posts"
          icon={LuArrowUp}
          value="12"
          isUp
          growthCount={5}
        />
        <OverviewCard
          color="green"
          label="Comments"
          icon={LuMessageCircle}
          value="38"
          isUp
          growthCount={22}
        />
      </Grid>
      <Box>
        <PostViewsChart />
      </Box>
      <Box>
        <MostPopularPosts />
      </Box>
    </Stack>
  );
}
