import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import { LuSend } from "react-icons/lu";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const bgColor = useColorModeValue("blue.50", "gray.800");
  const formWrapBgColor = useColorModeValue("white", "black");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("success");
    // Handle newsletter subscription logic here
  };

  return (
    <Box
      bg={bgColor}
      borderRadius="3xl"
      p={{ base: 4, md: 8 }}
      mb={12}
      shadow={"md"}
    >
      <VStack maxW="2xl" mx="auto" spacing={4}>
        <Heading size="lg">Subscribe to My Newsletter</Heading>
        <Text color={textColor}>
          Get the latest articles and insights delivered directly to your inbox.
          No spam, unsubscribe at any time.
        </Text>
        <Box
          bg={formWrapBgColor}
          borderRadius="2xl"
          w={"full"}
          p={{ base: 5, md: 8 }}
          mb={8}
        >
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={{ base: 4, md: 0 }}
              maxW="lg"
              mx="auto"
            >
              <FormControl flex={1}>
                <Input
                  type="email"
                  rounded={"full"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </FormControl>
              <Button
                ml={{ md: -10 }}
                type="submit"
                zIndex={2}
                colorScheme="blue"
                rounded={"full"}
                rightIcon={<LuSend size={16} />}
              >
                Subscribe
              </Button>
            </Flex>
          </form>
        </Box>
        {status === "success" && (
          <Text color="green.500">Thanks for subscribing!</Text>
        )}
      </VStack>
    </Box>
  );
};
