'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Box, Button, Input, Flex, useColorModeValue, Stack, Text, useDisclosure ,Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton} from '@chakra-ui/react'

import { LuSettings } from 'react-icons/lu'
import TextEditor from '@/src/app/components/TextEditor'
import slugify from'slugify'
import { debounce, formatDate, shortenText, shortIdGenerator } from '@/src/utils'
import { PostInsert } from '@/src/types'
import { useAutoSave, useQueryParams } from '@/src/hooks'
import DashHeader from '@/src/app/components/Dashboard/Header'
import { SidebarContent } from '@/src/app/components/Dashboard/NewPostPageSidebar'
import { useFormik } from 'formik'
// import { debounce } from 'lodash'

const META_DESCRIPTION_LENGTH = 155


export default function NewPostPage() {
    const [editorCounts,setEditorCounts] = useState({words:0,characters:0})
    const [isSaving,setIsSaving] = useState(false)
    const {queryParams,setQueryParam}=useQueryParams();
    // console.log({queryParams});
    const randomNum=useMemo(()=>shortIdGenerator.bigIntId().substring(6,12),[])
    const formik=useFormik({initialValues:{
        title:'',
        slug:'',
        summary:'',visibility:'public',
        content:'',featured_image:{src:'',alt_text:''},status:'draft','post_id':'',updated_at:new Date(),

    } as PostInsert,onSubmit:async (values) => {
        const {title,slug,summary,visibility,content,featured_image,status,post_id,updated_at} = values
        const post:PostInsert = {
            title,
            slug,
            summary,
            visibility,
            content,
            featured_image,
            status,
            post_id,
            updated_at,author_id:4,
        }
        console.log({post})
    },

    })
 
    const [categories, setCategories] = useState<{name:string,id?:number}[]>([])
    const [tags, setTags] = useState<{name:string}[]>([])
  
    const { isOpen, onOpen, onClose } = useDisclosure()
const updatePost = (updates:Partial<PostInsert>) => formik.setValues({...formik.values,...updates});

  
    useEffect(() => {
        if((formik.values?.title as string)?.length >0 && (formik.values?.title as string)?.length <= 60){
            const generatedSlug = slugify(formik.values.title+'-'+randomNum, { lower: true, strict: true });
          updatePost({slug:generatedSlug})
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formik.values.title])




    const handleContentChange = (content:{html?:string,markdown:string,text:string}) => {
        updatePost({content:content.markdown})
        if(content.text.length <= META_DESCRIPTION_LENGTH){
            updatePost({summary:content.text})
            // formik.setFieldValue('summary',shortenText(content.text,META_DESCRIPTION_LENGTH))
        }
// formik.setFieldValue('content',content.markdown);
}
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const getEditorCounts=(counts:{words:number,characters:number})=>{
        setEditorCounts(counts)
    }
 const debouncedSavePost = useCallback(
  debounce(async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formik.values),
      });
      const data = await response.json();
      console.log({ data });
      setIsSaving(false);
      formik.setValues({ ...data });
      return data;
    } catch (error) {
      setIsSaving(false);
      return null;
    }
  }, 1000),
  []
);

useEffect(()=>{
console.log({...formik.values}); 
// debouncedSavePost();

},[debouncedSavePost, formik.values])
    return (
        <Box h='full'  overflowY={'auto'}>
            <DashHeader pos='sticky' top={0} zIndex={10} >
            <Stack gap={0} >
                <Text fontSize={'2xl'} fontWeight={600} as='span'>Create Post</Text>
                <Text as='span' fontSize='sm' color={'gray.500'}>Last updated: {formik?.values.updated_at ? formatDate(new Date(formik.values.updated_at as Date)):'Not saved yet'+formik.values.updated_at} </Text>
            </Stack>
            <Button onClick={onOpen} leftIcon={<LuSettings />} display={{ base: 'flex', lg: 'none' }}>Settings</Button>
        </DashHeader>


        <Flex  gap={3} py={4}  px={3}> 
            <Stack maxH={'calc(var(--chakra-vh) - (var(--dash-header-h) + 32px))'}  flex={1} minW={350} pos='sticky' top={'calc(var(--dash-header-h) + 16px)'}  width={{ base: '100%' }} bg={useColorModeValue('white','gray.900')}  border={'1px'} borderColor={borderColor} rounded={{base:'xl',md:'26px'}} boxShadow={'var(--card-raised)'}>
                <Box borderBottom={'1px'} borderBottomColor={borderColor} p={1} py={2}>


                <Input border={'none'} outline={'none'} autoComplete='off'
                    placeholder="Awesome title" name={'title'}
                    value={formik.values.title as string} fontWeight={600}
                    onChange={formik.handleChange}
                 rounded={'none'} _focus={{boxShadow: 'none'}}
                fontSize={{ base: 'lg', md: '24px' }}
                    />
                    </Box>
                
               <TextEditor getCounts={getEditorCounts} onContentChange={(content) => handleContentChange(content)} initialValue={formik.values.content+''} />
            </Stack>
            
            <Box display={{ base: 'none', lg: 'block' }} maxW={280}>
               <SidebarContent
                           formik={formik}
                            updatePost={updatePost}
                            categories={categories}
                            setCategories={setCategories}
                            tags={tags}
                            setTags={setTags}
                            isSaving={isSaving}
                            editorCounts={editorCounts}                />
            </Box>
        </Flex>

        <Drawer isOpen={isOpen} placement="right"  onClose={onClose} size="xs">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Post Settings</DrawerHeader>
                <DrawerBody px={2}>
                    <SidebarContent 
                        formik={formik}
                            updatePost={updatePost}
                            categories={categories}
                            setCategories={setCategories}
                            tags={tags}
                            setTags={setTags}
                            isSaving={isSaving}
                            editorCounts={editorCounts}                   />
                </DrawerBody>
            </DrawerContent>
        </Drawer>
          </Box>

    )
}