import {
  Avatar,
  HStack,
  Show,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";

export const UserInfoComp = () => {
  const { data: session } = useSession();
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const borderColor = useColorModeValue("gray.400", "gray.300");
  return (
    <Show above="lg">
      <HStack
        rounded={"full"}
        bg={bgColor}
        px={1}
        py={1}
        border={"1px"}
        borderColor={borderColor}
      >
        <Avatar
          size={"sm"}
          name={session?.user?.name}
          src={session?.user?.image}
        />
        <Stack gap={0} pr={4}>
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
    </Show>
  );
};
