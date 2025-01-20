"use client";
import { PropsWithChildren } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { Box, useColorModeValue } from "@chakra-ui/react";
import NetworkAvailabiltyCheck from "../NetworkAvailabiltyCheck";

export default function PageWrapper({
  children,
  pt = "60px",
}: PropsWithChildren<{
  pt?: string | number | Record<string, string | number>;
}>) {
  const bgColor = useColorModeValue("gray.50", "#121212");
  return (
    <NetworkAvailabiltyCheck>
      <Box bg={bgColor} minH={"var(--chakra-vh)"} pt={pt}>
        <Header />
        {children}
        <Footer />
      </Box>
    </NetworkAvailabiltyCheck>
  );
}
