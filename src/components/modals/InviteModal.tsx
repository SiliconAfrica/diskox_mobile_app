import React from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import ReactNavtieModalWrapper from '../ReactNavtieModalWrapper';
import Box from '../general/Box';
import CustomText from '../general/CustomText';
import CustomButton from '../general/CustomButton';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { FRONTEND_BASE_URL } from '../../utils/httpService';
import { useDetailsState } from '../../states/userState';
import { Feather } from '@expo/vector-icons'
import { useUtilState } from '../../states/util';
import { setStringAsync } from 'expo-clipboard';
import useToast from '../../hooks/useToast';
import { Image } from 'expo-image'

// import { Container } from './styles';
type IProps = {
    isVisible: boolean;
    close: () =>void;
    isLoading: boolean;
}

const InviteModal: React.FC<IProps> = ({ isVisible,close, isLoading }) => {
    const { username } = useDetailsState((state) => state);
    const { isDarkMode } = useUtilState((state) => state)
    const TEXT = `${FRONTEND_BASE_URL}register?ref=${username}`
    const theme = useTheme<Theme>();
    const HEIGHT = useWindowDimensions().height;
    const toast = useToast();


    const copy = async () => {
        await setStringAsync(`${FRONTEND_BASE_URL}register?ref=${username}`);
        toast.show('Copied to clipboard', { type: "success", style: { marginTop: 10} });
      }
  return (
    <ReactNavtieModalWrapper isVisible={isVisible} height={HEIGHT / 100 * 75 } backgroundColor={theme.colors.mainBackGroundColor} >
        <Box width='100%' justifyContent='center' alignItems='center' paddingVertical='m' height={'100%'}>
            <Box width='100%' alignItems='flex-end' paddingHorizontal='s'>
                <Feather name='x' size={25} color={theme.colors.textColor} onPress={() => close()}  />
            </Box>
            <CustomText variant='xs' fontSize={16} textAlign='center'>Enjoying Diskox experience?</CustomText>
            <CustomText variant='header' fontSize={18} textAlign='center'>Invite your friends and family</CustomText>

            <Box width={'80%'} height={300} bg='primaryColor' marginTop='m' borderRadius={10} overflow='hidden'>
                <Image source={require('../../../assets/images/diskoxLarge.png')} contentFit='cover' style={{
                    width:'100%',
                    height: '100%'
                }} />
            </Box>
            
            <Box width={'85%'} marginTop='m' borderWidth={0.5} borderColor='lightGrey' borderRadius={10} overflow='hidden'>
                <Box padding='s'>
                    <CustomText variant='xs' fontSize={16}>
                    Hi there! Discover the ease of connecting with loved ones on Diskox. Sign up effortlessly with my referral code and let's stay seamlessly connected! 
                    </CustomText>
                </Box>
                
                <Box width='100%' flexDirection='row' justifyContent='space-between' alignItems='center' bg={isDarkMode ? 'secondaryBackGroundColor':'fadedButtonBgColor'} padding='s'>
                   <Box flex={0.7} flexWrap='wrap'>
                        <CustomText variant='subheader' style={{ width: '100%' }} fontSize={16}>
                            {TEXT}
                        </CustomText>
                   </Box>

                    <Pressable 
                    style={{ flex: 0.3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                    onPress={() => copy()}
                    >
                        <Feather name='copy' size={15} color={theme.colors.textColor} />
                        <CustomText variant='subheader' fontSize={16} marginLeft='s'>Copy</CustomText>
                    </Pressable>
                </Box>
            </Box>
        </Box>
    </ReactNavtieModalWrapper>
  )
}

export default InviteModal;