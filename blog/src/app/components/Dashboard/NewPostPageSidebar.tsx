'use client'
import { Dispatch, SetStateAction, useState } from 'react'
import { Box, Button, Input, Tag, Textarea, Spinner, Flex, useColorModeValue, Stack, List, ListItem, Icon, RadioGroup, Radio, TagCloseButton, TagLabel, InputRightElement, InputGroup, Text, HStack,  useDisclosure ,Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton} from '@chakra-ui/react'

import { SectionCard } from '@/src/app/components/Dashboard/SectionCard'
import {FormLabel,FormControl} from '@/src/app/components/ui/Form'
import { LuEye, LuPin, LuPlus, LuCheck, LuListTodo, LuFileText, LuType, LuSettings } from 'react-icons/lu'
import { FeaturedImageCard } from '@/src/app/components/Dashboard/FeaturedImageCard'
import { PostInsert } from '@/src/types'
const META_DESCRIPTION_LENGTH = 155

export const SidebarContent = ({ 
    post, 
     updatePost, 
    categories, 
    setCategories, 
    tags, 
    setTags, 
    isSaving, 
    editorCounts,
  
}: {
    post: PostInsert;
    updatePost:(updates: Partial<PostInsert>) => void;
    categories: { name: string; id?: number }[];
    setCategories:Dispatch<SetStateAction<{ name: string; id?: number }[]>>;
    tags: { name: string }[];
    setTags:Dispatch<SetStateAction<{ name: string }[]>>;
    isSaving: boolean;
    editorCounts: { words: number; characters: number };

}) => {
    
    const [showCategoryInput, setShowCategoryInput] = useState<boolean>(false)
    const [isSlugEditable,setIsSlugEditable] = useState<boolean>(false)
       const [tag, setTag] = useState('')
    const [category, setCategory] = useState('')

     const handleAddCategory = () => {
        const lastCategory = categories[categories.length-1]
       setCategories((prev) => [...prev, {name:category,id:lastCategory?.id?lastCategory.id+1:1}])
        setCategory('')
    }
     const handleAddTag = () => {
      setTags((prev)=>([...prev,{name:tag}]))
      setTag('')
    }
    return (

        <Stack gap={3} flexShrink={0} maxW={300} width={{ base: '100%' }} overflowY={'auto'}>
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
        <Stack as={List} fontSize={14} gap={2}>
          <ListItem>
            <HStack>
              <Text as={'span'} color="gray.500"><Icon as={LuPin} mr={1} />Status:</Text>
              <Text as={'span'} fontWeight="semibold" textTransform={'capitalize'}>{post.status}</Text>
            </HStack>
          </ListItem>
          <ListItem>
            <HStack  >
              <Text as={'span'} color="gray.500"><Icon as={LuEye} mr={1} />Visibility:</Text>
              <Text as={'span'} fontWeight="semibold" textTransform={'capitalize'}>{post.visibility}</Text>
            </HStack>
          </ListItem>
          <ListItem>
            <HStack  >
              <Text as={'span'} color="gray.500"><Icon as={LuFileText} mr={1} />Word count:</Text>
              <Text as={'span'} fontWeight="semibold">{editorCounts.words}</Text>
            </HStack>
          </ListItem>
          <ListItem>
            <HStack  >
              <Text as={'span'} color="gray.500" ><Icon as={LuType} mr={1} />Character count:</Text>
              <Text as={'span'} fontWeight="semibold">{editorCounts.characters}</Text>
            </HStack>
          </ListItem>
        </Stack>
        </Box>
        </SectionCard>
        <SectionCard title='SEO'>
            <Stack p={4}>
                <Text  as='span' fontWeight={500}>Featured Image:</Text>
                <FeaturedImageCard onChange={(imageUrl)=>{
                    updatePost({featured_image:{src:imageUrl}})
                }} imageUrl={post.featured_image?.src}/>

        <FormControl>
        <FormLabel>URL friendly title:</FormLabel>
            <InputGroup>
                <Input
                    placeholder="Slug" name='slug'
                    value={post.slug} autoComplete='off'
                    onChange={(e) => {
                        
                        updatePost({slug: e.target.value})
                    }}
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
                    <FormLabel>Meta description:</FormLabel>
                    <Textarea placeholder="summary" name='summary' value={post.summary as string} onChange={(e) => {
                        
                        updatePost({summary:e.target.value})}} maxH={150} rounded={'lg'}/>
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
)
}
SidebarContent.displayName = 'SidebarContent'