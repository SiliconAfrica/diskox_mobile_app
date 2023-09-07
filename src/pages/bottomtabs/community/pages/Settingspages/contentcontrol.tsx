import { View, Text, Switch } from 'react-native'
import React from 'react'
import Box from '../../../../../components/general/Box'
import CustomText from '../../../../../components/general/CustomText'
import SettingsHeader from '../../../../../components/settings/Header'
import { useNavigation } from '@react-navigation/native'
import { PageType } from '../../../../login'

const ContentControl = () => {
    const navigation = useNavigation<PageType>()
  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
        <SettingsHeader showSave={false} title='Content control' handleArrowPressed={() => navigation.goBack() } />
        
        <Box paddingHorizontal='m'>
            <CustomText variant='body' fontSize={18}>Set requirements and restrictions for how people post and comment in your community</CustomText>
        </Box>

        <Box width='100%' flexDirection='row' justifyContent='space-between' marginTop='l' paddingHorizontal='m'>
            <Box flex={0.9}>
                <CustomText variant='subheader' fontSize={18}>Allow members create post for the community</CustomText>
                <CustomText variant='body' fontSize={14} marginTop='s'>All members of the community can create and share post</CustomText>
            </Box>

            <Switch />
        </Box>

        <Box width='100%' flexDirection='row' justifyContent='space-between' marginTop='l' paddingHorizontal='m'>
            <Box flex={0.9}>
                <CustomText variant='subheader' fontSize={18}>Post approval</CustomText>
                <CustomText variant='body' fontSize={14} marginTop='s'>All community content must be approved by a moderator</CustomText>
            </Box>

            <Switch />
        </Box>
    </Box>
  )
}

export default ContentControl