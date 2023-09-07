import { View, Text, TextInput } from 'react-native'
import React from 'react'
import Box from '../../../../../components/general/Box'
import CustomText from '../../../../../components/general/CustomText'
import { Theme } from '../../../../../theme'
import { useTheme } from '@shopify/restyle'
import { Feather, Ionicons } from '@expo/vector-icons'
import FadedButton from '../../../../../components/general/FadedButton'
import CustomButton from '../../../../../components/general/CustomButton'
import { ScrollView } from 'react-native-gesture-handler'
import SettingsHeader from '../../../../../components/settings/Header'
import { useNavigation } from '@react-navigation/native'
import { PageType } from '../../../../login'

const testArray = [2,2,3,4,5,6,7,7,6,5,4,3];


const PostCard = () => {
    const theme = useTheme<Theme>();
    return (
        <Box width='100%' paddingVertical='m' flexDirection='row' backgroundColor='mainBackGroundColor' borderBottomWidth={4} borderBottomColor='secondaryBackGroundColor' marginBottom='s' paddingHorizontal='s'>

            <Box width={30} height={30} borderRadius={15} backgroundColor='primaryColor' />

            <Box width='100%' marginLeft='s'>
                <Box flexDirection='row' alignItems='center'>
                    <CustomText variant='subheader' fontSize={18}>@Dan</CustomText>
                    <CustomText variant='xs' marginLeft='s'>3 min ago.</CustomText>
                </Box>

                <CustomText variant='body' style={{ width: '88%' }} marginTop='m' fontSize={16}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Autem ratione quo expedita? Itaque cupiditate reiciendis quasi quo eligendi corrupti voluptatem?</CustomText>
                
                <Box flexDirection='row' alignItems='center' marginTop='m'>
                    <CustomButton title='Decline' color={theme.colors.secondaryBackGroundColor} textColor={theme.colors.black} onPress={() => {}} height={30} width={100} />
                    <Box width={10} />
                    <CustomButton title='Approve' onPress={() => {}} height={30} width={100} color={theme.colors.primaryColor} />
                    <CustomText marginLeft='m'>View Profile</CustomText>
                </Box>
            </Box>

        </Box>
    )
}


const PostApproval = () => {
    const theme = useTheme<Theme>();
    const navigation = useNavigation<PageType>();

  return (
   <Box flex={1} backgroundColor='mainBackGroundColor'>
    <SettingsHeader title='Approve Post' showSave handleArrowPressed={() => navigation.goBack()} />
        <CustomText marginTop='m' marginLeft='m' variant='subheader' fontSize={14}>20 pending posts</CustomText>

        {/* SEARCH BOX */}

        <Box marginHorizontal='m'>
            <Box width='100%' marginTop='m' >
                <Box width={'100%'} height={45} borderRadius={25} backgroundColor='secondaryBackGroundColor' flexDirection='row' alignItems='center' paddingHorizontal='m' >
                    <Feather name='search' size={25} color={theme.colors.textColor} />
                    <TextInput style={{ flex: 1, color: theme.colors.textColor, fontFamily: 'RedRegular', paddingLeft: 10 }} placeholder='Search for a member' placeholderTextColor={theme.colors.textColor} />
                </Box>
            </Box>
        </Box>

        <Box flex={1}>
            <ScrollView>
            {
                testArray.map((item, index) => (
                    <PostCard key={index.toString()} />
                ))
            }
            </ScrollView>
        </Box>
   </Box>
  )
}

export default PostApproval