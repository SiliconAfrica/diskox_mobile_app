import { View, Text } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import CustomText from '../general/CustomText'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import PrimaryButton from '../general/PrimaryButton'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigation/MainNavigation'
import { useNavigation } from '@react-navigation/native'
import { PageType } from '../../pages/login'

const AboutCommunity = () => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<PageType>();
  return (
    <Box flex={1} padding='m'>

      {/* FIRST BOX */}
      <Box width='100%' borderRadius={15} borderWidth={2} borderColor='secondaryBackGroundColor' padding='m'>

        <Box borderBottomWidth={2} borderBottomColor='secondaryBackGroundColor' paddingBottom='m' >
          <CustomText variant='subheader' fontSize={20}>About Community</CustomText>
          <CustomText variant='body' marginTop='s'>Spacehunters travel the cosmos in search of new frontiers and discoveries, pushing the limits of human exploration.</CustomText>
        </Box>

        <Box marginTop='m' paddingBottom='m' borderBottomWidth={2} borderBottomColor='secondaryBackGroundColor' >
          <Box flexDirection='row' justifyContent='space-between'>
            <CustomText variant='subheader' fontSize={20}>Total Members</CustomText>
            <CustomText variant='subheader' fontSize={20} color='primaryColor' onPress={() => navigation.navigate('community-members')}>View members</CustomText>
          </Box>

          <Box flexDirection='row' marginTop='m'>
            <Box>
              <CustomText variant='subheader' fontSize={18}>100</CustomText>
              <CustomText variant='body' marginTop='s' fontSize={14}>Members</CustomText>
            </Box>

            <Box marginLeft='m'>
              <CustomText variant='subheader' fontSize={18}>24</CustomText>
              <CustomText variant='body' marginTop='s' fontSize={14}>Online</CustomText>
            </Box>
          </Box>
        </Box>

        <Box paddingBottom='m' marginTop='m' >
          <Box flexDirection='row' alignItems='center' marginBottom='l'>
            <Ionicons name='calendar' size={30} color={theme.colors.textColor} />
            <CustomText variant='body' fontSize={16} marginLeft='s'>Created Feb 12, 2013</CustomText>
          </Box>
          
          <PrimaryButton title='Create a post' width='100%' onPress={function (): void {
            throw new Error('Function not implemented.')
          } } />
        </Box>

      </Box>

      {/* MODERATORS BOX */}
      <Box marginTop='l' width='100%' borderRadius={15} borderWidth={2} borderColor='secondaryBackGroundColor' padding='m'>
        <CustomText variant='subheader' fontSize={20}>Moderators</CustomText>
      </Box>
    </Box>
  )
}

export default AboutCommunity