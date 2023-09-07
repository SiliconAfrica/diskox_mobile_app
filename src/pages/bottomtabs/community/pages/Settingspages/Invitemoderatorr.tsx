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

const testArray = [2, 2, 3, 4, 5, 6, 7, 7, 6, 5, 4, 3];


const PostCard = () => {
    const theme = useTheme<Theme>();
    return (
        <Box width='100%' paddingVertical='m' flexDirection='row' justifyContent='space-between' alignItems='center' backgroundColor='mainBackGroundColor' borderBottomWidth={0} borderBottomColor='secondaryBackGroundColor' marginBottom='s' paddingHorizontal='m'>

            <Box flexDirection='row'>
                <Box width={30} height={30} borderRadius={15} backgroundColor='primaryColor' />

                <Box marginLeft='m'>
                    <Box flexDirection='row'>
                        <CustomText variant='subheader' fontSize={18}>Ogechukwu Kalu</CustomText>
                        <CustomText variant='xs' fontSize={18} marginLeft='s'>@Oge</CustomText>
                    </Box>
                </Box>
            </Box>

        </Box>
    )
}


const InviteModerators = () => {
    const theme = useTheme<Theme>();
    const navigation = useNavigation<PageType>();

    return (
        <Box flex={1} backgroundColor='mainBackGroundColor'>
            <SettingsHeader title='Modertaros' showSave handleArrowPressed={() => navigation.goBack()} />
            <Box flex={1}>

                {/* SEARCH BOX */}

                <Box marginHorizontal='m'>
                    <Box width='100%' marginTop='m' >
                        <Box width={'100%'} height={45} borderRadius={25} backgroundColor='secondaryBackGroundColor' flexDirection='row' alignItems='center' paddingHorizontal='m' >
                            <Feather name='search' size={25} color={theme.colors.textColor} />
                            <TextInput style={{ flex: 1, color: theme.colors.textColor, fontFamily: 'RedRegular', paddingLeft: 10 }} placeholder='Search for a moderator' placeholderTextColor={theme.colors.textColor} />
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
        </Box>
    )
}

export default InviteModerators