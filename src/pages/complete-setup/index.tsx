import React from 'react'
import Box from '../../components/general/Box'
import { Ionicons } from '@expo/vector-icons';
import CustomText from '../../components/general/CustomText';
import NormalButton from '../../components/general/NormalButton';
import { ActivityIndicator } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';

const CompleteSetup = () => {
    const theme = useTheme<Theme>();
  return (
    <Box backgroundColor='mainBackGroundColor' flex={1} paddingHorizontal='m'>
        <Box flex={0.7} >
            <Box flex={0.4} alignItems='center' justifyContent='flex-end' pb="m">
                <Box width={80} height={80} borderRadius={40} backgroundColor='primaryColor' justifyContent='center' alignItems='center'>
                    <Ionicons name='person' size={60} color='white' />
                </Box>
            </Box>
            <CustomText variant='subheader' textAlign='center'>
            Your profile is 50% complete
            </CustomText>
            <CustomText variant='body' textAlign='center' mt='s'>
            Click on continue to finish setting up your profile
            </CustomText>
        </Box>

        <Box flex={0.3} alignItems='center' justifyContent='center'>
            <ActivityIndicator color={theme.colors.textColor} size='large' />
            <CustomText variant='body' mt='m'>I’ll do this later</CustomText>
            <NormalButton label='Continue' action={() => {}} />
        </Box>
    </Box>
  )
}

export default CompleteSetup