import { useAuth } from "@/src/hooks/useAuth";
import { Link } from "@chakra-ui/next-js";
import {
  Button,
  ButtonGroup,
  HStack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { SignUp } from "./SignUp";

export const AuthButtons = () => {
  const { user } = useAuth();
  const hoverBgLogin = useColorModeValue("blue.100", "gray.700");

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
      <SignUp />
    </HStack>
  );
};
