'use client'
import { Box, Flex, Image, useColorModeValue } from "@chakra-ui/react"
import {Button} from '@/src/app/components/ui/Button'
import { CldUploadWidget, CloudinaryUploadWidgetInfo, CloudinaryUploadWidgetResults, getCldImageUrl } from "next-cloudinary";
import { useState } from "react";
import isEmpty from "just-is-empty";
export const FeaturedImageCard = ({ image: { src } }: { image: { src?: string |null} }) => {
   const [_image, set_Image] = useState({ src: (src as string) || '' })
   const borderColor = useColorModeValue("gray.400", "gray.700")
   const bgColor = useColorModeValue("gray.200", "gray.900")

   return (
       <Box mb={3}>
           <Flex mb={2} borderWidth={isEmpty(_image?.src) ? "1px" : "0"} borderStyle={isEmpty(_image?.src) ? 'dashed' : 'none'} borderColor={isEmpty(_image?.src) ? borderColor : 'transparent'} bg={bgColor} rounded={"md"} h={'160px'} w={'full'} maxW={'300px'}>
               {!isEmpty(_image?.src) && (
                   <Image src={_image.src} alt={'featured image'} h={'100%'} w={'full'} objectFit={'cover'} />
               )}
           </Flex>
           <CldUploadWidget uploadPreset="post_images" onSuccess={(cldImage: CloudinaryUploadWidgetResults) => {
               set_Image({ src: getCldImageUrl({ src: (cldImage.info as CloudinaryUploadWidgetInfo).public_id }) })
           }}>
               {({ open }) => {
                   return (
                       <Button size={'xs'} onClick={() => open()} variant={'outline'}>{_image?.src ? 'Change image' : 'Add featured image'}</Button>
                   );
               }}
           </CldUploadWidget>
       </Box>
   )
}