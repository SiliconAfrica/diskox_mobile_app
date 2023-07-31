import { View, Text } from 'react-native'
import React from 'react'
import { useModalState } from '../states/modalState'
import LoginModal from '../components/modals/loginModal';
import SignupModal from '../components/modals/SignupModal';

const renderModals = () => {
    const { showLogin, showSignup } = useModalState((state) => state);

    const renderModal = React.useCallback(() => {
        return (
            <>
                {/* BOTTOM SHEET MODALS */}
                { showLogin && <LoginModal /> }
                { showSignup && <SignupModal /> }
            </>
        )
    }, [showLogin, showSignup])
  return {
    renderModal
  }
}

export default renderModals