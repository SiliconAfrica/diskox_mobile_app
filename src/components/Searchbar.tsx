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
import { useNavigation } from '@react-navigation/native'
import { PageType } from '../pages/login'
import { useUtilState } from '../states/util'
import { VideoSquare, } from 'iconsax-react-native'


const Searchbar = () => {
    const theme = useTheme<Theme>();
    const navigation = useNavigation<PageType>();
    const { profile_image, username } = useDetailsState((state) => state);
    const { isDarkMode } = useUtilState((state) => state)
  return (
    <Box backgroundColor={isDarkMode ? 'secondaryBackGroundColor':'mainBackGroundColor'} borderBottomWidth={0.8} borderBottomColor='lightGrey' width='100%' height={70} flexDirection='row' alignItems='center' paddingHorizontal='s'>
         {
                    profile_image && (
                        <Image source={{ uri: `${IMAGE_BASE}${profile_image}` }} style={{ width: 32, height: 32, borderRadius: 17 }} contentFit='cover' />
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
        placeholderTextColor={theme.colors.textColor}
        onChangeText={() => navigation.navigate('create-post')}
        style={{
            flex: 1,
            height: 44,
            borderRadius: 25,
            backgroundColor: isDarkMode ? theme.colors.mainBackGroundColor:theme.colors.secondaryBackGroundColor,
            marginHorizontal: 10,
            paddingHorizontal: 10,
            fontFamily: 'RedRegular',
            fontSize: 14,
            color: theme.colors.textColor
        }} />
        <Ionicons name='image-outline' size={25} color={theme.colors.lightGrey} />
        <VideoSquare size={25} color={theme.colors.lightGrey} style={{ marginLeft: 10, }} />
    </Box>
  )
}

export default Searchbar