import { Flex, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";
import {Avatar} from '@/src/app/components/ui/Avatar'

export default function DashHeader({children, isMinimized = false, showUserAvatar = false, ...rest}: {
    children: ReactNode,
    isMinimized?: boolean,
    showUserAvatar?: boolean,
    [key: string]: any
}) {
    return(
      <Flex 
        // ml={{ base: 0, md: isMinimized ? "var(--dash-sidebar-mini-w)" : "var(--dash-sidebar-w)" }}
        px={{ base: 4, md: 5 }}
        py={2}
        minH="12" maxH={'var(--dash-header-h)'}
        flexShrink={0}
        alignItems="center"
        bg={useColorModeValue("white", "gray.900")}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue("gray.200", "gray.700")}
        justifyContent="space-between"
        {...rest}
      >
        {children}
        {showUserAvatar && <Avatar name='0' src=''/>}
      </Flex>
    )
}