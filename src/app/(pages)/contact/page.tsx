"use client";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

import PageWrapper from "@/src/app/components/PageWrapper";
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";

import { useState } from "react";

export default function ContactPage() {
  const toast = useToast({ duration: 5000, isClosable: true, position: "top" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("/api/contact", formData);

      toast({
        title: "Message sent",
        description: "We'll get back to you soon!",
        status: "success",
      });

      // Reset form
      setFormData({ name: "", email: "", message: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to send message",
        status: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <PageWrapper>
      <Container maxW="container.md" py={{ base: 8, md: 16 }}>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={4}>
              Get in Touch
            </Heading>
            <Text
              fontSize="lg"
              color={useColorModeValue("gray.600", "gray.400")}
            >
              Have questions or feedback? We&apos;d love to hear from you.
            </Text>
          </Box>

          <Box
            as="form"
            onSubmit={handleSubmit}
            bg={bgColor}
            p={8}
            rounded="lg"
            shadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  rounded="md"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  rounded="md"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Message</FormLabel>
                <Textarea
                  placeholder="Your message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={6}
                  rounded="md"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="brand"
                size="lg"
                width="full"
                rounded="full"
                isLoading={isSubmitting}
              >
                Send Message
              </Button>
              ;
            </VStack>
          </Box>
        </VStack>
      </Container>
    </PageWrapper>
  );
}
