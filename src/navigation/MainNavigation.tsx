// import { View, Text, Settings } from 'react-native'
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import Login from '../pages/login';
// import SignUp from '../pages/signup';
import onboarding from "../pages/onboarding";
import Setup from "../pages/set-up";
import CreatePost from "../pages/create-post";
import Profile from "../pages/profile";
import setting from "../pages/setting";
import notifications from "../pages/notifications";
import Chat from "../pages/chat";
import post from "../pages/post";
import BottomTabs from "./BottomTabs";
// import Sidebar from '../components/Sidebar';
import { useTheme } from "@shopify/restyle";
import { Theme } from "../theme";
import VerifyEmail from "../pages/verifyemail";
import CompleteSetup from "../pages/complete-setup";
import ResetPassword from "../pages/password-reset";
import Repost from "../pages/repost";
import Search from "../pages/search";
import ProfileSetting from "../pages/setting/pages/Profile";
import NotificaitionsSettings from "../pages/setting/pages/Notifications";
import Security from "../pages/setting/pages/Security";
import BlockedUsers from "../pages/setting/pages/Blocked";
import CommunitySettings from "../pages/bottomtabs/community/pages/CommunitySettings";
import { COMMUNITY_SETTING_TYPE } from "../enums/CommunitySettings";
import Referrals from "../pages/profile/pages/referrals";
import Announcements from "../pages/announcements";
import SingleAnnouncement from "../pages/singleAnnouncement";

export type RootStackParamList = {
  home: undefined;
  onboarding: { showModal: 1 | 2 | undefined };
  login: undefined;
  "sign-up": undefined;
  "set-up": undefined;
  "create-post": undefined;
  profile: { userId: number };
  "profile-setting": undefined;
  referrals: undefined;
  settings: undefined;
  announcements: undefined;
  singleAnnouncement: { announcementId: number };
  security: undefined;
  notifications: undefined;
  "blocked-users": undefined;
  chat: {
    userId: number;
    profile_image: string;
    username: string;
    last_seen: string;
  };
  post: { postId: number };
  "verify-email": undefined;
  "complete-setup": undefined;
  "reset-password": undefined;
  repost: { id: number };
  search: undefined;
  blocked: undefined;
  "notifications-settings": undefined;
  list: undefined;
  community: { id: number };
  "community-members": { id: number };
  "community-settings": { id: number; type: COMMUNITY_SETTING_TYPE };
};

const RootStackNavigation = createNativeStackNavigator<RootStackParamList>();

/**
+ * Renders the main navigation component.
+ *
+ * @return {JSX.Element} The rendered main navigation component.
+ */
const MainNavigation = (): JSX.Element => {
  const theme = useTheme<Theme>();
  return (
    // <RootStackNavigation.Navigator initialRouteName='home' drawerContent={(props) => <Sidebar {...props} />} screenOptions={{
    //   headerShown: false,
    //   drawerStyle: {
    //     backgroundColor: theme.colors.secondaryBackGroundColor,
    //   },

    // }}>
    <RootStackNavigation.Navigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* AUTHENTICATION FLOWS */}
      <RootStackNavigation.Group navigationKey="Authentication">
        <RootStackNavigation.Screen name="create-post" component={CreatePost} />
        <RootStackNavigation.Screen name="profile" component={Profile} />
        <RootStackNavigation.Screen
          name="profile-setting"
          component={ProfileSetting}
        />
        <RootStackNavigation.Screen name="referrals" component={Referrals} />
        <RootStackNavigation.Screen name="settings" component={setting} />
        <RootStackNavigation.Screen name="security" component={Security} />
        <RootStackNavigation.Screen
          name="notifications"
          component={notifications}
        />
        <RootStackNavigation.Screen
          name="blocked-users"
          component={BlockedUsers}
        />
        <RootStackNavigation.Screen name="chat" component={Chat} />
        <RootStackNavigation.Screen name="repost" component={Repost} />
        <RootStackNavigation.Screen
          name="notifications-settings"
          component={NotificaitionsSettings}
        />
        <RootStackNavigation.Screen
          name="community-settings"
          component={CommunitySettings}
        />
      </RootStackNavigation.Group>

      {/* UNAUTHENTICATED FLOW */}
      <RootStackNavigation.Group navigationKey="Authentication">
        <RootStackNavigation.Screen name="home" component={BottomTabs} />
        <RootStackNavigation.Screen
          name="complete-setup"
          component={CompleteSetup}
        />
        {/* <RootStackNavigation.Screen name='login' component={Login} /> */}
        <RootStackNavigation.Screen
          name="verify-email"
          component={VerifyEmail}
        />
        <RootStackNavigation.Screen name="onboarding" component={onboarding} />
        <RootStackNavigation.Screen name="set-up" component={Setup} />
        <RootStackNavigation.Screen
          name="reset-password"
          component={ResetPassword}
        />
        <RootStackNavigation.Screen name="post" component={post} />
        <RootStackNavigation.Screen name="search" component={Search} />
        <RootStackNavigation.Screen
          name="announcements"
          component={Announcements}
        />
        <RootStackNavigation.Screen
          name="singleAnnouncement"
          component={SingleAnnouncement}
        />
      </RootStackNavigation.Group>
    </RootStackNavigation.Navigator>
  );
};

export default MainNavigation;
