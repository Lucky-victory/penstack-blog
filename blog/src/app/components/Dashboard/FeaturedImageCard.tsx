'use client'
import { Box, Flex, Image, useColorModeValue } from "@chakra-ui/react"
import {Button} from '@/src/app/components/ui/Button'
import { CldUploadWidget, CloudinaryUploadWidgetInfo, CloudinaryUploadWidgetResults, getCldImageUrl } from "next-cloudinary";
import { useState } from "react";
export const FeaturedImageCard=()=>{
    const [image,setImage]=useState({src:'https://images.unsplash.com/photo-1593642532813-67797897989c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'})
    return(
        <Box>

        <Flex borderWidth="1px"  borderColor={useColorModeValue("gray.200", "gray.700")}   bg={useColorModeValue("white", "gray.900")} rounded={"md"} h={'180px'} w={'full'} maxW={'300px'}>
           <Image src={image?.src} alt={'featured image'} h={'100%'} w={'full'} objectFit={'cover'}/>
        </Flex>
        <CldUploadWidget uploadPreset="post_images" onSuccess={(image: CloudinaryUploadWidgetResults) => {
         setImage({ src: getCldImageUrl({ src: (image.info as CloudinaryUploadWidgetInfo).public_id }) })
        }}>
          {({ open }) => {
            return (
             
        <Button size={'sm'} onClick={()=>open()} variant={'outline'}>add featured image</Button>
            );
          }}
        </CldUploadWidget>

        <Button size={'sm'} variant={'outline'}>change image</Button>
        </Box>
    )
}