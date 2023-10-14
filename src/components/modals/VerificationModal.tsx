import { View, Text } from 'react-native'
import React, { useEffect, useRef } from 'react'
import ModalWrapper from '../ModalWrapper'
import Login from '../../pages/login'
import { useModalState } from '../../states/modalState'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import Box from '../general/Box'
import CustomText from '../general/CustomText'
import PrimaryButton from '../general/PrimaryButton'
import { Image } from 'expo-image'

const VerificationModal = () => {
    const [setAll] = useModalState((state) => [state.setAll]);
    const ref = useRef<BottomSheetModal>();

    useEffect(() => {
        ref.current.present();
    }, [])
  return (
    <ModalWrapper
        onClose={() => setAll({ showVerification: false })}
        shouldScrroll
        snapPoints={['55%']}
        ref={ref}
    >
       <Box flex={1} backgroundColor='mainBackGroundColor' paddingHorizontal='m' alignItems='center'>
        <Box width='100%' height={100} justifyContent='center' alignItems='center'>
            <Box width={100} height={100} borderRadius={50} backgroundColor='fadedButtonBgColor' justifyContent='center' alignItems='center'>
                <Image source={require('../../../assets/images/verify.png')} contentFit='cover' style={{ width: 70, height: 70 }} />
            </Box>
        </Box>

        <CustomText variant='header' textAlign='center' marginTop='m'>We’ve Received Your Verification Application</CustomText>
        <CustomText variant='xs' fontSize={20} marginTop='s' textAlign='center' style={{ width: '75%' }}>We’ll review your application and get back to you via registered email within the next 14 working days.</CustomText>

        <Box width='100%' height={100}  marginTop='m' alignItems='center'>
            <PrimaryButton title='Okay' width={100} height={50} onPress={() => setAll({ showVerification: false })} />
        </Box>

       </Box>
    </ModalWrapper>
  )
}

export default VerificationModal