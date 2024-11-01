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
  LuTrendingUp,
  LuTriangle,
  LuUserCheck,
} from "react-icons/lu";
import PostViewsChart from "./PostViewsChart";
import MostPopularPosts from "./MostPopularPostArea";

export default function Overview() {
  const bgColor = useColorModeValue("white", "gray.700");

  return (
    <Stack gap={{ base: 5, md: 6 }} py={5} px={4}>
      <Grid
        gap={6}
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
      >
        {["pink", "blue", "orange", "red"].map((color) => {
          return (
            <HStack
              key={color}
              rounded={"md"}
              bg={bgColor}
              shadow={"md"}
              borderTop={"4px solid var(--chakra-colors-" + color + "-500)"}
              p={6}
              minH={"60px"}
            >
              <VStack bg={"blue.50"} p={2} rounded={"sm"}>
                <Icon as={LuUserCheck} size={20} color={color + ".500"} />
              </VStack>
              <Stack gap={1}>
                <HStack gap={2}>
                  <Text
                    fontWeight={600}
                    fontSize={"large"}
                    color={color + ".500"}
                    as={"span"}
                  >
                    4534
                  </Text>
                  <Text as={"span"} fontSize={"small"}>
                    subscribers
                  </Text>
                </HStack>
                <HStack>
                  <HStack color={"green.500"} fontSize={"small"}>
                    <LuTrendingUp />{" "}
                    <Text as={"span"} fontWeight={500}>
                      +34
                    </Text>
                  </HStack>
                  <Text fontSize={"small"} as={"span"}>
                    this week
                  </Text>
                </HStack>
              </Stack>
            </HStack>
          );
        })}
      </Grid>
      <Box>
        {/* <Card rounded={"24px"}>
          <CardBody>
            <HStack justify={"space-between"}>
              <Heading size={"md"}>Post views</Heading>{" "}
              <Menu>
                <MenuButton
                  rightIcon={<ChevronDownIcon />}
                  as={Button}
                  variant={"outline"}
                  fontWeight={"normal"}
                  rounded={"full"}
                >
                  <Text as={"span"}>Last 7 days</Text>
                </MenuButton>
                <MenuList>
                  <MenuItem>7 days</MenuItem>
                  <MenuItem>30 days</MenuItem>
                  <MenuItem>All time</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </CardBody>
        </Card> */}
        <PostViewsChart />
      </Box>
      <Box>
        <MostPopularPosts />
      </Box>
    </Stack>
  );
}
