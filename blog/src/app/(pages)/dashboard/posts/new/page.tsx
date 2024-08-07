'use client'
import { useState, useEffect, useCallback } from 'react'
import { Box, Button, Input, Flex, useColorModeValue, Stack, Text, useDisclosure ,Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton} from '@chakra-ui/react'

import { LuSettings } from 'react-icons/lu'
import TextEditor from '@/src/app/components/TextEditor'
import slugify from'slugify'
import { formatDate, shortenText, shortIdGenerator } from '@/src/utils'
import { PostInsert } from '@/src/types'
import { useAutoSave } from '@/src/hooks'
import DashHeader from '@/src/app/components/Dashboard/Header'
import { SidebarContent } from '@/src/app/components/Dashboard/NewPostPageSidebar'

const META_DESCRIPTION_LENGTH = 155


export default function NewPostPage() {
    const [editorCounts,setEditorCounts] = useState({words:0,characters:0})
    
 
    const [categories, setCategories] = useState<{name:string,id?:number}[]>([])
    const [tags, setTags] = useState<{name:string}[]>([])
  
    const {value:post,onChange,isSaving,lastSaved}=useAutoSave({initialValue:{
        title:'',
        slug:'',
        summary:'',visibility:'public',
        content:'',featured_image:{src:'',alt_text:''},status:'draft','post_id':'',updated_at:new Date(),
        
    } as PostInsert,mutationFn:savePost, onSuccess: (savedPost) => {
    console.log({savedPost});
  }});
    const { isOpen, onOpen, onClose } = useDisclosure()
const updatePost = useCallback((updates:Partial<PostInsert>) => {
  onChange({...post, ...updates});
},[onChange, post]);
   async function savePost():Promise<any>{
    
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(post),
        })
        const data = await response.json()

        console.log(data)
        return data
    }
   
    useEffect(() => {
        if(post.title){
            const generatedSlug = slugify(post.title+'-'+shortIdGenerator.urlSafeId(6), { lower: true, strict: true });
           updatePost({slug: generatedSlug})
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post.title])




    const handleContentChange = (content:{html?:string,markdown:string,text:string}) => {
        updatePost({summary:shortenText(content.text,META_DESCRIPTION_LENGTH),content:content.markdown})

    }
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const getEditorCounts=(counts:{words:number,characters:number})=>{
        setEditorCounts(counts)
    }

    return (
        <Box h='full'  overflowY={'auto'}>
            <DashHeader pos='sticky' top={0} zIndex={10} >
            <Stack gap={0} >
                <Text fontSize={'2xl'} fontWeight={600} as='span'>Create Post</Text>
                <Text as='span' fontSize='sm' color={'gray.500'}>Last updated: {post?.updated_at ? formatDate(new Date(post.updated_at as Date)):'Not saved yet'+post.updated_at} </Text>
            </Stack>
            <Button onClick={onOpen} leftIcon={<LuSettings />} display={{ base: 'flex', lg: 'none' }}>Settings</Button>
        </DashHeader>


        <Flex  gap={3} py={4}  px={3}> 
            <Stack maxH={'calc(var(--chakra-vh) - (var(--dash-header-h) + 32px))'}  flex={1} minW={350} pos='sticky' top={'calc(var(--dash-header-h) + 16px)'}  width={{ base: '100%' }} bg={useColorModeValue('white','gray.900')}  border={'1px'} borderColor={borderColor} rounded={{base:'xl',md:'26px'}} boxShadow={'var(--card-raised)'}>
                <Box borderBottom={'1px'} borderBottomColor={borderColor} p={1} py={2}>


                <Input border={'none'} outline={'none'} autoComplete='off'
                    placeholder="Post title"
                    value={post.title as string }fontWeight={600}
                    onChange={(e) => updatePost({title:e.target.value})}
                 rounded={'none'} _focus={{boxShadow: 'none'}}
                fontSize={{ base: 'lg', md: '24px' }}
                    />
                    </Box>
                
               <TextEditor getCounts={getEditorCounts} onContentChange={(content) => handleContentChange(content)} initialValue={post.content+''} />
            </Stack>
            
            <Box display={{ base: 'none', lg: 'block' }} maxW={280}>
               <SidebarContent
                            post={post}
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
                            post={post}
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