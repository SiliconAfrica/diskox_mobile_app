import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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

export type RootBottomTabParamList = {
  posts: { userId: string } | undefined;
  questions: { userId: string } | undefined;
  polls: { userId: string } | undefined;
  chats: { userId: string } | undefined;
  trending: { userId: string } | undefined;
};

const RootBottomTabs = createBottomTabNavigator<RootBottomTabParamList>();


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
  routeName: "posts" | "questions" | "polls" | "chats" | "trending";
}) => {
  const nameOutline = React.useCallback((): any => {
    switch (routeName) {
      case "posts": {
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
      default: {
        return "home-outline";
      }
    }
  }, [routeName]);

  const nameFilled = React.useCallback((): any => {
    switch (routeName) {
      case "posts": {
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
      default: {
        return "home";
      }
    }
  }, [routeName]);
  return (
    <>
      {focused && <>
        <Ionicons name={nameFilled()} size={25} color={"#34A853"} />
        <CustomText variant="xs" color="primaryColor">{routeName.toUpperCase()}</CustomText>
      </>}
      {!focused && <>
        <Ionicons name={nameOutline()} size={25} color={"grey"} />
        <CustomText variant="xs">{routeName.toUpperCase()}</CustomText>
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
  return (
    <RootBottomTabs.Navigator 
      detachInactiveScreens 
      screenOptions={{ 
        headerShown: true,
        header: () => <Header />,
        tabBarStyle: {
          backgroundColor: theme.colors.mainBackGroundColor,
          height: 80,
        } 
      }} 
    >
      <RootBottomTabs.Screen
        name="posts"
        component={Posts}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <ActiveIconTab focused={focused} routeName="posts" />
          ),
        }}
      />
      <RootBottomTabs.Screen
        name="polls"
        component={Polls}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <ActiveIconTab focused={focused} routeName="polls" />
          ),
        }}
      />
      <RootBottomTabs.Screen
        name="trending"
        component={Posts}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <ActiveIconTab focused={focused} routeName="trending" />
          ),
        }}
      />
      <RootBottomTabs.Screen
        name="questions"
        component={Questions}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <ActiveIconTab focused={focused} routeName="questions" />
          ),
        }}
      />
      <RootBottomTabs.Screen
        name="chats"
        component={Chats}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <ActiveIconTab focused={focused} routeName="chats" />
          ),
        }}
      />
    </RootBottomTabs.Navigator>
  );
};

export default BottomTabs;
