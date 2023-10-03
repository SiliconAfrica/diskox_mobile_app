import { View, Text, Pressable } from "react-native";
import React from "react";
import Box from "./general/Box";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../theme";
import { useUtilState } from "../states/util";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Foundation,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import CustomText from "./general/CustomText";
import { ScrollView, Switch } from "react-native-gesture-handler";
import * as SecureStorage from "expo-secure-store";

const Item = ({
  icon,
  title,
  action,
}: {
  icon: JSX.Element;
  title: string;
  action?: () => void;
}) => {
  return (
    <Pressable
      onPress={action}
      style={{ flexDirection: "row", alignItems: "center", height: 50 }}
    >
      {icon}
      <CustomText variant="body" marginLeft="m">
        {title}
      </CustomText>
    </Pressable>
  );
};

const Sidebar = ({ navigation }: DrawerContentComponentProps) => {
  const theme = useTheme<Theme>();
  const [isLoggedIn, isDarkMode, setAll] = useUtilState((state) => [
    state.isLoggedIn,
    state.isDarkMode,
    state.setAll,
  ]);

  const handleDarkMode = React.useCallback(
    async (dark: boolean) => {
      setAll({ isDarkMode: dark });
      await SecureStorage.setItemAsync(
        "darkMode",
        JSON.stringify({ isDarkMode: dark })
      );
    },
    [isDarkMode]
  );
  return (
    <Box flex={1} backgroundColor="secondaryBackGroundColor" marginTop="xl">
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
      >
        <Image
          source={
            isDarkMode
              ? require("../../assets/images/logo.png")
              : require("../../assets/images/logoB.png")
          }
          contentFit="contain"
          transition={1000}
          style={{ height: 60, width: 60 }}
        />
        <Feather
          name="x"
          size={25}
          color={theme.colors.textColor}
          onPress={() => navigation.toggleDrawer()}
        />
      </View>
      <ScrollView>
        <Box paddingHorizontal="m">
          <Item
            icon={
              <Ionicons
                name="person-circle"
                size={25}
                color={theme.colors.textColor}
              />
            }
            title="Guest"
          />
          {isLoggedIn && (
            <>
              <Item
                icon={
                  <MaterialIcons
                    name="person-add-alt"
                    size={25}
                    color={theme.colors.textColor}
                  />
                }
                title="Add an account"
                action={() =>
                  navigation.navigate("onboarding", {
                    showModal: 1,
                    addAccount: true,
                  })
                }
              />
              <Item
                icon={
                  <Ionicons
                    name="bookmark"
                    size={25}
                    color={theme.colors.textColor}
                  />
                }
                title="Saved"
              />
              <Item
                icon={
                  <Ionicons
                    name="settings"
                    size={25}
                    color={theme.colors.textColor}
                  />
                }
                action={() => navigation.navigate("settings")}
                title="Settings"
              />
              <Item
                icon={
                  <Ionicons
                    name="stats-chart"
                    size={25}
                    color={theme.colors.textColor}
                  />
                }
                title="Analytics"
              />
            </>
          )}
        </Box>
        <Box
          paddingHorizontal="m"
          borderTopWidth={1}
          borderBottomWidth={1}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          height={60}
          style={{ borderColor: isDarkMode ? "grey" : "lightgrey" }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name={isDarkMode ? "moon" : "sunny"}
              size={25}
              color={theme.colors.textColor}
            />
            <CustomText variant="body" marginLeft="m">
              {isDarkMode ? "Light" : "Dark"}
            </CustomText>
          </View>

          <Switch
            value={isDarkMode}
            onChange={() => handleDarkMode(!isDarkMode)}
            thumbColor={theme.colors.primaryColor}
            trackColor={{
              true: isDarkMode ? "grey" : "lightgrey",
              false: theme.colors.textColor,
            }}
          />
        </Box>
        <Box paddingHorizontal="m">
          <Item
            icon={
              <MaterialCommunityIcons
                name="bullhorn"
                size={24}
                color={theme.colors.textColor}
              />
            }
            action={() => navigation.navigate("announcements")}
            title="Announcements"
          />
          <Item
            icon={
              <Foundation
                name="book-bookmark"
                size={24}
                color={theme.colors.textColor}
              />
            }
            action={() => navigation.navigate("knowledgeBase")}
            title="Knowledge Base"
          />
        </Box>
        <Box paddingHorizontal="m" paddingTop="l">
          <CustomText variant="subheader" fontSize={18}>
            Explore Popular Tags
          </CustomText>
          <CustomText variant="body" marginTop="m">
            #house
          </CustomText>
          <CustomText variant="body" marginTop="m">
            #Politics
          </CustomText>
          <CustomText variant="body" marginTop="m">
            #Politics
          </CustomText>
          <CustomText variant="body" marginTop="m">
            #LpMustWin
          </CustomText>

          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
              height: 20,
            }}
          >
            <CustomText variant="body">View More</CustomText>
            <Feather
              name="chevron-right"
              size={25}
              color={theme.colors.textColor}
            />
          </Pressable>
        </Box>
      </ScrollView>
    </Box>
  );
};

export default Sidebar;
