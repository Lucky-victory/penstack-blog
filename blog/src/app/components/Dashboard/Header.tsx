import { Flex, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function DashHeader({children,isMinimized=false}:{children:ReactNode,isMinimized?:boolean}) {
return(
    <Flex
    ml={{ base: 0, md: isMinimized ? "var(--dash-sidebar-mini-w)" : "var(--dash-sidebar-w)" }}
    px={{ base: 4, md: 5 }}
    height="14" flexShrink={0}
    alignItems="center"
    bg={useColorModeValue("white", "gray.900")}
    borderBottomWidth="1px"
    borderBottomColor={useColorModeValue("gray.200", "gray.700")}
    justifyContent="space-between"
    >
   {children}
  </Flex>
)
}