import { Link } from "@chakra-ui/next-js";
import { Button, ButtonGroup } from "@chakra-ui/react";

export const AuthButtons = () => {
  return (
    <ButtonGroup spacing={4}>
      <Button
        variant="outline"
        as={Link}
        colorScheme="blue"
        href={"/auth/signin"}
      >
        Sign In
      </Button>
      <Button
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
