'use client'
import { Box, Flex, Image, useColorModeValue,Text,Stack, IconButton, Tooltip} from "@chakra-ui/react"
import {FormLabel,FormControl} from '@/src/app/components/ui/Form'
import {Button} from '@/src/app/components/ui/Button'
import {Input} from '@/src/app/components/ui/Input'
import { CldUploadWidget, CloudinaryUploadWidgetInfo, CloudinaryUploadWidgetResults, getCldImageUrl } from "next-cloudinary";
import { ChangeEvent, useState } from "react"; 
import {LuDelete, LuPlus, LuTrash2} from 'react-icons/lu'
import isEmpty from "just-is-empty";
export const FeaturedImageCard = ({imageUrl ,onChange }: { imageUrl?: string|null,onChange:(results:{imageUrl:string,altText?:string})=>void }) => {
  const [altText,setAltText]=useState('')
  const [featuredImage,setFeaturedImage]=useState(imageUrl)
   const borderColor = useColorModeValue("gray.400", "gray.700")
   const bgColor = useColorModeValue("gray.200", "gray.900")
   const textColor = useColorModeValue('gray.500', 'gray.200');
  
   function handleCldUploadWidgetSuccess(cldUpload: CloudinaryUploadWidgetResults) {
       const _imageUrl=getCldImageUrl({ src: (cldUpload.info as CloudinaryUploadWidgetInfo).public_id }) 
       setFeaturedImage(_imageUrl)
  onChange({imageUrl:_imageUrl})
  
}
function handleAltTextInputChange( event: ChangeEvent<HTMLInputElement>) {
    const alt_text = event.target.value
    setAltText(alt_text)
 onChange({imageUrl:featuredImage as string,altText:alt_text})
}
   return (
       <Box mb={3}>
           <Flex mb={3} pos={'relative'} borderWidth={isEmpty(featuredImage) ? "1px" : "0"} borderStyle={isEmpty(featuredImage) ? 'dashed' : 'none'} borderColor={isEmpty(featuredImage) ? borderColor : 'transparent'} bg={bgColor}  rounded={"md"} h={'150px'} w={'full'} maxW={'300px'}>
               {!isEmpty(featuredImage) && (
                <>
                <Image src={featuredImage as string} alt={'featured image'} h={'100%'} w={'full'} objectFit={'cover'} />
                <Tooltip label="Remove image" hasArrow placement="top" rounded={'md'}>

                  <IconButton zIndex={9} pos='absolute' top={1} right={2} aria-label="" size={'sm'}  colorScheme="red" onClick={()=>{
                      setFeaturedImage(null)
                      onChange({imageUrl:''})
                    }}><LuTrash2/></IconButton>
                    </Tooltip>
                    </>
               )}
                 
               {isEmpty(featuredImage) &&<Stack justify={'center'} align={'center'} h={'100%'} w={'full'}>

                
                <Text px={2} display={'inline-block'} as='span' color={textColor} fontSize={'14px'} fontWeight={500} textAlign={'center'}>
No featured image (recommended size: 1200x630)
               </Text>
               </Stack>
              }
           </Flex>
           <CldUploadWidget uploadPreset="post_images" onSuccess={handleCldUploadWidgetSuccess}>
               {({ open }) => {
                   return (
                       <Button gap={2} size={'xs'} onClick={() => open()} rounded='full'   variant={'ghost'}>{!featuredImage && <LuPlus/>} <Text as='span'>{featuredImage ? 'Change image' : 'Add featured image'} </Text></Button>
                   );
               }}
           </CldUploadWidget>
           {!isEmpty(featuredImage) && (
              
               <Box borderTop={'1px'} borderTopColor={'gray.200'} mt={2} pt={2}>

           <FormControl >
<FormLabel fontSize={'sm'}>Image Alt Text:</FormLabel>
                   <Input  name='alt' value={altText} autoComplete={'off'} onChange={handleAltTextInputChange} rounded={'full'}  placeholder="Alt text" />
                   </FormControl>
           </Box>
        )}
       </Box>
   )
}