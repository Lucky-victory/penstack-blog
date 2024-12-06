"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Input,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const toast = useToast({ position: "top" });

  const initialEmail = searchParams.get("email");

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || initialEmail }),
      });

      if (res.ok) {
        toast({
          title: "Verification email sent",
          description: "Please check your inbox",
          status: "success",
          duration: 5000,
        });
      } else {
        throw new Error("Failed to send verification email");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification email",
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" py={{ base: 12, md: 24 }}>
      <VStack spacing={8}>
        <VStack spacing={3} textAlign="center">
          <Heading size="xl">Verify Your Email</Heading>
          <Text color="gray.500">
            Please verify your email address to continue. Haven't received the
            email?
          </Text>
        </VStack>

        <VStack spacing={4} width="full">
          <Input
            placeholder="Enter your email"
            value={email || initialEmail || ""}
            onChange={(e) => setEmail(e.target.value)}
            size="lg"
            borderRadius="xl"
          />
          <Button
            onClick={handleResend}
            isLoading={isLoading}
            colorScheme="blue"
            size="lg"
            width="full"
            borderRadius="xl"
          >
            Resend Verification Email
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
}
