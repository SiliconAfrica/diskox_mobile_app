import { View, Text } from 'react-native'
import React from 'react'
import Box from '../../components/general/Box'
import CustomText from '../../components/general/CustomText'
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/MainNavigation';

const Notifications = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'notifications'>) => {
  const theme = useTheme<Theme>();

  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
      <Box width='100%' height={130} flexDirection='row' alignItems='center' paddingHorizontal='m'>
        <Feather onPress={() => navigation.goBack()} name='arrow-left' size={25} color={theme.colors.textColor} />
        <CustomText variant='subheader' marginLeft='m'>Notifications</CustomText>
      </Box>
    </Box>
  )
}

export default Notifications