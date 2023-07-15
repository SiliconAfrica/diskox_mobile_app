import { View, Text, Settings } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from '../pages/login';
import SignUp from '../pages/signup';
import onboarding from '../pages/onboarding';
import Setup from '../pages/set-up';
import CreatePost from '../pages/create-post';
import Profile from '../pages/profile';
import setting from '../pages/setting';
import Security from '../pages/security';
import notifications from '../pages/notifications';
import BlockedUsers from '../pages/blocked-users';
import Chat from '../pages/chat';
import post from '../pages/post';
import BottomTabs from './BottomTabs';
import Sidebar from '../components/Sidebar';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';

export type RootStackParamList = {
    'home': undefined;
    'onboarding': undefined;
    'login': undefined;
    'sign-up': undefined;
    'set-up': undefined;
    'create-post': undefined;
    profile: { userId: string };
    settings: { userId: string };
    security: { userId: string };
    notifications: { userId: string };
    'blocked-users': { userId: string };
    chat: { userId: string };
    post: { postId: string };
  };

  const RootStackNavigation = createDrawerNavigator<RootStackParamList>();

/**
+ * Renders the main navigation component.
+ *
+ * @return {JSX.Element} The rendered main navigation component.
+ */
const MainNavigation = (): JSX.Element => {
  const theme = useTheme<Theme>();
  return (
    <RootStackNavigation.Navigator initialRouteName='home' drawerContent={(props) => <Sidebar {...props} />} screenOptions={{
      headerShown: false,
      drawerStyle: {
        backgroundColor: theme.colors.secondaryBackGroundColor,
      },
      
    }}>
        {/* AUTHENTICATION FLOWS */}
        <RootStackNavigation.Group navigationKey='Authentication'>
            <RootStackNavigation.Screen name='create-post' component={CreatePost} />
            <RootStackNavigation.Screen name='profile' component={Profile} />
            <RootStackNavigation.Screen name='settings' component={setting} />
            <RootStackNavigation.Screen name='security' component={Security} />
            <RootStackNavigation.Screen name='notifications' component={notifications} />
            <RootStackNavigation.Screen name='blocked-users' component={BlockedUsers} />
            <RootStackNavigation.Screen name='chat' component={Chat} />
            <RootStackNavigation.Screen name='post' component={post} />
        </RootStackNavigation.Group>

        {/* UNAUTHENTICATED FLOW */}
        <RootStackNavigation.Group navigationKey='Authentication'>
            <RootStackNavigation.Screen name='home' component={BottomTabs} />
            <RootStackNavigation.Screen name='login' component={Login} />
            <RootStackNavigation.Screen name='sign-up' component={SignUp} />
            <RootStackNavigation.Screen name='onboarding' component={onboarding} />
            <RootStackNavigation.Screen name='set-up' component={Setup} />
        </RootStackNavigation.Group>
    </RootStackNavigation.Navigator>
  )
}

export default MainNavigation