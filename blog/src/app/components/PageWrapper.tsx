"use client";
import { PropsWithChildren } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Box, useColorModeValue } from "@chakra-ui/react";

export default function PageWrapper({ children }: PropsWithChildren) {
  const bgColor = useColorModeValue("gray.100", "black");
  return (
    <Box bg={bgColor}>
      <Header />
      {children}
      <Footer />
    </Box>
  );
}
