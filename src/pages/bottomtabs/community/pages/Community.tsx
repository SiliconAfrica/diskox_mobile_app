import { View, Text, useWindowDimensions, Pressable } from 'react-native'
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
import { useNavigation } from '@react-navigation/native'

const Community = () => {
  const theme = useTheme<Theme>();
  const WIDTH = useWindowDimensions().width;
  const [active, setActive] = React.useState(1);

  const navigation = useNavigation<PageType>();

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

          <Box flexDirection='row' paddingTop='m' justifyContent='space-between' paddingHorizontal='m'>
            <Box width={40} height={40} borderRadius={20} justifyContent='center' alignItems='center' style={{ backgroundColor: '#FFFFFF33' }}>
              <Feather name='arrow-left' size={25} color={theme.colors.textColor} onPress={() => navigation.popToTop()} />
            </Box>

            <Box width={40} height={40} borderRadius={20} justifyContent='center' alignItems='center' style={{ backgroundColor: '#FFFFFF33' }}>
              <Feather name='settings' size={25} color={theme.colors.textColor} onPress={() => navigation.navigate('community-settings', { id: 23, type: COMMUNITY_SETTING_TYPE.DEFAULT })} />
            </Box>
          </Box>

          <Box width={120} height={120} borderWidth={4} borderRadius={70} position='absolute' backgroundColor='secondaryBackGroundColor' left={(WIDTH / 100 )* 35} top={60} style={{ borderColor: 'white' }} justifyContent='center' alignItems='center'>
            <Ionicons name='people' size={90} color={theme.colors.mainBackGroundColor} />
          </Box>

        </Box>

        <Box alignItems='center' style={{ marginTop: 70 }}>
          <CustomText variant='subheader'>SkyHunters</CustomText>
          <CustomText>c/SkyHunters</CustomText>
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