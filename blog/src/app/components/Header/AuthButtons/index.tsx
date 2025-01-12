import { useAuth } from "@/src/hooks/useAuth";
import { Link } from "@chakra-ui/next-js";
import {
  Button,
  ButtonGroup,
  HStack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

export const AuthButtons = () => {
  const { user } = useAuth();
  const hoverBgLogin = useColorModeValue("blue.100", "gray.700");
  const hoverBgSignup = useColorModeValue("blue.600", "blue.400");

  return user ? (
    <></>
  ) : (
    <HStack spacing={4}>
      <Button
        rounded="md"
        variant="ghost"
        as={Link}
        href={"/auth/signin"}
        _hover={{
          textDecor: "none",
          bg: hoverBgLogin,
        }}
        py={"7px"}
        h="auto"
      >
        Log In
      </Button>
      <Button
        rounded="md"
        as={Link}
        py={2}
        h="auto"
        href={"/auth/sign-up"}
        _hover={{
          textDecor: "none",
          bg: hoverBgSignup,
        }}
      >
        Sign up
      </Button>
    </HStack>
  );
};
