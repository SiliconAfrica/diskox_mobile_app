import { View, Text, Pressable } from "react-native";
import React from "react";
import Box from "./general/Box";
import { backgroundColor, useTheme } from "@shopify/restyle";
import { Theme } from "../theme";
import { Image } from "expo-image";
import CustomText from "./general/CustomText";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootStackParamList } from "../navigation/MainNavigation";
import { useUtilState } from "../states/util";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useDetailsState } from "../states/userState";
import { IMAGE_BASE } from "../utils/httpService";

const Header = () => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
  const [isDarkMode, isLoggedIn] = useUtilState((state) => [
    state.isDarkMode,
    state.isLoggedIn,
  ]);
  const { profile_image, username, id } = useDetailsState((state) => state);

  return (
    <Box
      paddingHorizontal="m"
      paddingTop="l"
      backgroundColor="mainBackGroundColor"
      height={110}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      borderBottomWidth={1}
      borderBottomColor="secondaryBackGroundColor"
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Feather
          name="menu"
          size={25}
          color={theme.colors.textColor}
          onPress={() => navigation.openDrawer()}
        />
        <Image
          source={
            isDarkMode
              ? require("../../assets/images/logo.png")
              : require("../../assets/images/logoB.png")
          }
          style={{
            width: 60,
            height: 60,
            resizeMode: "contain",
            marginLeft: 20,
          }}
          contentFit="contain"
          transition={1000}
        />
      </View>

      {!isLoggedIn && (
        <Pressable
          onPress={() =>
            navigation.navigate("onboarding", { showModal: undefined })
          }
          style={{
            width: 80,
            height: 32,
            borderRadius: 45,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.primaryColor,
          }}
        >
          <CustomText
            variant="header"
            fontSize={16}
            style={{ color: "white" }}
            color="white"
          >
            Login
          </CustomText>
        </Pressable>
      )}
      {isLoggedIn && (
        <Box flexDirection="row" alignItems="center">
          <Ionicons
            name="search-outline"
            onPress={() => navigation.navigate("search")}
            size={25}
            color={theme.colors.textColor}
          />
          <Ionicons
            name="notifications-outline"
            onPress={() => navigation.navigate("notifications")}
            size={25}
            color={theme.colors.textColor}
            style={{ marginHorizontal: 10 }}
          />
          <Box
            width={30}
            height={30}
            borderRadius={25}
            backgroundColor="fadedButtonBgColor"
            justifyContent="center"
            alignItems="center"
          >
            <Ionicons
              name="add-outline"
              size={25}
              color={theme.colors.primaryColor}
              onPress={() => navigation.navigate("create-post")}
            />
          </Box>
          {profile_image && (
            <Pressable
              onPress={() => navigation.navigate("profile", { userId: id })}
            >
              <Image
                source={{ uri: `${IMAGE_BASE}${profile_image}` }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 17,
                  marginLeft: 10,
                }}
                contentFit="cover"
              />
            </Pressable>
          )}
          {!profile_image && (
            <Pressable
              style={{
                width: 40,
                height: 40,
                borderRadius: 25,
                backgroundColor: theme.colors.fadedButtonBgColor,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 10,
              }}
              onPress={() => navigation.navigate("profile", { userId: id })}
            >
              <CustomText
                variant="subheader"
                color="primaryColor"
                fontSize={18}
              >
                {username[0]?.toUpperCase()}
              </CustomText>
            </Pressable>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Header;
