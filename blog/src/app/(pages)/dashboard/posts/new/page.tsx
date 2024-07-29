'use client'
import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Box, Button, Input, Select, Tag, VStack, HStack, Textarea, Flex, useColorModeValue, Stack, List, ListItem, Heading, Text, Icon, RadioGroup, Radio, TagCloseButton, TagLabel, InputRightElement, InputGroup} from '@chakra-ui/react'
import { FiMapPin, FiPlus } from 'react-icons/fi'
import { BsEye, BsEyeFill, BsFillPinFill, BsPlus } from 'react-icons/bs'
import { SectionCard } from '@/src/app/components/Dashboard/SectionCard'
import {FormLabel,FormControl} from '@/src/app/components/ui/Form'
import TextEditor from '@/src/app/components/TextEditor'
import { LuEye, LuPin } from 'react-icons/lu'
import { FeaturedImageCard } from '@/src/app/components/Dashboard/FeaturedImageCard'
import slugify from'slugify'
import { shortenText, shortIdGenerator } from '@/src/utils'
import { PostInsert } from '@/src/types'

export default function NewPostPage() {
    const [title, setTitle] = useState('')
    
const [tag, setTag] = useState('')
const [category, setCategory] = useState('')
const [showCategoryInput, setShowCategoryInput] = useState<boolean>(false)
    const [isSlugEditable,setIsSlugEditable] = useState<boolean>(false)
    const [categories, setCategories] = useState<{name:string,id?:number}[]>([])
    const [tags, setTags] = useState<{name:string}[]>([])
const [post,setPost] = useState<PostInsert>({
    title:'',
    slug:'',
    summary:'',
    content:'',author_id:1
   
})
    
    useEffect(() => {
        if(post.title){

            const generatedSlug = slugify(post.title, { lower: true, strict: true })+'-'+shortIdGenerator.urlSafeId(6);
            setPost((prev) => ({...prev, slug: generatedSlug}))
        }
    }, [post.title])

    const handleAddCategory = () => {
        const lastCategory = categories[categories.length-1]
       setCategories((prev) => [...prev, {name:category,id:lastCategory?.id?lastCategory.id+1:1}])
        setCategory('')
    }

    const handleAddTag = () => {
      setTags((prev)=>([...prev,{name:tag}]))
      setTag('')
    }
const handleContentChange = (content:{html?:string,markdown:string,text:string}) => {
    setPost((prev)=> ({...prev,summary:shortenText(content.text,120),content:content.markdown}))

}

    return (
        <Flex h='full' gap={3} py={4} overflowY={'auto'}> 
            <Stack gap={4} width={{ base: '100%' }}>
                <Box p={3} bg={useColorModeValue("white", "gray.900")}>


                <Input
                    placeholder="Post Title"
                    value={post.title as string }
                    onChange={(e) => setPost((prev)=>({...prev,title:e.target.value}))}
                
                    />
                    </Box>
                
               <TextEditor onContentChange={(content) => handleContentChange(content)} initialValue={post.content+''} />
            </Stack>
            <Stack gap={3} flexShrink={0} width={{ base: '100%', md: '300px' }} overflowY={'auto'} 
            >

                <SectionCard title='Publish' footer={
                    <>
                     <Button size={'sm'} flex={1} variant={'outline'}>Save draft</Button>
                     <Button size={'sm'} flex={1}>Publish</Button>
                   </>
                     
                    }>
                <Box p={4} pb={0}>

<Stack as={List} fontSize={14} gap={2} >
<ListItem> <Icon as={LuPin}/> Status: Draft</ListItem>
<ListItem> <Icon as={LuEye}/> Visibility: Public</ListItem>

</Stack>
</Box>
                </SectionCard>
                <SectionCard title='SEO'>
                    <Stack p={4}>
                        <FeaturedImageCard image={{src:post.featured_image}}/>

<FormControl>
<FormLabel>Post slug:</FormLabel>
                    <InputGroup>
                        <Input
                            placeholder="Slug"
                            value={post.slug}
                            onChange={(e) => setPost((prev) => ({...prev, slug: e.target.value}))}
                            isDisabled={!isSlugEditable}
                            onBlur={() => setIsSlugEditable(false)}
                        />
                        {!isSlugEditable && (
                            <InputRightElement>
                                <Button variant={'outline'} size="sm" onClick={() => setIsSlugEditable(true)}>
                                    Edit
                                </Button>
                            </InputRightElement>
                        )}
                    </InputGroup>                        </FormControl>

                        <FormControl>
                            <FormLabel>Post summary:</FormLabel>
                            <Textarea placeholder="summary" value={post.summary as string} onChange={(e) => setPost((prev)=>({...prev,summary:e.target.value}))} maxH={150}/>
                                </FormControl>
                        </Stack>
                </SectionCard>
                <SectionCard title='Categories' >
                   <Box p={4}>
                    <Stack as={RadioGroup} gap={2} name='category' defaultValue={''}>
                        {categories.map((category) => (
                            <Radio key={category.id} variant="solid" value={category.id+''}>
                                {category.name}
                            </Radio>
                        ))}
                                    {showCategoryInput && (
                                        <HStack mt={2} align={'center'}>
                                            <Input
                                                placeholder="Enter category name"
                                                size={'sm'}
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleAddCategory()
                                                    }
                                                }}
                                            />
                                            <Button 
                                                isDisabled={!category} 
                                                onClick={handleAddCategory} 
                                                size={'sm'} 
                                                variant={'outline'} 
                                                fontWeight={500} 
                                                fontSize={'13px'}
                                            >
                                                Add
                                            </Button>
                                        </HStack>
                                    )}
                                    <Button alignItems={'center'} gap={2} mt={4} onClick={() => setShowCategoryInput(true)} size={'xs'} variant={'outline'}><Icon size={24} as={FiPlus}/> Add new category</Button>

                                    </Stack>                        </Box> 
                </SectionCard>
                <SectionCard title='Tags' >
               
                    <HStack p={4} pb={0} gap={2} wrap={'wrap'}>
                        {tags.map((tag,index) => (
                            <Tag rounded={'full'} key={index} variant="solid" >
                            <TagLabel>
                           #{tag?.name}
                                </TagLabel>     <TagCloseButton onClick={() => setTags(tags.filter((t) => t.name!== tag.name))}>
                              
                            </TagCloseButton>
                            </Tag>
                        ))}
                    </HStack>
                        
                    <Box p={4}>

                    <HStack align={'center'}>
<Input
  placeholder="Enter tag name"
  size={'sm'}
  value={tag}
  onChange={(e) => setTag(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleAddTag()
    }
  }}
/>
<Button isDisabled={!tag} onClick={handleAddTag} size={'sm'} variant={'outline'} fontWeight={500} fontSize={'13px'} >Add</Button>
</HStack>                    </Box>
                </SectionCard>
               
                        </Stack>
        </Flex>
    )
}