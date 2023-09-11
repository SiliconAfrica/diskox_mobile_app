import { View, Text, useWindowDimensions, Pressable } from 'react-native'
import React from 'react'
import Box from '../../../../../components/general/Box'
import useForm from '../../../../../hooks/useForm'
import { editCommunity } from '../../../../../services/validations'
import { CustomTextInput } from '../../../../../components/form/CustomInput'
import CustomText from '../../../../../components/general/CustomText'
import { ScrollView } from 'react-native-gesture-handler'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../../../theme'
import { COMMUNITY_SETTING_TYPE } from '../../../../../enums/CommunitySettings'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../../navigation/MainNavigation'
import { useNavigation } from '@react-navigation/native'
import { PageType } from '../../../../login'
import SettingsHeader from '../../../../../components/settings/Header'

const EditCommunity = () => {
    const navigation = useNavigation<PageType>();
    const theme = useTheme<Theme>();
    const HEIGHT = useWindowDimensions().height;
    const { renderForm } = useForm({
        defaultValues: {
            title: '',
            username: '',
            description: '',
        },
        validationSchema: editCommunity
    });
  return renderForm(
    <Box flex={1} height={HEIGHT} backgroundColor='secondaryBackGroundColor'>
        <SettingsHeader showSave={false} title='Edit' handleArrowPressed={() => navigation.goBack()} />
        <Box width='100%'  backgroundColor='mainBackGroundColor' marginTop='m' paddingHorizontal='m' paddingVertical='m'>
            <CustomTextInput name='title' placeholder='Community title' required />
            <Box height={20} width={'100%'} />

            <CustomTextInput name='username' placeholder='Community username' required />
            <Box height={20} width={'100%'} />

            <CustomTextInput name='description' multiline containerStyle={{ height: 80}} placeholder='Description' required />
            <CustomText variant='xs'>299</CustomText>
            <Box height={20} width={'100%'} />

            <Box flexDirection='row'>
                <CustomText variant='subheader' fontSize={18}>Topics</CustomText>
                <CustomText style={{ color: 'red' }}>*</CustomText>
            </Box>

            <Box width={'100%'} height={50} marginTop='m'>
                <ScrollView horizontal contentContainerStyle={{ alignItems: 'center' }}>
                    <Pressable style={{ paddingHorizontal: 15, height: 30, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.secondaryBackGroundColor, minWidth: 40 }}>
                        <CustomText variant='body'>Movies</CustomText>
                    </Pressable>

                    <CustomText color='primaryColor' marginLeft='m' onPress={() => navigation.push('community-settings', { id: 23, type: COMMUNITY_SETTING_TYPE.TOPIC }) } >Change Topic</CustomText>
                </ScrollView>
            </Box>

        </Box>
    </Box>
  )
}

export default EditCommunity