import { View, Text } from 'react-native'
import React, { useEffect, useRef } from 'react'
import ModalWrapper from '../ModalWrapper'
import Login from '../../pages/login'
import { useModalState } from '../../states/modalState'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import Box from '../general/Box'

const LoginModal = () => {
    const [setAll] = useModalState((state) => [state.setAll]);
    const ref = useRef<BottomSheetModal>();

    useEffect(() => {
        ref.current.present();
    }, [])
  return (
    <ModalWrapper
        onClose={() => setAll({ showLogin: false })}
        shouldScrroll
        snapPoints={['90%']}
        ref={ref}
    >
       <Box flex={1} backgroundColor='mainBackGroundColor' paddingHorizontal='m'>
        <Login />
       </Box>
    </ModalWrapper>
  )
}

export default LoginModal