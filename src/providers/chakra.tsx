"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { chakraTheme } from "../lib/chakra-theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={chakraTheme}>{children}</ChakraProvider>;
}
