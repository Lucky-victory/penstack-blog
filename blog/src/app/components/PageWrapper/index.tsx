"use client";
import { PropsWithChildren } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { Box, useColorModeValue } from "@chakra-ui/react";
import NetworkAvailabiltyCheck from "../NetworkAvailabiltyCheck";

export default function PageWrapper({ children }: PropsWithChildren) {
  const bgColor = useColorModeValue("gray.100", "black");
  return (
    <NetworkAvailabiltyCheck>
      <Box bg={bgColor} minH={"var(--chakra-vh)"}>
        <Header />
        {children}
        <Footer />
      </Box>
    </NetworkAvailabiltyCheck>
  );
}
