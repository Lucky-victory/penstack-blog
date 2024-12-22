import { useAuth } from "@/src/hooks/useAuth";
import { Link } from "@chakra-ui/next-js";
import { Button, ButtonGroup, HStack } from "@chakra-ui/react";

export const AuthButtons = () => {
  const { user } = useAuth();
  return user ? (
    <></>
  ) : (
    <HStack spacing={4}>
      <Button
        rounded="md"
        variant="outline"
        as={Link}
        colorScheme="blue"
        href={"/auth/signin"}
        _hover={{ textDecor: "none" }}
        py={"7px"}
        h="auto"
      >
        Log In
      </Button>
      <Button
        rounded="md"
        colorScheme="blue"
        as={Link}
        py={2}
        h="auto"
        href={"/auth/sign-up"}
        _hover={{ textDecor: "none" }}
      >
        Sign up
      </Button>
    </HStack>
  );
};
