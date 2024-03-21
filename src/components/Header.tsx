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
import httpService, { IMAGE_BASE } from "../utils/httpService";
import { useQuery } from "react-query";
import { URLS } from "../services/urls";
import { CUSTOM_STATUS_CODE } from "../enums/CustomCodes";

const Header = ({ showMenuButton = true }: { showMenuButton?: boolean }) => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
  const [isDarkMode, isLoggedIn] = useUtilState((state) => [
    state.isDarkMode,
    state.isLoggedIn,
  ]);
  const { profile_image, username, id } = useDetailsState((state) => state);

  const [count, setCount] = React.useState(0);

  const { isLoading } = useQuery(['getUnreadNotifications'], () => httpService.get(`${URLS.GET_NOTIFICATION_COUNT}`), {
    onSuccess: (data) => {
      if (data.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
        setCount(data.data.data.notifications_count);
      }
    }
  })

  return (
    <Box
      paddingHorizontal="m"
      paddingTop="l"
      backgroundColor="mainBackGroundColor"
      height={110}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      borderBottomWidth={0.3}
      borderBottomColor="borderColor"
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {showMenuButton && (
          <Feather
            name="menu"
            size={25}
            color={theme.colors.textColor}
            onPress={() => navigation.openDrawer()}
          />
        )}
        {!showMenuButton && (
          <Feather
            name="arrow-left"
            size={25}
            color={theme.colors.textColor}
            onPress={() => navigation.goBack()}
          />
        )}
        <Image
          source={
            isDarkMode
              ? require("../../assets/images/logo.png")
              : require("../../assets/images/logoB.png")
          }
          style={{
            width: 70,
            height: 70,
            resizeMode: "contain",
            marginLeft: 10,
          }}
          contentFit="contain"
          transition={1000}
        />
      </View>

      {!isLoggedIn && (
          <Box flexDirection={'row'}>
            <Ionicons
                name="search-outline"
                onPress={() => navigation.navigate("search")}
                size={25}
                color={theme.colors.textColor}
                style={{ marginRight: 0, marginTop: 3 }}
            />
            <Pressable
                onPress={() => navigation.navigate("sign-in")}
                // onPress={() =>
                //   navigation.navigate("onboarding", { showModal: undefined })
                // }
                style={{
                  width: 60,
                  height: 32,
                  borderRadius: 45,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 5,
                }}
            >
              <CustomText
                  variant="body"
                  fontSize={16}
              >
                Login
              </CustomText>
            </Pressable>

            <Pressable
                onPress={() => navigation.navigate("register")}
                // onPress={() =>
                //   navigation.navigate("onboarding", { showModal: undefined })
                // }
                style={{
                  width: 80,
                  height: 30,
                  borderRadius: 45,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: isDarkMode ? theme.colors.secondaryBackGroundColor : theme.colors.fadedButtonBgColor,
                  borderWidth: isDarkMode ? 0:1,
                  borderColor: theme.colors.primaryColor
                }}
            >
              <CustomText
                  variant="body"
                  fontSize={16}
                  color="primaryColor"
              >
                Sign up
              </CustomText>
            </Pressable>
          </Box>
      )}
      {isLoggedIn && (
        <Box flexDirection="row" alignItems="center">
          <Ionicons
            name="search-outline"
            onPress={() => navigation.navigate("search")}
            size={25}
            color={theme.colors.textColor}
          />
          <Box
            position="relative"
          >
            <Ionicons
              name="notifications-outline"
              onPress={() => navigation.navigate("notifications")}
              size={25}
              color={theme.colors.textColor}
              style={{ marginHorizontal: 10 }}
            />
           {!isLoading && count > 0 &&(
             <Box
              position='absolute'
              width={20}
              height={20}
              borderRadius={15}
              justifyContent="center"
              alignItems="center"
              top={-5}
              right={1}
              style={{ backgroundColor: 'red'}}
             >
              <CustomText fontSize={14} style={{ color: 'white'}} variant="body">{count > 10 ? '9+': count}</CustomText>
             </Box>
           )}
          </Box>
          <Box
            width={30}
            height={30}
            borderRadius={25}
            backgroundColor="secondaryBackGroundColor"
            justifyContent="center"
            alignItems="center"
          >
            <Feather
              name="edit-2"
              size={20}
              color={theme.colors.textColor}
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
