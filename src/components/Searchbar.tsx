import { TextInput } from 'react-native'
import React from 'react'
import Box from './general/Box'
import { Image } from 'expo-image'
import { useDetailsState } from '../states/userState'
import CustomText from './general/CustomText'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme'
import { Feather, Ionicons} from '@expo/vector-icons';
import { IMAGE_BASE } from '../utils/httpService'


const Searchbar = () => {
    const theme = useTheme<Theme>();
    const { profile_image, username } = useDetailsState((state) => state)
  return (
    <Box backgroundColor='mainBackGroundColor' width='100%' height={70} flexDirection='row' alignItems='center' paddingHorizontal='s'>
         {
                    profile_image && (
                        <Image source={{ uri: `${IMAGE_BASE}${profile_image}` }} style={{ width: 40, height: 40, borderRadius: 25 }} contentFit='contain' />
                    )
                }
                {
                    !profile_image && (
                        <Box width={40} height={40} borderRadius={25} backgroundColor='fadedButtonBgColor' justifyContent='center' alignItems='center' style={{ marginLeft: 10 }}>
                            <CustomText variant='subheader' color='primaryColor' fontSize={18}>{username[0]?.toUpperCase() ?? ''}</CustomText>
                        </Box>
                    )
        }
        <TextInput 
        placeholder='Lets diskox it...'
        style={{
            flex: 1,
            height: 50,
            borderRadius: 25,
            backgroundColor: theme.colors.secondaryBackGroundColor,
            marginHorizontal: 10,
            paddingHorizontal: 10
        }} />
        <Ionicons name='image-outline' size={25} color={theme.colors.textColor} />
        <Ionicons name='videocam-outline' size={25} color={theme.colors.textColor} style={{ marginLeft: 10, }} />
    </Box>
  )
}

export default Searchbar