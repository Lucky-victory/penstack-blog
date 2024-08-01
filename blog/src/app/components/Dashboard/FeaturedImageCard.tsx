'use client'
import { Box, Flex, Image, useColorModeValue,Text,Stack} from "@chakra-ui/react"
import {Button} from '@/src/app/components/ui/Button'
import { CldUploadWidget, CloudinaryUploadWidgetInfo, CloudinaryUploadWidgetResults, getCldImageUrl } from "next-cloudinary";
import { useState } from "react"; 
import {LuPlus} from 'react-icons/lu'
import isEmpty from "just-is-empty";
export const FeaturedImageCard = ({ image: { src } }: { image: { src?: string |null} }) => {
   const [_image, set_Image] = useState({ src: (src as string) || '' })
   const borderColor = useColorModeValue("gray.400", "gray.700")
   const bgColor = useColorModeValue("gray.200", "gray.900")
   const textColor = useColorModeValue('gray.500', 'gray.200')

   return (
       <Box mb={3}>
           <Flex mb={2} borderWidth={isEmpty(_image?.src) ? "1px" : "0"} borderStyle={isEmpty(_image?.src) ? 'dashed' : 'none'} borderColor={isEmpty(_image?.src) ? borderColor : 'transparent'} bg={bgColor} rounded={"md"} h={'150px'} w={'full'} maxW={'300px'}>
               {!isEmpty(_image?.src) && (
                   <Image src={_image.src} alt={'featured image'} h={'100%'} w={'full'} objectFit={'cover'} />
               )}
               {isEmpty(_image?.src) &&<Stack justify={'center'} align={'center'} h={'100%'} w={'full'}>

                
                <Text as='span' color={textColor} fontSize={'14px'} fontWeight={500} textAlign={'center'}>
No featured image (recommended size: 1200x630)
               </Text>
               </Stack>
              }
           </Flex>
           <CldUploadWidget uploadPreset="post_images" onSuccess={(cldImage: CloudinaryUploadWidgetResults) => {
               set_Image({ src: getCldImageUrl({ src: (cldImage.info as CloudinaryUploadWidgetInfo).public_id }) })
           }}>
               {({ open }) => {
                   return (
                       <Button gap={2} size={'xs'} onClick={() => open()} rounded='full'   variant={'ghost'}>{!_image?.src && <LuPlus/>} <Text as='span'>{_image?.src ? 'Change image' : 'Add featured image'} </Text></Button>
                   );
               }}
           </CldUploadWidget>
       </Box>
   )
}