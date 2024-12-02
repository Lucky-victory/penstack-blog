import { Link } from "@chakra-ui/next-js";
import { Button, ButtonGroup } from "@chakra-ui/react";

export const AuthButtons = () => {
  return (
    <ButtonGroup spacing={4}>
      <Button
        rounded="full"
        variant="outline"
        as={Link}
        colorScheme="blue"
        href={"/auth/signin"}
        _hover={{ textDecor: "none" }}
      >
        Sign In
      </Button>
      <Button
        rounded="full"
        colorScheme="blue"
        as={Link}
        href={"/auth/sign-up"}
        _hover={{ textDecor: "none" }}
      >
        Sign Up
      </Button>
    </ButtonGroup>
  );
};
