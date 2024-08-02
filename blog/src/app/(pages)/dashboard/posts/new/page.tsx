'use client'
import { useState, useEffect } from 'react'
import { Box, Button, Input, Tag,  Textarea,Spinner, Flex, useColorModeValue, Stack, List, ListItem, Icon, RadioGroup, Radio, TagCloseButton, TagLabel, InputRightElement, InputGroup,Text,HStack} from '@chakra-ui/react'

import { SectionCard } from '@/src/app/components/Dashboard/SectionCard'
import {FormLabel,FormControl} from '@/src/app/components/ui/Form'
import TextEditor from '@/src/app/components/TextEditor'
import { LuEye, LuPin,LuPlus,LuCheck } from 'react-icons/lu'
import { FeaturedImageCard } from '@/src/app/components/Dashboard/FeaturedImageCard'
import slugify from'slugify'
import { shortenText, shortIdGenerator } from '@/src/utils'
import { PostInsert } from '@/src/types'
import { useAutoSave } from '@/src/hooks'

export default function NewPostPage() {
    const [title, setTitle] = useState('')
    
const [tag, setTag] = useState('')
const [category, setCategory] = useState('')
const [showCategoryInput, setShowCategoryInput] = useState<boolean>(false)
    const [isSlugEditable,setIsSlugEditable] = useState<boolean>(false)
    const [categories, setCategories] = useState<{name:string,id?:number}[]>([])
    const [tags, setTags] = useState<{name:string}[]>([])
    // const [isSaving,setIsSaving]=useState<boolean>(false);
    const [post,setPost] = useState<PostInsert>({
        title:'',
        slug:'',
        summary:'',
        content:'',author_id:1,featured_image:'',status:'draft','post_id':''
        
    })
    const {value,onChange,isSaving}=useAutoSave({initialValue:post,mutationFn:savePost});
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
const borderColor = useColorModeValue('gray.200', 'gray.700')
    return (
        <Flex h='full' gap={2} py={4} overflowY={'auto'} > 
            <Stack flex={1}  width={{ base: '100%' }} bg={useColorModeValue('white','gray.900')}  border={'1px'} borderColor={borderColor} rounded={{base:'xl',md:'26px'}} boxShadow={'var(--card-raised)'}>
                <Box borderBottom={'1px'} borderBottomColor={borderColor} p={1} py={2}>


                <Input border={'none'} outline={'none'} autoComplete='off'
                    placeholder="Post title"
                    value={post.title as string }fontWeight={600}
                    onChange={(e) => setPost((prev)=>({...prev,title:e.target.value}))}
                 rounded={'none'} _focus={{boxShadow: 'none'}}
                fontSize={{ base: 'lg', md: '24px' }}
                    />
                    </Box>
                
               <TextEditor onContentChange={(content) => handleContentChange(content)} initialValue={post.content+''} />
            </Stack>
            <Stack gap={3} flexShrink={0} width={{ base: '100%', md: '300px' }} overflowY={'auto'} pr={'1'} 
            >

                <SectionCard title='Publish' header={
                    <>
                    <HStack> {isSaving? <Spinner size='xs' />:<Stack align={'center'} justify={'center'} w={'14px'} h={'14px'} rounded='full' bg='green.300'>
                        <LuCheck size={12} color='white'/>
                        </Stack> }
                    <Text as='span' color={isSaving?'gray.300': undefined}> {isSaving ? 'Saving...':'Saved'}</Text>
                    </HStack>
                    </>
                } footer={
                    <>
                     <Button size={'sm'} flex={1} variant={'outline'} rounded={'full'}>Save draft</Button>
                     <Button size={'sm'} flex={1} rounded={'full'}>Publish</Button>
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
                        <FeaturedImageCard onChange={(imageUrl)=>{
                            setPost((prev)=>({...prev,featured_image:imageUrl}))
                        }} imageUrl={post.featured_image}/>

<FormControl>
<FormLabel>Post slug:</FormLabel>
                    <InputGroup>
                        <Input
                            placeholder="Slug" name='slug'
                            value={post.slug} autoComplete='off'
                            onChange={(e) => {
                                
                                setPost((prev) => ({...prev, slug: e.target.value}))}}
                            isDisabled={!isSlugEditable}
                            onBlur={() => setIsSlugEditable(false)} rounded={'full'} pr={1}
                        />
                        {!isSlugEditable && (
                            <InputRightElement bg={'blue.50'} roundedRight={'full'}>
                                <Button   size={'sm'} 
                                                variant={'ghost'} 
                                                fontWeight={500} 
                                                fontSize={'13px'} roundedRight={'full'} onClick={() => setIsSlugEditable(true)}>
                                    Edit
                                </Button>
                            </InputRightElement>
                        )}
                    </InputGroup>                        </FormControl>

                        <FormControl>
                            <FormLabel>Post summary:</FormLabel>
                            <Textarea placeholder="summary" name='summary' value={post.summary as string} onChange={(e) => {
                                
                                setPost((prev)=>({...prev,summary:e.target.value}))}} maxH={150} rounded={'lg'}/>
                                </FormControl>
                        </Stack>
                </SectionCard>
                <SectionCard title='Categories' >
                   <Box p={4}>
                    <Stack  as={RadioGroup} gap={2} name='category' defaultValue={''}>
                        {categories.map((category) => (
                            <Radio key={category.id} variant="solid" value={category.id+''}>
                                {category.name}
                            </Radio>
                        ))}
                                    {showCategoryInput && (
                                        <HStack mt={2} align={'center'}>
                                            <Input autoComplete='off'
                                                placeholder="Enter category name"
                                                size={'sm'} rounded={'full'}
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
                                                fontSize={'13px'} rounded={'full'}
                                            >
                                                Add
                                            </Button>
                                        </HStack>
                                    )}
                                    <Button rounded={'full'} alignItems={'center'} alignSelf='start' gap={2} mt={4} onClick={() => setShowCategoryInput(true)} size={'xs'} variant={'ghost'}><Icon size={24} as={LuPlus}/><Text as='span'> Add new category</Text></Button>

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
  value={tag} rounded={'full'}  
  onChange={(e) => setTag(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleAddTag()
    }
  }}
/>
<Button rounded={'full'} isDisabled={!tag} onClick={handleAddTag} size={'sm'} variant={'outline'} fontWeight={500} fontSize={'13px'} >Add</Button>
</HStack>                    </Box>
                </SectionCard>
               
                        </Stack>
        </Flex>
    )
}