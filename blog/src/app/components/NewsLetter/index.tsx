import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  FormControl,
  Input,
  Button,
  Toast,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import { LuSend } from "react-icons/lu";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import isEmpty from "just-is-empty";

export const Newsletter = ({ title }: { title?: string }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const formWrapBgColor = "gray.800";
  const formWrapBorderColor = "gray.700";
  const textColor = useColorModeValue("gray.400", "gray.300");
  const headingColor = useColorModeValue("inherit", "white");
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: { email: string }) => {
      const { data } = await axios.post("/api/newsletters", values);

      return data;
    },
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (isEmpty(email)) {
        return;
      }
      await mutateAsync({ email });
      setStatus("success");
      setEmail("");
      setTimeout(() => {
        setStatus("");
      }, 5000);
    } catch (error) {}
  };

  return (
    <Box>
      <VStack maxW="2xl" mx="auto" spacing={4}>
        <Heading size="lg" color={headingColor}>
          {title || "Subscribe to Our Newsletter"}
        </Heading>
        <Text color={textColor}>
          Get the latest articles and insights delivered directly to your inbox.
          No spam, unsubscribe at any time.
        </Text>
        <Box
          w={"full"}

          // mb={8}
        >
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={{ base: 4, md: 1 }}
              border={"1px"}
              borderColor={formWrapBorderColor}
              maxW="lg"
              mx="auto"
              bg={formWrapBgColor}
              rounded={"lg"}
              p={2}
            >
              <FormControl flex={1}>
                <Input
                  type="email"
                  p={2}
                  rounded={"none"}
                  fontWeight={"normal"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  border={"none"}
                  _focus={{
                    outline: "none",
                    boxShadow: "none",
                    borderBottom: "2px solid",
                  }}
                />
              </FormControl>
              <Button
                // ml={{ md: -10 }}
                type="submit"
                isLoading={isPending}
                isDisabled={isPending}
                zIndex={2}
                colorScheme="blue"
                rounded={"lg"}
                fontWeight={500}
              >
                Subscribe
              </Button>
            </Flex>
          </form>
        </Box>
        {status === "success" && (
          <Text color="green.500" fontWeight="medium">
            🎉 Welcome aboard! Check your inbox to confirm subscription.
          </Text>
        )}
      </VStack>
    </Box>
  );
};
