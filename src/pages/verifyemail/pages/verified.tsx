import { View, Text } from 'react-native'
import React from 'react'
import Box from '../../../components/general/Box'
import CustomText from '../../../components/general/CustomText'
import NormalButton from '../../../components/general/NormalButton'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../../../navigation/MainNavigation'

const Verified = () => {
  const navigate = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <Box flex={1}>
    <Box flex={0.8} paddingTop='xl'>
        <Box height={100} />
        <CustomText variant='header' textAlign='center' marginTop='xl'>Verification Successful</CustomText>
        <CustomText variant='body' textAlign='center' marginTop='m'>Congratulations! Your email has been verified successfully</CustomText>

    </Box>
    <Box flex={0.2}>
        <NormalButton label='Continue' action={() => navigate.navigate('set-up')} />
    </Box>
</Box>
  )
}

export default Verified