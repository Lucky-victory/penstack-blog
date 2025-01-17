import {
  Card as ChakraCard,
  Flex,
  GridItem,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
  Grid,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { LuTrendingDown, LuTrendingUp } from "react-icons/lu";

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
  const bgColor = useColorModeValue("white", "gray.700");
  const iconColor = useColorModeValue("gray.500", "gray.300");
  const textColor = useColorModeValue("gray.500", "gray.300");
  const iconBg = useColorModeValue("gray.100", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  return (
    <GridItem w={"100%"}>
      <VStack
        m={0}
        align={"start"}
        p={{ base: 3, "2xl": 4 }}
        h={"179px"}
        gap={"10px"}
        rounded={"14px"}
        flex={1}
        w={"100%"}
        border={"1px"}
        borderColor={borderColor}
        bg={bgColor}
      >
        <HStack justify={"space-between"} w={"full"}>
          <Flex
            justify={"center"}
            align={"center"}
            h={10}
            w={10}
            rounded={"full"}
            border={"1px"}
            borderColor={borderColor}
          >
            <Icon as={icon} size={20} color={color + ".500"} />
          </Flex>
          {/* <Image alt="" src={isUp ? "/chart-high.svg" : "/chart-low.svg"} /> */}
        </HStack>

        <VStack align={"start"} gap={"5px"}>
          <Heading
            color={textColor}
            fontSize={"18px"}
            lineHeight={"26px"}
            fontWeight={"medium"}
          >
            {label}
          </Heading>
          <Text
            as={"span"}
            fontSize={"24px"}
            lineHeight={"32px"}
            fontWeight={"semibold"}
            color={"secondary"}
          >
            {value}
          </Text>
        </VStack>

        <HStack gap={"10px"}>
          <HStack
            bg={isUp ? "green.100" : "red.100"}
            px={2.5}
            py={1}
            gap={1}
            rounded={"full"}
            display={"inline-flex"}
            h={6}
          >
            {isUp ? (
              <LuTrendingUp color={isUp ? "green" : "red"} />
            ) : (
              <LuTrendingDown color={isUp ? "green" : "red"} />
            )}
            <Text
              as={"span"}
              fontWeight={"medium"}
              lineHeight={"16px"}
              fontSize={"12px"}
              color={isUp ? "green" : "red"}
            >
              {growthCount}%
            </Text>
          </HStack>
          <Text as={"span"} fontSize={"14px"} color={textColor}>
            vs. previous month
          </Text>
        </HStack>
      </VStack>
    </GridItem>
  );
};
