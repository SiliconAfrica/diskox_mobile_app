import { View, Text, Platform } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Posts from "../pages/bottomtabs/posts";
import Polls from "../pages/bottomtabs/polls";
import Questions from "../pages/bottomtabs/questions";
import Chats from "../pages/bottomtabs/chats";
import { Ionicons } from "@expo/vector-icons";
import CustomText from "../components/general/CustomText";
import Box from "../components/general/Box";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../theme";
import Header from "../components/Header";
import { useUtilState } from "../states/util";
import Sidebar from "../components/Sidebar";
import TrendingPosts from "../pages/bottomtabs/trendingpost";
import { Communities } from "../pages/bottomtabs/community";

export type RootBottomTabParamList = {
  posts: { userId: string } | undefined;
  questions: { userId: string } | undefined;
  polls: { userId: string } | undefined;
  chats: { userId: string } | undefined;
  trending: { userId: string } | undefined;
  communities: undefined;
};

export type RootDrawerParamList = {
  dashboard: { userId: string } | undefined;
};

const RootBottomTabs = createBottomTabNavigator<RootBottomTabParamList>();
const DrawerNavigation = createDrawerNavigator<RootDrawerParamList>();


/**
+ * Renders the active icon tab based on the route name.
+ *
+ * @param {boolean} focused - Indicates if the tab is currently focused.
+ * @param {("posts" | "questions" | "polls" | "chats" | "trending")} routeName - The name of the route.
+ * @return {React.ReactNode} The rendered active icon tab.
+ */
// <<<<<  bot-e0c3bd59-c3c4-48a0-ac37-0ff130c1b9af  >>>>>
const ActiveIconTab = ({
  focused,
  routeName,
}: {
  focused: boolean;
  routeName: "home" | "questions" | "polls" | "chats" | "trending" | "community";
}) => {
  const nameOutline = React.useCallback((): any => {
    switch (routeName) {
      case "home": {
        return "home-outline";
      }
      case "chats": {
        return "chatbubble-ellipses-outline";
      }
      case "polls": {
        return "stats-chart-outline";
      }
      case "trending": {
        return "trending-up-outline";
      }
      case "questions": {
        return "help-circle-outline";
      }
      case "community": {
        return 'people-outline'
      }
      default: {
        return "home-outline";
      }
    }
  }, [routeName]);

  const nameFilled = React.useCallback((): any => {
    switch (routeName) {
      case "home": {
        return "home";
      }
      case "chats": {
        return "chatbubble-ellipses";
      }
      case "polls": {
        return "stats-chart";
      }
      case "trending": {
        return "trending-up";
      }
      case "questions": {
        return "help-circle";
      }
      case 'community': {
        return 'people';
      }
      default: {
        return "home";
      }
    }
  }, [routeName]);
  return (
    <>
      {focused && <>
        <Ionicons name={nameFilled()} size={25} color={"#34A853"} />
        <CustomText variant="xs" fontSize={10} color="primaryColor" marginTop="s" >{routeName.toUpperCase()}</CustomText>
      </>}
      {!focused && <>
        <Ionicons name={nameOutline()} size={25} color={"grey"} />
        <CustomText variant="xs" fontSize={10} marginTop="s">{routeName.toUpperCase()}</CustomText>
      </>}
    </>
  );
};

/**
+ * Renders the bottom tabs navigation component.
+ *
+ * @return {JSX.Element} The rendered bottom tabs navigation component.
+ */
const BottomTabs = (): JSX.Element => {
  const theme = useTheme<Theme>();
  const [isLoggedIn] = useUtilState((state) => [state.isLoggedIn])
  return (
    <RootBottomTabs.Navigator 
      // detachInactiveScreens 
      screenOptions={{ 
       
        tabBarStyle: {
          backgroundColor: theme.colors.mainBackGroundColor,
          height: Platform.OS === 'ios' ? 100 : 80,
          borderTopWidth: 1,
          borderTopColor: theme.colors.secondaryBackGroundColor,
        } 
      }} 
    >
      <RootBottomTabs.Screen
        name="posts"
        component={Posts}
        options={{
          headerShown: true,
          header: () => <Header />,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <ActiveIconTab focused={focused} routeName="home" />
          ),
        }}
      />
      <RootBottomTabs.Screen
        name="trending"
        component={TrendingPosts}
        options={{
          headerShown: true,
          header: () => <Header />,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <ActiveIconTab focused={focused} routeName="trending" />
          ),
        }}
      />
      <RootBottomTabs.Screen
        name="polls"
        component={Polls}
        options={{
          headerShown: true,
          header: () => <Header />,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <ActiveIconTab focused={focused} routeName="polls" />
          ),
        }}
      />
      <RootBottomTabs.Screen
        name="questions"
        component={Questions}
        options={{
          headerShown: true,
          header: () => <Header />,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <ActiveIconTab focused={focused} routeName="questions" />
          ),
        }}
      />

    {
      isLoggedIn && (
        <RootBottomTabs.Screen
          name="communities"
          component={Communities}
          options={{
            headerShown: true,
            header: () => <Header />,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <ActiveIconTab focused={focused} routeName="community" />
            ),
          }}
      />
      )
    }

      { isLoggedIn && (
        <RootBottomTabs.Screen
        name="chats"
        component={Chats}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <ActiveIconTab focused={focused} routeName="chats" />
          ),
        }}
      />
      )}
    </RootBottomTabs.Navigator>
  );
};

const DrawerNav =() => {
  const theme = useTheme<Theme>();
  return (
     <DrawerNavigation.Navigator initialRouteName='dashboard' drawerContent={(props) => <Sidebar {...props} />} screenOptions={{
      headerShown: false,
      drawerStyle: {
        backgroundColor: theme.colors.secondaryBackGroundColor,
      },
      
    }}>
      <DrawerNavigation.Screen name="dashboard" component={BottomTabs} />
    </DrawerNavigation.Navigator>
  )
}

export default DrawerNav;
