import {  BackHandler } from 'react-native'
import React, { useEffect, useRef } from 'react'
import ModalWrapper from '../ModalWrapper'
import Login from '../../pages/login'
import { useModalState } from '../../states/modalState'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import SignUp from '../../pages/signup'
import { useSignupState } from '../../pages/signup/state'
import Box from '../general/Box'
import CustomText from '../general/CustomText'
import CustomButton from '../general/CustomButton'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'

const BlockUserModal = () => {
    const [setAll, activeChat] = useModalState((state) => [state.setAll, state.activeChat]);
    const { reset, setAll: setValues, stage } = useSignupState((state) => state)
    const ref = useRef<BottomSheetModal>();
    const theme = useTheme<Theme>()

    useEffect(() => {
        ref.current.present();
        const backhandler = BackHandler.addEventListener('hardwareBackPress', () => {
          if (stage === 1) {
            setAll({ showSignup: false });
            return true;
          }else {
            setValues({ stage: stage - 1 });
            return true
          }
        });
        return () => {
          backhandler.remove();
        }
    }, []);

    const onClose = React.useCallback(() => {
      reset();
      setAll({ showSignup: false });
    }, [])
  return (
    <ModalWrapper
        onClose={onClose}
        shouldScrroll
        snapPoints={['30%']}
        ref={ref}
    >
        <Box flex={1} backgroundColor='mainBackGroundColor' paddingHorizontal='m' alignItems='center'>
            <CustomText variant='header' textAlign='center' fontSize={20} color='black'>Block {activeChat.username}</CustomText>
            <CustomText textAlign='center' variant='body' marginVertical='l'>Blocking this user prevents them from interacting or viewing your profile and sending messages. You won’t receive any notification from them anymore.</CustomText>

            <CustomButton title='Yes, Block User' onPress={() => {}} height={44} color={theme.colors.primaryColor}  />
        </Box>
    </ModalWrapper>
  )
}

export default BlockUserModal