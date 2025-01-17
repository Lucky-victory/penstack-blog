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
  LightMode,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import { LuSend } from "react-icons/lu";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import isEmpty from "just-is-empty";

export const Newsletter = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
  maxW?: string | number;
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const formWrapBgColor = "gray.900";
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
    <Box maxW={"lg"}>
      <Stack spacing={4}>
        {title && (
          <Heading size="lg" color={headingColor}>
            {title || "Get Updates"}
          </Heading>
        )}
        {description && (
          <Text color={textColor} fontSize={"small"}>
            {description ||
              "Subscribe to our newsletter to get the latest updates."}
          </Text>
        )}
        <Box w={"full"}>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={{ base: 3, md: 1 }}
              border={"1px"}
              borderColor={formWrapBorderColor}
              maxW="lg"
              bg={formWrapBgColor}
              rounded={"lg"}
              p={2}
            >
              <FormControl flex={1}>
                <Input
                  type="email"
                  p={1}
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
              <LightMode>
                <Button
                  type="submit"
                  isLoading={isPending}
                  isDisabled={isPending}
                  zIndex={2}
                  colorScheme="gray"
                  rounded={"lg"}
                  fontWeight={500}
                >
                  Subscribe
                </Button>
              </LightMode>
            </Flex>
          </form>
        </Box>
        {status === "success" && (
          <Text color="green.500" fontWeight="medium">
            🎉 Welcome aboard! Check your inbox to confirm subscription.
          </Text>
        )}
      </Stack>
    </Box>
  );
};
