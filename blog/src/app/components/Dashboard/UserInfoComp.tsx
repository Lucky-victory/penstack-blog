import {
  Avatar,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";

export const UserInfoComp = () => {
  const { data: session } = useSession();
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const borderColor = useColorModeValue("gray.500", "gray.300");
  return (
    <HStack
      rounded={"full"}
      bg={bgColor}
      pl={2}
      py={1}
      pr={4}
      border={"1px"}
      borderColor={borderColor}
    >
      <Avatar
        size={"sm"}
        name={session?.user?.name}
        src={session?.user?.image}
      />
      <Stack gap={0}>
        <Text as={"span"} fontSize={"small"} fontWeight={500}>
          {session?.user?.name}
        </Text>
        <Text
          as={"span"}
          color={borderColor}
          fontSize={"x-small"}
          textTransform={"lowercase"}
        >
          {session?.user?.email}
        </Text>
      </Stack>
    </HStack>
  );
};
