'use client'

import { ReactNode } from "react"
import { Box, HStack, Text, useColorModeValue } from "@chakra-ui/react"

type SectionCardProps = {
    title: string,header?: ReactNode,footer?: ReactNode,
    children?: ReactNode
}
export function SectionCard({children,header,footer,title}:SectionCardProps) {
    const borderColor = useColorModeValue("gray.200", "gray.700")
    const bgColor = useColorModeValue("white", "gray.900")

    return (
        <Box borderWidth="1px" borderColor={borderColor} bg={bgColor} rounded={"md"}>
            {(header||title) && (
                <Box borderBottomWidth="1px" px={4} py={2} borderBottomColor={borderColor}>
                    {title && <Text as={'span'} fontSize={'17px'} fontWeight={500}>{title}</Text>}
                    {header}
                </Box>
            )}
            {children}
            {footer && (
                <HStack spacing={4} mt={4} borderTop={'1px'} borderTopColor={borderColor} px={4} py={3}>
                    {footer}
                </HStack>
            )}
        </Box>
    )
}