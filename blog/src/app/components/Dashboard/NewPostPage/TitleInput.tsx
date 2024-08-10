import { Box, useColorModeValue } from "@chakra-ui/react"
import {Input} from '@/src/app/components/ui/Input'
export const TitleInput=({formik}:{formik:any})=>{
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (<Box borderBottom={'1px'} borderBottomColor={borderColor} p={1} py={2}>


                <Input border={'none'} outline={'none'} autoComplete='off'
                    placeholder="Awesome title" name={'title'}
                    value={formik.values.title as string} fontWeight={600}
                    onChange={formik.handleChange}
                 rounded={'none'} _focus={{boxShadow: 'none'}}
                fontSize={{ base: 'lg', md: '24px' }}
                    />
                    </Box>)
}