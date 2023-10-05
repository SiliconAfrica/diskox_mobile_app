import { View, Text, Pressable, Switch } from "react-native";
import React from "react";
import * as SecureStorage from "expo-secure-store";
import Box from "../../components/general/Box";
import SettingsHeader from "../../components/settings/Header";
import { Image } from "expo-image";
import { useDetailsState } from "../../states/userState";
import { IMAGE_BASE } from "../../utils/httpService";
import CustomText from "../../components/general/CustomText";
import { Ionicons, Feather, FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { useUtilState } from "../../states/util";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/MainNavigation";
import { useMultipleAccounts } from "../../states/multipleAccountStates";
import { handlePromise } from "../../utils/handlePomise";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "react-native-toast-notifications";

const NavItem = ({
  icon,
  action,
  title,
  forDarkModa = false,
}: {
  icon: JSX.Element;
  action: () => void;
  title: string;
  forDarkModa: boolean;
}) => {
  const theme = useTheme<Theme>();
  const { isDarkMode, setAll } = useUtilState((state) => state);
  return (
    <Pressable
      onPress={() => action()}
      style={{
        width: "100%",
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
      }}
    >
      <Box flexDirection="row">
        {!forDarkModa && icon}
        {forDarkModa && (
          <>
            {isDarkMode && (
              <Ionicons name="moon" size={25} color={theme.colors.textColor} />
            )}
            {!isDarkMode && (
              <Ionicons name="sunny" size={25} color={theme.colors.textColor} />
            )}
          </>
        )}
        <CustomText variant="body" marginLeft="l">
          {title}
        </CustomText>
      </Box>

      {!forDarkModa && (
        <Feather
          name="chevron-right"
          size={25}
          color={theme.colors.textColor}
        />
      )}
      {forDarkModa && (
        <Switch
          value={isDarkMode}
          onChange={() => setAll({ isDarkMode: !isDarkMode })}
          trackColor={{ false: "grey", true: theme.colors.primaryColor }}
          thumbColor="white"
        />
      )}
    </Pressable>
  );
};

const Setting = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "settings">) => {
  const theme = useTheme<Theme>();
  const {
    profile_image,
    name,
    username,
    setAll: updateDetails,
  } = useDetailsState((state) => state);
  const { setAll, isLoggedIn } = useUtilState((state) => state);
  const { switchAccount, accounts, removeAccount, addAccountFn } =
    useMultipleAccounts((state) => state);
  const toast = useToast();
  const nav = (route: string) => {
    navigation.navigate(route as any);
  };

  const logout = async () => {
    const [loggedInUser, loggedInUserErr] = await handlePromise(
      AsyncStorage.getItem(`user`)
    );
    if (loggedInUser) {
      const theUser = JSON.parse(loggedInUser);
      const remainingAccounts = accounts.filter((account) => {
        return account.username !== theUser.username;
      });
      removeAccount(theUser.username);
      if (remainingAccounts.length > 0) {
        const accountToSwitchTo = remainingAccounts[0];
        const removeOldtoken = await SecureStorage.setItemAsync(
          `---${theUser.username}---token`,
          ""
        );
        const token = await SecureStorage.getItemAsync(
          `---${accountToSwitchTo.username}---token`
        );
        await SecureStorage.setItemAsync("token", token);
        const [saveUser, saveUserErr] = await handlePromise(
          AsyncStorage.setItem(`user`, JSON.stringify(accountToSwitchTo))
        );
        switchAccount(accountToSwitchTo.username, token, updateDetails);
        toast.show(`Account switched to "@${accountToSwitchTo.username}"`, {
          type: "success",
        });
      } else {
        await SecureStorage.setItemAsync("token", "");
        const [saveUser, saveUserErr] = await handlePromise(
          AsyncStorage.setItem(`user`, "")
        );
        setAll({ isLoggedIn: false });
        toast.show(`Logged out successfully`, {
          type: "success",
        });
        navigation.navigate("home");
      }
    }
  };

  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <SettingsHeader
        title="Settings"
        showSave={false}
        handleArrowPressed={() => navigation.goBack()}
      />

      {/* PROFILE SECTION */}
      <Box
        flexDirection="row"
        paddingHorizontal="m"
        marginTop="m"
        alignItems="center"
      >
        <Box
          width={50}
          height={50}
          borderRadius={25}
          overflow="hidden"
          marginRight="s"
        >
          <Image
            source={{ uri: `${IMAGE_BASE}${profile_image}` }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        </Box>

        <CustomText variant="body">{name}</CustomText>
        <CustomText variant="xs">@{username}</CustomText>
      </Box>

      <Box flex={0.6} paddingTop="l">
        <NavItem
          forDarkModa={false}
          icon={
            <Ionicons name="person" size={25} color={theme.colors.textColor} />
          }
          action={() => nav("profile-setting")}
          title="Profile"
        />

        <NavItem
          forDarkModa={false}
          icon={
            <Ionicons
              name="lock-closed"
              size={25}
              color={theme.colors.textColor}
            />
          }
          title="Security"
          action={() => nav("security")}
        />
        <NavItem
          forDarkModa={false}
          icon={
            <FontAwesome
              name="money"
              size={25}
              color={theme.colors.textColor}
            />
          }
          title="Refer & Earn"
          action={() => nav("referrals")}
        />

        <NavItem
          forDarkModa={false}
          icon={
            <Ionicons name="shield" size={25} color={theme.colors.textColor} />
          }
          title="Blocked"
          action={() => nav("blocked-users")}
        />

        <NavItem
          forDarkModa={false}
          icon={
            <Ionicons
              name="notifications"
              size={25}
              color={theme.colors.textColor}
            />
          }
          title="Notificaitions"
          action={() => nav("notifications-settings")}
        />

        <NavItem
          forDarkModa
          icon={
            <Ionicons
              name="notifications"
              size={25}
              color={theme.colors.textColor}
            />
          }
          title="Dark Mode"
          action={() => {}}
        />
      </Box>

      {/* LOGOUT SECTION */}
      <Box
        flex={0.4}
        justifyContent="center"
        alignItems="center"
        paddingHorizontal="m"
      >
        {isLoggedIn && (
          <Pressable
            style={{
              width: "100%",
              height: 50,
              borderRadius: 25,
              borderColor: theme.colors.secondaryBackGroundColor,
              borderWidth: 2,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={logout}
          >
            <Ionicons name="log-out" size={25} color="red" />
            <CustomText variant="body" style={{ color: "red" }} marginLeft="m">
              Logout
            </CustomText>
          </Pressable>
        )}
      </Box>
    </Box>
  );
};

export default Setting;
