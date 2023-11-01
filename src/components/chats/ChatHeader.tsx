import { View, Text, TextInput } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import CustomText from '../general/CustomText'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import { useDetailsState } from '../../states/userState'
import { Image } from 'expo-image'
import { IMAGE_BASE } from '../../utils/httpService'
import { Ionicons } from '@expo/vector-icons';

const ChatHeader = ({text, onChange}: {
  text: string,
  onChange: (text: string) => void
}) => {
    const { profile_image } = useDetailsState((state) => state);
    const theme = useTheme<Theme>();

  return (
    <Box width='100%' height={130} paddingTop='xl' flexDirection='row' alignItems='center' paddingHorizontal='m' justifyContent='space-between'>
        <CustomText variant='body'>Chats</CustomText>
        <Box flex={0.8} height={45} borderRadius={25} backgroundColor='secondaryBackGroundColor' alignItems='center' flexDirection='row' paddingHorizontal='s'>
            <Ionicons name='search-outline' size={25} color={theme.colors.textColor}  />
            <TextInput value={text} onChangeText={(e) => onChange(e)} style={{ flex: 1, fontFamily: 'RedRegular', marginLeft: 10, color: theme.colors.textColor }} placeholder='Search username' placeholderTextColor={theme.colors.textColor} />
        </Box>
        <Box width={40} height={40} borderRadius={20} overflow='hidden'>
            <Image source={{ uri: `${IMAGE_BASE}${profile_image}` }} style={{ width: '100%', height: '100%' }} contentFit='cover'/>
        </Box>
    </Box>
  )
}

export default ChatHeader