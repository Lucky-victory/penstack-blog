'use client'
import { useState, useEffect } from 'react'
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
    const [post,setPost] = useState<PostInsert>({
        title:'',
        slug:'',
        summary:'',visibility:'public',
        content:'',author_id:1,featured_image:{src:'',alt_text:''},status:'draft','post_id':''
        
    })
    const {value,onChange,isSaving}=useAutoSave({initialValue:post,mutationFn:savePost});
    const { isOpen, onOpen, onClose } = useDisclosure()

   async function savePost() {
    
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(post),
        })
        const data = await response.json()
    
        console.log(data)
    }
    async function fetchCategories() {
        // const response = await fetch('/api/categories')
        // const data = await response.json()
        // setCategories(data.categories)
    }
    async function fetchTags() {
        // const response = await fetch('/api/tags')
        // const data = await response.json()
        // setTags(data.tags)
    }

    
    useEffect(() => {
        fetchCategories()
       
    }, [])
    useEffect(()=>{
        onChange(post)
    },[post])
    useEffect(() => {
        if(post.title){
            const generatedSlug = slugify(post.title+'-'+shortIdGenerator.urlSafeId(6), { lower: true, strict: true });
            setPost((prev) => ({...prev, slug: generatedSlug}))
        }
    }, [post.title])

   

   
    const handleContentChange = (content:{html?:string,markdown:string,text:string}) => {
        setPost((prev)=> ({...prev,summary:shortenText(content.text,META_DESCRIPTION_LENGTH),content:content.markdown}))

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
                <Text as='span' fontSize='sm' color={'gray.500'}>Last updated: {formatDate(new Date(value.updated_at as Date))} </Text>
            </Stack>
            <Button onClick={onOpen} leftIcon={<LuSettings />} display={{ base: 'flex', lg: 'none' }}>Settings</Button>
        </DashHeader>


        <Flex  gap={3} py={4}  px={3}> 
            <Stack maxH={'calc(var(--chakra-vh) - (var(--dash-header-h) + 32px))'}  flex={1} minW={350} pos='sticky' top={'calc(var(--dash-header-h) + 16px)'}  width={{ base: '100%' }} bg={useColorModeValue('white','gray.900')}  border={'1px'} borderColor={borderColor} rounded={{base:'xl',md:'26px'}} boxShadow={'var(--card-raised)'}>
                <Box borderBottom={'1px'} borderBottomColor={borderColor} p={1} py={2}>


                <Input border={'none'} outline={'none'} autoComplete='off'
                    placeholder="Post title"
                    value={post.title as string }fontWeight={600}
                    onChange={(e) => setPost((prev)=>({...prev,title:e.target.value}))}
                 rounded={'none'} _focus={{boxShadow: 'none'}}
                fontSize={{ base: 'lg', md: '24px' }}
                    />
                    </Box>
                
               <TextEditor getCounts={getEditorCounts} onContentChange={(content) => handleContentChange(content)} initialValue={post.content+''} />
            </Stack>
            
            <Box display={{ base: 'none', lg: 'block' }} maxW={280}>
               <SidebarContent
                            post={post}
                            setPost={setPost}
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
                            setPost={setPost}
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