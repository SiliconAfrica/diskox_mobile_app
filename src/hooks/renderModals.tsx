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
import BlockUserModal from "../components/modals/BlockUserModal";
import DeleteConversationModal from "../components/modals/DeleteConversationModal";
import VerificationModal from "../components/modals/VerificationModal";
import ReportComment from "../components/modals/ReportComment";
import ReportReply from "../components/modals/ReportReply";
import InviteModeratorModal from "../components/modals/InviteModeratorModal";
import SuspendMemberModal from "../components/modals/SuspendMemberModal";
import BlockCommunityMemberModal from "../components/modals/BlockCommunityMemberModal";
import AddCommunityRuleModal from "../components/modals/AddCommunityRuleModal";
import SelectChatModal from "../components/modals/SelectedChatBottom";
import ReactionModal from "../components/modals/ReactionModal";
import TagsModal from "../components/modals/TagsModal";
import ReportUser from "../components/modals/ReportUser";

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
    showReportPost,
    showBlockUser,
    showDeleteConvo,
    showVerification,
    showReportComment,
    showReportReply,
    showInviteModerator,
    showSuspendMemberFromCommunity,
    showBlockMemberFromCommunity,
    showAddCommunityRule,
      showReactedUsers,
      showTags,
      showReportUser
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
        {showBlockUser && <BlockUserModal />}
        {showDeleteConvo && <DeleteConversationModal />}
        {showVerification && <VerificationModal />}
        {showReportComment && <ReportComment />}
        {showReportReply && <ReportReply />}
        {showInviteModerator && <InviteModeratorModal />}
        {showSuspendMemberFromCommunity && <SuspendMemberModal />}
        {showBlockMemberFromCommunity && <BlockCommunityMemberModal />}
        {showAddCommunityRule && <AddCommunityRuleModal />}
        {showReactedUsers && <ReactionModal />}
        {showTags && <TagsModal /> }
        {showReportUser && <ReportUser />}
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
    showReportPost,
    showBlockUser,
    showDeleteConvo,
    showVerification,
    showReportComment,
    showReportReply,
    showInviteModerator,
    showSuspendMemberFromCommunity,
    showBlockMemberFromCommunity,
    showAddCommunityRule,
      showReactedUsers,
      showTags,
      showReportUser
  ]);

  return {
    renderModal,
  };
};

export default renderModals;
