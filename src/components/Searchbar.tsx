import { Pressable, TextInput } from 'react-native'
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
import { Gallery, VideoSquare, } from 'iconsax-react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useGlobalFileState } from '../states/pickedFileState'
import * as ImagePicker from "expo-image-picker";


const Searchbar = () => {
    const theme = useTheme<Theme>();
    const navigation = useNavigation<PageType>();
    const { profile_image, username, id } = useDetailsState((state) => state);
    const { setAll } = useGlobalFileState((state) => state)
    const { isDarkMode } = useUtilState((state) => state);

    const handleDocumentPicker = React.useCallback(
        async (documentType: "All" | "Images" | "Videos" | null) => {

          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions[documentType || "Images"],
            allowsEditing: true,
            base64: false,
          });

          if (!result.canceled) {
            setAll(result.assets[0]);
            setTimeout(() => {
                navigation.navigate('create-post');
            }, 3000);

          }
        },
        []
      );
  return (
    <Box backgroundColor={isDarkMode ? 'secondaryBackGroundColor':'mainBackGroundColor'} borderBottomWidth={0.3} borderBottomColor={isDarkMode ? 'secondaryBackGroundColor':"lightGrey"} borderTopWidth={0.3} borderTopColor={isDarkMode ? 'secondaryBackGroundColor':"lightGrey"} width='100%' height={70} flexDirection='row' alignItems='center' paddingHorizontal='s' style={{ marginTop: 6 }}>
         <TouchableOpacity onPress={() => navigation.navigate('profile', { userId: id })}>
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
         </TouchableOpacity>
        <Pressable
        onPress={() => navigation.navigate('create-post')}
        style={{
            flex: 1,
            height: 44,
            borderRadius: 25,
            backgroundColor: isDarkMode ? theme.colors.mainBackGroundColor:theme.colors.secondaryBackGroundColor,
            marginHorizontal: 10,
           justifyContent: 'center',
           paddingLeft: 20
        }}>
            <CustomText variant='subheader' fontSize={16} color={'grey'}>Lets diskox it</CustomText>
        </Pressable>
        <VideoSquare size={25} color={theme.colors.textColor} style={{ marginRight: 10, }} onPress={() => handleDocumentPicker('Videos')} />
        <Gallery size={25} color={theme.colors.textColor} onPress={() => handleDocumentPicker('Images')} />
    </Box>
  )
}

export default Searchbar
