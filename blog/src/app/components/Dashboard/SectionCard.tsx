'use client'

import { ReactNode } from "react"
import { Box, HStack, Text, useColorModeValue } from "@chakra-ui/react"

type SectionCardProps = {
    title: string,header?: ReactNode,footer?: ReactNode,
    children?: ReactNode
}
export function SectionCard({children,header,footer,title}:SectionCardProps) {

    return       <Box borderWidth="1px"  borderColor={useColorModeValue("gray.200", "gray.700")}   bg={useColorModeValue("white", "gray.900")} rounded={"md"}>
        {(header||title) &&  <Box borderBottomWidth="1px" px={4} py={2}
    // eslint-disable-next-line react-hooks/rules-of-hooks
    borderBottomColor={useColorModeValue("gray.200", "gray.700")} >
                  {title &&   <Text as={'span'} fontSize={'17px'} fontWeight={500}>{title}</Text>}

{header}
    </Box>}
    
{children}
{footer && 
     // eslint-disable-next-line react-hooks/rules-of-hooks
     <HStack spacing={4} mt={4} borderTop={'1px'} borderTopColor={useColorModeValue("gray.200", "gray.700")} px={4} py={3}>
{footer}
     </HStack>
}
 </Box>
}