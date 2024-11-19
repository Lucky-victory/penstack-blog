'use client'

import { ReactNode, useState } from "react"
import { Box, HStack, IconButton, Text, useColorModeValue } from "@chakra-ui/react"
import { LuChevronDown, LuChevronUp } from "react-icons/lu"

type SectionCardProps = {
    title: string,header?: ReactNode,footer?: ReactNode,
    children?: ReactNode;isOpen?:boolean,
}
export function SectionCard({children,header,footer,title,isOpen=true}:SectionCardProps) {
    const borderColor = useColorModeValue("gray.200", "gray.700")
    const bgColor = useColorModeValue("white", "gray.900")
const [isCardOpen, setIsCardOpen] = useState(isOpen);
const toggleCard = () =>
    setIsCardOpen(!isCardOpen)


    return (
        <Box borderWidth="1px" borderColor={borderColor} bg={bgColor} rounded={"20px"} boxShadow={'var(--card-raised)'} >
            {(header||title) && (
                <HStack justify={'space-between'}  borderBottomWidth={isCardOpen?"1px":'0'} px={4} py={2} borderBottomColor={borderColor}>
                    {title && <Text as={'span'} fontSize={'17px'} fontWeight={500}>{title}</Text>}
                    <HStack gap={2}>
                    {header}
                        <IconButton size={'xs'} onClick={()=>toggleCard()} aria-label="toggle card" icon={isCardOpen?<LuChevronUp size={20}/>:<LuChevronDown size={20}/>} variant={'ghost'} />
                      
                        </HStack> 
                </HStack>
            )}
            {isCardOpen && children}
         
            {isCardOpen && footer && (
                <HStack spacing={4} mt={4} borderTop={'1px'} borderTopColor={borderColor} px={4} py={3}>
                    {footer}
                </HStack>
            )}
        </Box>
    )
}