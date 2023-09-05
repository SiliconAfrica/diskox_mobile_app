import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Box from '../../../../components/general/Box'
import SettingsHeader from '../../../../components/settings/Header'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../navigation/MainNavigation'
import CustomText from '../../../../components/general/CustomText'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../../theme'
import { ScrollView } from 'react-native-gesture-handler'

const BlockedUserCard = () => {
  const theme = useTheme<Theme>();
  return (
    <Box width='100%' height={80} flexDirection='row' justifyContent='space-between'>

      <Box flexDirection='row'>
          <Box width={50} height={50} borderRadius={25} bg='secondaryBackGroundColor'></Box>
          <Box marginLeft='m'>
            <CustomText variant='xs' style={{ color: 'red' }}>Blocked</CustomText>
            <Box flexDirection='row'>
              <CustomText variant='subheader' fontSize={18}>BigAniita</CustomText>
              <CustomText variant='body' fontSize={18}>@anita</CustomText>
            </Box>
          </Box>
      </Box>

      <Pressable style={{ height: 30, borderRadius: 25, paddingHorizontal: 10, backgroundColor: theme.colors.primaryColor, justifyContent: 'center', alignItems: 'center' }}>
        <CustomText variant='subheader' fontSize={16} style={{ color: 'white' }} >Unblock</CustomText>
      </Pressable>

    </Box>
  )
}

const BlockedUsers= ({ navigation }: NativeStackScreenProps<RootStackParamList, 'notifications-settings'>) => {
  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
      <SettingsHeader title='Blocked users' showSave={false} handleArrowPressed={() => navigation.goBack()} />
      <Box flex={1} marginTop='l'>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
          { Array.from(Array(30).keys()).map((item, index) => {
            return <BlockedUserCard key={index} />
          })}
        </ScrollView>
      </Box>
    </Box>
  )
}

export default BlockedUsers