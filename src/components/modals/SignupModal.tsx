import {  BackHandler } from 'react-native'
import React, { useEffect, useRef } from 'react'
import ModalWrapper from '../ModalWrapper'
import Login from '../../pages/login'
import { useModalState } from '../../states/modalState'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import SignUp from '../../pages/signup'
import { useSignupState } from '../../pages/signup/state'

const SignupModal = () => {
    const [setAll] = useModalState((state) => [state.setAll]);
    const { reset, setAll: setValues, stage } = useSignupState((state) => state)
    const ref = useRef<BottomSheetModal>();

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
        snapPoints={['90%']}
        ref={ref}
    >
        <SignUp />
    </ModalWrapper>
  )
}

export default SignupModal