import { View, Text, useWindowDimensions, Pressable, ImageBackground } from 'react-native'
import React, { memo } from 'react'
import Box from '../../../../components/general/Box'
import { Feather, Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../../theme'
import { ScrollView } from 'react-native-gesture-handler'
import CustomText from '../../../../components/general/CustomText'
import Posts from '../../../../components/community/Posts'
import AboutCommunity from '../../../../components/community/About'
import Rules from '../../../../components/community/Rules'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../navigation/MainNavigation'
import { COMMUNITY_SETTING_TYPE } from '../../../../enums/CommunitySettings'
import { PageType } from '../../../login'
import { RootBottomTabParamList } from '../../../../navigation/BottomTabs'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { CommunityStackParamList } from '..'
import { ICommunity } from '../../../../models/Community'
import { useQuery } from 'react-query'
import httpService, { IMAGE_BASE } from '../../../../utils/httpService'
import { URLS } from '../../../../services/urls'
import { Image } from 'expo-image';


const Community = () => {
  const theme = useTheme<Theme>();
  const WIDTH = useWindowDimensions().width;
  const [active, setActive] = React.useState(1);

  const navigation = useNavigation<PageType>();
  const route = useRoute<RouteProp<CommunityStackParamList, 'community'>>();

  const { id, data } = route.params;
  const [details, setDetails] = React.useState<null | ICommunity>(null)

  const { isLoading, isError } = useQuery(['getCmmunity', id], () => httpService.get(`${URLS.GET_SINGLE_COMMUNITY}/${data.username}`), {
    onSuccess: (data) => {
      setDetails(data?.data?.data);
    }
  });

  const switchPages = React.useCallback(() => {
    switch(active) {
      case 1: {
        return <Posts />
      }
      case 2: {
        return <AboutCommunity />
      }
      case 3: {
        return <Rules />
      }
    }
  }, [active]);
  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
      <ScrollView>
        {/* BANNER */}
        <Box width='100%' height={120} position='relative' style={{ backgroundColor: '#E3A812' }}>

          <ImageBackground source={{ uri: IMAGE_BASE + details?.banner_image }} style={{ width: '100%', height: '100%' }}>

          <Box flexDirection='row' paddingTop='m' justifyContent='space-between' paddingHorizontal='m'>
            <Box width={40} height={40} borderRadius={20} justifyContent='center' alignItems='center' bg='fadedButtonBgColor' >
              <Feather name='arrow-left' size={25} color={theme.colors.primaryColor} onPress={() => navigation.popToTop()} />
            </Box>

            <Box width={40} height={40} borderRadius={20} justifyContent='center' alignItems='center' bg='fadedButtonBgColor' >
              <Feather name='settings' size={25} color={theme.colors.primaryColor} onPress={() => navigation.navigate('community-settings', { id: 23, username: details.username, type: COMMUNITY_SETTING_TYPE.DEFAULT })} />
            </Box>
          </Box>

          <Box width={120} height={120} borderWidth={4} borderRadius={70} position='absolute' backgroundColor='secondaryBackGroundColor' left={(WIDTH / 100 )* 35} top={60} style={{ borderColor: 'white' }} justifyContent='center' alignItems='center'>
            {details?.profile_image === null ? (
              <Ionicons name='people' size={90} color={theme.colors.mainBackGroundColor} />
            ): (
              <Image source={{ uri: `${IMAGE_BASE}/${details?.profile_image}`}} contentFit='cover' style={{ width: '100%', height: '100%', borderRadius: 70 }} />
            )}
          </Box>

          </ImageBackground>

        </Box>

        <Box alignItems='center' style={{ marginTop: 70 }}>
          <CustomText variant='subheader'>{details?.name}</CustomText>
          <CustomText>{details?.username}</CustomText>
        </Box>

        {/* TABVIEW         */}
        <Box width={'100%'} height={50} flexDirection='row' borderBottomWidth={1} borderBottomColor='secondaryBackGroundColor' paddingHorizontal='l' marginTop='s'>
          <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomColor: theme.colors.primaryColor, borderBottomWidth: active ===1 ?2:0 }} onPress={() => setActive(1)}> 
            <CustomText variant='subheader' fontSize={18} color={active === 1? 'primaryColor':'textColor'}>POST</CustomText>
          </Pressable>

          <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomColor: theme.colors.primaryColor, borderBottomWidth: active ===2 ?2:0 }} onPress={() => setActive(2)}> 
            <CustomText variant='subheader' fontSize={18} color={active === 2? 'primaryColor':'textColor'}>ABOUT</CustomText>
          </Pressable>

          <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomColor: theme.colors.primaryColor, borderBottomWidth: active ===3 ?2:0 }} onPress={() => setActive(3)}> 
            <CustomText variant='subheader' fontSize={18} color={active === 3? 'primaryColor':'textColor'}>RULES</CustomText>
          </Pressable>
        </Box>

        {/* MAIN CONTENT AREA */}

        { switchPages() }

      </ScrollView>
    </Box>
  )
}

export default memo(Community);