import { View, Text } from 'react-native'
import React from 'react'
import { useModalState } from '../states/modalState'
import LoginModal from '../components/modals/loginModal';
import SignupModal from '../components/modals/SignupModal';
import ShareModal from '../components/modals/ShareModal';
import VisibilityModal from '../components/modals/VisibiltyModal';
import FilterPostModal from '../components/modals/FilterPostModal';
import UsersModal from '../components/chats/UsersModal';
import PostActionModal from '../components/modals/PostActionModal';

const renderModals = () => {
    const { showLogin, showSignup, showShare, showVisibility, showFilter, showPostAction } = useModalState((state) => state);

    const renderModal = React.useCallback(() => {
        return (
            <>
                {/* BOTTOM SHEET MODALS */}
                { showLogin && <LoginModal /> }
                { showSignup && <SignupModal /> }
                { showShare && <ShareModal /> }
                { showVisibility && <VisibilityModal /> }
                { showFilter && <FilterPostModal /> }
                { showPostAction && <PostActionModal /> }
            </>
        )
    }, [showLogin, showSignup, showShare, showVisibility, showFilter, showPostAction])

  return {
    renderModal,
  };
};

export default renderModals;
