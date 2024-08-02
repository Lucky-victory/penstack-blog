'use client'
import { Box, Flex, Image, useColorModeValue,Text,Stack} from "@chakra-ui/react"
import {Button} from '@/src/app/components/ui/Button'
import { CldUploadWidget, CloudinaryUploadWidgetInfo, CloudinaryUploadWidgetResults, getCldImageUrl } from "next-cloudinary";
import { useState } from "react"; 
import {LuPlus} from 'react-icons/lu'
import isEmpty from "just-is-empty";
export const FeaturedImageCard = ({imageUrl ,onChange }: { imageUrl?: string|null,onChange:(imageUrl:string)=>void }) => {
  
   const borderColor = useColorModeValue("gray.400", "gray.700")
   const bgColor = useColorModeValue("gray.200", "gray.900")
   const textColor = useColorModeValue('gray.500', 'gray.200')
function handleCldUploadWidgetSuccess(cldUpload: CloudinaryUploadWidgetResults) {
    const _imageUrl=getCldImageUrl({ src: (cldUpload.info as CloudinaryUploadWidgetInfo).public_id }) 
    onChange(_imageUrl)
  
}

   return (
       <Box mb={3}>
           <Flex mb={2} borderWidth={isEmpty(imageUrl) ? "1px" : "0"} borderStyle={isEmpty(imageUrl) ? 'dashed' : 'none'} borderColor={isEmpty(imageUrl) ? borderColor : 'transparent'} bg={bgColor} rounded={"md"} h={'150px'} w={'full'} maxW={'300px'}>
               {!isEmpty(imageUrl) && (
                   <Image src={imageUrl as string} alt={'featured image'} h={'100%'} w={'full'} objectFit={'cover'} />
               )}
               {isEmpty(imageUrl) &&<Stack justify={'center'} align={'center'} h={'100%'} w={'full'}>

                
                <Text as='span' color={textColor} fontSize={'14px'} fontWeight={500} textAlign={'center'}>
No featured image (recommended size: 1200x630)
               </Text>
               </Stack>
              }
           </Flex>
           <CldUploadWidget uploadPreset="post_images" onSuccess={handleCldUploadWidgetSuccess}>
               {({ open }) => {
                   return (
                       <Button gap={2} size={'xs'} onClick={() => open()} rounded='full'   variant={'ghost'}>{!imageUrl && <LuPlus/>} <Text as='span'>{imageUrl ? 'Change image' : 'Add featured image'} </Text></Button>
                   );
               }}
           </CldUploadWidget>
       </Box>
   )
}