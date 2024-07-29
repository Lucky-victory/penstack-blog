'use client'
import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Box, Button, Input, Select, Tag, VStack, HStack, Textarea, Flex, useColorModeValue, Stack, List, ListItem, Heading, Text, Icon, RadioGroup, Radio, TagCloseButton, TagLabel} from '@chakra-ui/react'
import { FiMapPin, FiPlus } from 'react-icons/fi'
import { BsEye, BsEyeFill, BsFillPinFill, BsPlus } from 'react-icons/bs'
import { SectionCard } from '@/src/app/components/Dashboard/SectionCard'
import {FormLabel,FormControl} from '@/src/app/components/ui/Form'
import TextEditor from '@/src/app/components/TextEditor'
import { LuEye, LuPin } from 'react-icons/lu'
import { FeaturedImageCard } from '@/src/app/components/Dashboard/FeaturedImageCard'

export default function NewPostPage() {
    const [title, setTitle] = useState('')
    
const [slug, setSlug] = useState('')
    const [excerpt, setExcerpt] = useState('')
    const [categories, setCategories] = useState<string[]>(['uncat','politics'])
    const [tags, setTags] = useState<string[]>([])

    
    useEffect(() => {
        const generatedSlug = title.toLowerCase().replace(/\s+/g, '-')
        setSlug(generatedSlug)
    }, [title])

    const handleAddCategory = () => {
        // Logic to add new category
    }

    const handleAddTag = () => {
        // Logic to add new tag
    }

    return (
        <Flex h='full' gap={3} py={4} overflowY={'auto'}> 
            <Stack gap={4} width={{ base: '100%' }}>
                <Box p={3} bg={useColorModeValue("white", "gray.900")}>


                <Input
                    placeholder="Post Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                
                    />
                    </Box>
                
               <TextEditor onContentChange={(content) => setExcerpt(content)} initialValue={excerpt} />
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
                        <FeaturedImageCard />

<FormControl>
<FormLabel>Post slug:</FormLabel>
                <Input
                        placeholder="Slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Post excerpt:</FormLabel>
                            <Textarea placeholder="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} maxH={150}/>
                                </FormControl>
                        </Stack>
                </SectionCard>
                <SectionCard title='Categories' >
                   <Box p={4}>
                    <Stack as={RadioGroup} gap={2} name='category' defaultValue={''}>
                        {categories.map((category) => (
                            <Radio key={category} variant="solid" value={category}>
                                {category}
                            </Radio>
                        ))}
                    <Button alignItems={'center'} gap={2} mt={4} onClick={handleAddCategory} size={'sm'} variant={'outline'}><Icon size={24} as={FiPlus}/> Add new category</Button>
                    </Stack>
                        </Box> 
                </SectionCard>
                <SectionCard title='Tags' >
               
                    <HStack as={RadioGroup} p={4} pb={0} gap={2} wrap={'wrap'}>
                        {categories.map((category) => (
                            <Tag rounded={'full'} key={category} variant="solid" colorScheme="teal">
                            <TagLabel>
                            {category}
                                </TagLabel>     <TagCloseButton/>
                            </Tag>
                        ))}
                    </HStack>
                        
                    <Box p={4}>

                    <HStack align={'center'}>
<Input placeholder="Enter tag name" size={'sm'}/>
                    <Button onClick={handleAddTag} size={'sm'} variant={'outline'} fontWeight={500} fontSize={'13px'} >Add</Button>
                    </HStack>
                    </Box>
                </SectionCard>
               
                        </Stack>
        </Flex>
    )
}