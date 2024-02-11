import { View, Text, TextInput, Pressable } from 'react-native'
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
import { COMMUNITY_SETTING_TYPE } from '../../../../../enums/CommunitySettings'

const testArray = [2, 2, 3, 4, 5, 6, 7, 7, 6, 5, 4, 3];


const PostCard = ({index}: {
    index: number
}) => {
    const theme = useTheme<Theme>();
    return (
        <Box width='100%' paddingVertical='m' flexDirection='row' justifyContent='space-between' alignItems='flex-start' backgroundColor='mainBackGroundColor' borderWidth={2} borderColor='secondaryBackGroundColor' marginBottom='s' paddingHorizontal='m'>

            <CustomText variant='subheader' fontSize={20}>{index}</CustomText>

            <Box marginLeft='s' width='100%'>
                <CustomText variant='subheader' fontSize={20}>No hate speech or bullying acts</CustomText>
                <CustomText fontSize={16} marginTop='s'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum dignissimos cumque quaerat fuga eaque? Temporibus vitae a ratione impedit pariatur!</CustomText>
            </Box>

        </Box>
    )
}


const RemovalReason = () => {
    const theme = useTheme<Theme>();
    const navigation = useNavigation<PageType>();

    // state
    const [active, setActive] = React.useState(1);

    return (
        <Box flex={1} backgroundColor='mainBackGroundColor'>
            <SettingsHeader title='Removal reason' showSave handleArrowPressed={() => navigation.goBack()} RightItem={<CustomText variant='body' color='primaryColor' onPress={() => navigation.push('community-settings', { id: 23, type: COMMUNITY_SETTING_TYPE.ADD_REMOVAL_REASON, username: ''})}>Add Reason</CustomText>} />
            <Box flex={1}>

                <Box flex={1} >
                    <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
                        {
                            testArray.map((item, index) => (
                                <PostCard index={index+1} key={index.toString()} />
                            ))
                        }
                    </ScrollView>
                </Box>
            </Box>
        </Box>
    )
}

export default RemovalReason