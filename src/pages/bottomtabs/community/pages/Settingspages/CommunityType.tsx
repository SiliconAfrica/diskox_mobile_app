import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Box from '../../../../../components/general/Box'
import CustomText from '../../../../../components/general/CustomText'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../../../theme'
import { useUtilState } from '../../../../../states/util'
import SettingsHeader from '../../../../../components/settings/Header'
import { useNavigation } from '@react-navigation/native'
import { PageType } from '../../../../login'

const TypeCard = ({ active, isPublic, action }: {
    active: boolean,
    isPublic: boolean,
    action: (isPublic: boolean) => void,
}) => {
    const { isDarkMode } = useUtilState((state) => state);
    const theme = useTheme<Theme>();

    return (
        <Box width='100%' height={100} borderRadius={20} borderLeftWidth={4} borderLeftColor={active ? 'primaryColor':'grey'} flexDirection='row' alignItems='center' backgroundColor={'secondaryBackGroundColor'}  marginBottom='m' paddingHorizontal='m'>
            <Box width={30} height={30} borderRadius={15} borderWidth={2} borderColor={active ? 'primaryColor':'grey'} justifyContent='center' alignItems='center' backgroundColor='mainBackGroundColor'>
                {/* <Box width={20} height={20} borderRadius={10} backgroundColor={active ? 'primaryColor':'grey'} ></Box> */}
                <Pressable onPress={() => action(isPublic)} style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: active ? theme.colors.primaryColor:'transparent' }}></Pressable>
            </Box>

            <Box marginLeft='m' flex={1}>
                <Box flexDirection='row' alignItems='center'>
                    <Ionicons name={isPublic ? 'people-outline':'lock-closed-outline'} size={30} color={ active ?  theme.colors.primaryColor:theme.colors.textColor} />
                    <CustomText variant='subheader' fontSize={20} marginLeft='s' color={active ? 'primaryColor':'grey'}>{ isPublic ? 'Public':'Private'}</CustomText>
                </Box>
                <CustomText variant='xs'>{ isPublic ? 'Anyone can view, post, and comment to this community':'Only invited users can post in this community'}</CustomText>
            </Box>
        </Box>
    )
}

const CommunityType = () => {
    const navigation = useNavigation<PageType>();
    const [isPublic, setIsPublic] = React.useState(true);

    const action = (isPublicc: boolean) => {
        if (isPublicc) setIsPublic(true);
        setIsPublic(false)
    }
  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
        <SettingsHeader showSave={false} title='Community type' handleArrowPressed={() => navigation.goBack()} />

        <Box  padding='m'>
            <CustomText variant='body' marginBottom='m'>Change people who can access your community</CustomText>

            <TypeCard isPublic active={isPublic ? true: false} action={action} />
            <TypeCard isPublic={false} active={isPublic ? false:true} action={action} />
        </Box>

    </Box>
  )
}

export default CommunityType