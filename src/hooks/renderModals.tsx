import { View, Text } from "react-native";
import React from "react";
import { useModalState } from "../states/modalState";
import LoginModal from "../components/modals/loginModal";
import SignupModal from "../components/modals/SignupModal";
import ShareModal from "../components/modals/ShareModal";
import VisibilityModal from "../components/modals/VisibiltyModal";
import FilterPostModal from "../components/modals/FilterPostModal";
import UsersModal from "../components/chats/UsersModal";
import PostActionModal from "../components/modals/PostActionModal";
import MonetizationModal from "../components/modals/MonetizationModal";
import VideoImageGallery from "../components/feeds/videoImageGallery";
import ReportPost from "../components/modals/ReportPost";

const renderModals = () => {
  const {
    showLogin,
    showSignup,
    showShare,
    showVisibility,
    showFilter,
    showPostAction,
    showMonetization,
    showImageVideoSlider,
    showReportPost
  } = useModalState((state) => state);

  const renderModal = React.useCallback(() => {
    return (
      <>
        {/* BOTTOM SHEET MODALS */}
        {showLogin && <LoginModal />}
        {showSignup && <SignupModal />}
        {showShare && <ShareModal />}
        {showVisibility && <VisibilityModal />}
        {showFilter && <FilterPostModal />}
        {showPostAction && <PostActionModal />}
        {showMonetization && <MonetizationModal />}
        {showImageVideoSlider && <VideoImageGallery />}
        {showReportPost && <ReportPost />}
      </>
    );
  }, [
    showLogin,
    showSignup,
    showShare,
    showVisibility,
    showFilter,
    showPostAction,
    showMonetization,
    showImageVideoSlider,
    showReportPost
  ]);

  return {
    renderModal,
  };
};

export default renderModals;
