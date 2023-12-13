import { View, Text } from "react-native";
import React, { memo, useEffect } from "react";
import Box from "../../../../components/general/Box";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/MainNavigation";
import { COMMUNITY_SETTING_TYPE } from "../../../../enums/CommunitySettings";
import Settings from "./Settingspages/Settings";
import ContentControl from "./Settingspages/contentcontrol";
import CommunityType from "./Settingspages/CommunityType";
import EditCommunity from "./Settingspages/EditCommunity";
import Topics from "./Settingspages/Topics";
import MemberRequest from "./Settingspages/MemberRequest";
import Members from "./Settingspages/Members";
import PostApproval from "./Settingspages/PostApproval";
import Moderators from "./Settingspages/Moderators";
import InviteModerators from "./Settingspages/Invitemoderatorr";
import Suspended from "./Settingspages/Suspended";
import Blocked from "./Settingspages/Blocked";
import Invites from "./Settingspages/Invites";
import Rules from "./Settingspages/Rules";
import RemovalReason from "./Settingspages/RemovalReason";
import { useCommunityDetailsState } from "../states/Settings.state";
import { useQuery } from "react-query";
import httpService from "../../../../utils/httpService";
import { URLS } from "../../../../services/urls";
import { ICommunity } from "../../../../models/Community";
import SuspendMember from "./Settingspages/SuspendMember";
import BlockMember from "./Settingspages/BlockMember";

const CommunitySettings = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "community-settings">) => {
  const { id, type, username } = route.params;
  const { setAll } = useCommunityDetailsState((state) => state);

  const { isError, isLoading, refetch } = useQuery(
    ["getCommunityDetails", username],
    () => httpService.get(`${URLS.GET_SINGLE_COMMUNITY}/${username}`),
    {
      onSuccess: (data) => {
        const item: ICommunity = data?.data?.data;
        setAll({
          id: item?.id,
          username: item?.username,
          title: item?.name,
          description: item?.description,
          topics: item?.topics,
          type: item?.type,
          banner_image: item?.banner_image,
          profile_image: item?.profile_image,
          restricted: item?.restricted,
          post_approval: item?.post_approval,
          status: item?.status,
          user_id: item?.user_id,
        });
      },
    }
  );

  const renderTitle = React.useCallback(() => {
    switch (type) {
      case COMMUNITY_SETTING_TYPE.DEFAULT: {
        return "Settings";
      }
      case COMMUNITY_SETTING_TYPE.EDIT: {
        return "Edit profile";
      }
      case COMMUNITY_SETTING_TYPE.TYPE: {
        return "Community type";
      }
      case COMMUNITY_SETTING_TYPE.REQUEST: {
        return "Member requests";
      }
      case COMMUNITY_SETTING_TYPE.POSTS: {
        return "Post approval";
      }
      case COMMUNITY_SETTING_TYPE.SUSPENDED_MEMBERS: {
        return "Suspended";
      }
      case COMMUNITY_SETTING_TYPE.SUSPEND_MEMBER: {
        return "SuspendMember";
      }
      case COMMUNITY_SETTING_TYPE.BLOCKED_MEMBERS: {
        return "Blocked";
      }
      case COMMUNITY_SETTING_TYPE.BLOCK_MEMBER: {
        return "BlockMember";
      }
      case COMMUNITY_SETTING_TYPE.INVITE: {
        return "Invite moderators";
      }
      case COMMUNITY_SETTING_TYPE.MODERATORS: {
        return "Moderators";
      }
      case COMMUNITY_SETTING_TYPE.RULES: {
        return "Rules";
      }
      case COMMUNITY_SETTING_TYPE.UPDATE_RULE: {
        return "Update rule";
      }
      case COMMUNITY_SETTING_TYPE.ADD_RULE: {
        return "Add rule";
      }
      case COMMUNITY_SETTING_TYPE.REMOVAL_RREASON: {
        return "Removal reason";
      }
      case COMMUNITY_SETTING_TYPE.ADD_REMOVAL_REASON: {
        return "Add reason";
      }
      case COMMUNITY_SETTING_TYPE.UPDATE_REMOVAL_REASON: {
        return "Update removal reason";
      }
      case COMMUNITY_SETTING_TYPE.CONTENT_CONTROL: {
        return "Content control";
      }
      case COMMUNITY_SETTING_TYPE.TOPIC: {
        return "Change topic";
      }
      case COMMUNITY_SETTING_TYPE.MEMBERS: {
        return "Members";
      }
      default: {
        return "Setting Page";
      }
    }
  }, [type]);

  const renderPage = React.useCallback(() => {
    switch (type) {
      case COMMUNITY_SETTING_TYPE.DEFAULT: {
        return <Settings />;
      }
      case COMMUNITY_SETTING_TYPE.CONTENT_CONTROL: {
        return <ContentControl />;
      }
      case COMMUNITY_SETTING_TYPE.TYPE: {
        return <CommunityType />;
      }
      case COMMUNITY_SETTING_TYPE.EDIT: {
        return <EditCommunity />;
      }
      case COMMUNITY_SETTING_TYPE.TOPIC: {
        return <Topics />;
      }
      case COMMUNITY_SETTING_TYPE.REQUEST: {
        return <MemberRequest />;
      }
      case COMMUNITY_SETTING_TYPE.MEMBERS: {
        return <Members />;
      }
      case COMMUNITY_SETTING_TYPE.POSTS: {
        return <PostApproval />;
      }
      case COMMUNITY_SETTING_TYPE.MODERATORS: {
        return <Moderators />;
      }
      case COMMUNITY_SETTING_TYPE.INVITE: {
        return <InviteModerators />;
      }
      case COMMUNITY_SETTING_TYPE.SUSPENDED_MEMBERS: {
        return <Suspended />;
      }
      case COMMUNITY_SETTING_TYPE.SUSPEND_MEMBER: {
        return <SuspendMember />;
      }
      case COMMUNITY_SETTING_TYPE.BLOCKED_MEMBERS: {
        return <Blocked />;
      }
      case COMMUNITY_SETTING_TYPE.BLOCK_MEMBER: {
        return <BlockMember />;
      }
      case COMMUNITY_SETTING_TYPE.INVITE_MEMBERS: {
        return <Invites />;
      }
      case COMMUNITY_SETTING_TYPE.RULES: {
        return <Rules />;
      }
      case COMMUNITY_SETTING_TYPE.REMOVAL_RREASON: {
        return <RemovalReason />;
      }
    }
  }, [type]);

  return (
    <Box flex={1} backgroundColor="mainBackGroundColor" paddingTop="s">
      {renderPage()}
    </Box>
  );
};

export default CommunitySettings;
