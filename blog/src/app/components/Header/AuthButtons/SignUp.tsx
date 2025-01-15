import { Link } from "@chakra-ui/next-js";
import { Button, useColorModeValue } from "@chakra-ui/react";

export const SignUp = () => {
  const hoverBgSignup = useColorModeValue("blue.600", "blue.400");

  return (
    <Button
      rounded="md"
      as={Link}
      py={2}
      size={{ base: "xs", lg: "sm" }}
      h="auto"
      href={"/auth/sign-up"}
      _hover={{
        textDecor: "none",
        bg: hoverBgSignup,
      }}
    >
      Sign up
    </Button>
  );
};
