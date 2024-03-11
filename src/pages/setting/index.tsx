import * as React from "react";
import { View, useWindowDimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/MainNavigation";
import Box from "../../components/general/Box";
import SettingsHeader from "../../components/settings/Header";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import CustomText from "../../components/general/CustomText";
import Profile from "./pages/Profile";
import Security from "./pages/Security";
import NotificaitionsSettings from "./pages/Notifications";
import BlockedUsers from "./pages/Blocked";

const ProfileTab = () => <Profile />;

const SecurityTab = () => <Security />;
const BlockedTab = () => <BlockedUsers />;
const NotificationTab = () => <NotificaitionsSettings />;

const renderScene = SceneMap({
  profile: ProfileTab,
  security: SecurityTab,
  blocked: BlockedTab,
  notifications: NotificationTab,
});

export default function TabViewExample({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "settings">) {
  const layout = useWindowDimensions();
  const theme = useTheme<Theme>();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "profile", title: "Profile" },
    { key: "security", title: "Security" },
    { key: "blocked", title: "Blocked" },
    { key: "notifications", title: "Notification" },
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      getLabelText={({ route }) => (
        <CustomText color="black" style={{ fontSize: 11 }}>
          {route.title}
        </CustomText>
      )}
      indicatorStyle={{
        backgroundColor: theme.colors.black,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.primaryColor,
      }}
      style={{ backgroundColor: theme.colors.white }}
    />
  );

  return (
    <Box flex={1} backgroundColor="almostPrimaryGreen">
      <SettingsHeader
        title="Settings"
        showSave={false}
        handleArrowPressed={() => {
          navigation.goBack();
        }}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </Box>
  );
}
