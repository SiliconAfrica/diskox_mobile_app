import { View, Text } from 'react-native'
import React from 'react'
import { useResetState } from './pages/state'
import Email from './pages/email';
import Verify from './pages/verify';
import Reset from './pages/reset';
import Box from '../../components/general/Box';
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import CustomText from '../../components/general/CustomText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/MainNavigation';

const ResetPassword = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'reset-password'>) => {
    const { stage } = useResetState((state) => state);
    const theme = useTheme<Theme>();

    const switchPages = React.useCallback(() => {
            switch(stage) {
                case 1: {
                    return <Email />
                }
                case 2: {
                    return <Reset />
                }
                default: {
                    return <Email />
                }
            }
    }, [stage]);
  return (
    <Box flex={1} backgroundColor='mainBackGroundColor' paddingHorizontal='m'>
        <Box flexDirection='row' alignItems='center' paddingTop='l' flex={0.13}   >
            <Ionicons onPress={() => navigation.goBack()} name='arrow-back-outline' size={30} color={theme.colors.textColor}  />
            <CustomText variant='subheader' marginLeft='s' fontSize={23}>Reset Password</CustomText>
        </Box>
        {switchPages()}
    </Box>
  )
}

export default ResetPassword