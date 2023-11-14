import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React from "react";
import Box from "./general/Box";
import { useTheme } from "@shopify/restyle";
import theme, { Theme } from "../theme";
import { useUtilState } from "../states/util";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Foundation,
  FontAwesome,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import CustomText from "./general/CustomText";
import { ScrollView, Switch } from "react-native-gesture-handler";
import * as SecureStorage from "expo-secure-store";
import { useMultipleAccounts } from "../states/multipleAccountStates";
import { IUserState, useDetailsState } from "../states/userState";
import httpService, { BASE_URL, IMAGE_BASE } from "../utils/httpService";
import { useToast } from "react-native-toast-notifications";
import { handlePromise } from "../utils/handlePomise";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useModalState } from "../states/modalState";
import { useQuery, useQueryClient } from "react-query";
import { IHashTag } from "../models/Hashtag";
import { useQuery } from "react-query";
import { URLS } from "../services/urls";
import { CUSTOM_STATUS_CODE } from "../enums/CustomCodes";

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

interface Iitems {
  image: JSX.Element;
  action?: () => void;
}
const ScrollableItem = ({ accounts }: { accounts: IUserState[] }) => {
  const { switchAccount } = useMultipleAccounts((state) => state);
  const { setAll: updateDetails, username } = useDetailsState((state) => state);
  const toast = useToast();
  const queryClient = useQueryClient();

  return (
    <Box
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
      }}
    >
      <ScrollView horizontal>
        {accounts &&
          accounts.length > 0 &&
          accounts.map((user, i) => (
            <Box
              key={i}
              style={{
                width: 50,
                height: 60,
                justifyContent: "flex-start",
                overflow: "hidden",
              }}
            >
              <Pressable
                onPress={
                  user?.username === username
                    ? null
                    : async () => {
                        const switchToken = await SecureStorage.getItemAsync(
                          `---${user.username}---token`
                        );
                        if (switchToken) {
                          //save the token and data we are to be using in normal token
                          await SecureStorage.setItemAsync(
                            "token",
                            switchToken
                          );

                          await AsyncStorage.setItem(
                            "user",
                            JSON.stringify(user)
                          );

                          const [savedUser, savedUserErr] = await handlePromise(
                            AsyncStorage.getItem("user")
                          );
                          if (
                            JSON.parse(savedUser).username === user.username
                          ) {
                            switchAccount(
                              user.username,
                              switchToken,
                              updateDetails,
                              queryClient
                            );
                            toast.show(`Logged in as "@${user.username}"`, {
                              type: "success",
                            });
                          }
                        } else {
                          alert(
                            `Please add account with username of ${user.username} again.`
                          );
                        }
                      }
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 40,
                  width: 40,
                  borderRadius: 30,
                  overflow: "hidden",
                  borderColor:
                    user?.username === username
                      ? theme.colors.primaryColor
                      : theme.colors.black,
                  borderWidth: user?.username === username ? 3 : 1,
                  marginRight: 5,
                }}
              >
                <Image
                  source={
                    user?.profile_image
                      ? {
                          uri: `${IMAGE_BASE}${user?.profile_image}`,
                        }
                      : require("../../assets/images/diskoxLarge.png")
                  }
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  contentFit="cover"
                  transition={100}
                />
              </Pressable>
              <CustomText
                style={{ fontSize: 10, width: "100%", textAlign: "center" }}
              >
                @{user?.username.substring(0, 7)}
                {user?.username.length > 5 && "..."}
              </CustomText>
            </Box>
          ))}
      </ScrollView>
    </Box>
  );
};

const Sidebar = ({ navigation }: DrawerContentComponentProps) => {
  const theme = useTheme<Theme>();
  const [hashtags, setHashtag] = React.useState<IHashTag[]>([]);
  const [isLoggedIn, isDarkMode, setAll] = useUtilState((state) => [
    state.isLoggedIn,
    state.isDarkMode,
    state.setAll,
  ]);
  const { accounts } = useMultipleAccounts((state) => state);
  const { setAll: setModal } = useModalState((state) => state);

  const { isLoading, isError } = useQuery(['get_trending_hashtags'], () => httpService.get(`${URLS.GET_POPULAR_HASTAGS}`), {
    onSuccess: (data) => {
      if (data.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
          setHashtag(data.data.data);
      }
    }
  });

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

  const getFollowCount = useQuery(
    ["getFollowerCount", userId],
    () =>
      httpService.get(
        `${URLS.GET_USER_FOLLOWING_AND_FOLLOWERS_COUNT}/${userId}`
      ),
    {
      onError: () => {},
      onSuccess: (data) => {},
    }
  );
  const { isLoading: isLoadingRequirements } = useQuery(
    ["verification_monetization_requirements"],
    () =>
      httpService.get(`${URLS.GET_VERIFICATION_AND_MONETIZATION_REQUIREMENT}`),
    {
      onError: () => {},
      onSuccess: async (data) => {
        if (
          Number(getFollowCount.data?.data.followers_count) >=
          Number(data?.data?.data?.monitization_followers)
        ) {
          setShowMonetization(true);
        }
      },
    }
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
          {isLoggedIn && (
            <>
              <ScrollableItem accounts={accounts} />
              <Item
                icon={
                  <MaterialIcons
                    name="person-add-alt"
                    size={25}
                    color={theme.colors.textColor}
                  />
                }
                title="Add an account"
                action={() => navigation.navigate("sign-in")}
                // action={() =>
                //   navigation.navigate("onboarding", {
                //     showModal: 1,
                //     addAccount: true,
                //   })
                // }
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
                action={() => navigation.navigate("bookmark")}
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
              <Item
                icon={
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={25}
                    color={theme.colors.textColor}
                  />
                }
                title="Verify account"
                action={() => navigation.navigate("verification")}
              />
              {showMonetization && (
                <Item
                  icon={
                    <Box
                      borderWidth={1}
                      paddingHorizontal="s"
                      paddingVertical="s"
                      borderRadius={5}
                      style={{ borderColor: theme.colors.textColor }}
                    >
                      <FontAwesome
                        name="dollar"
                        size={10}
                        color={theme.colors.textColor}
                      />
                    </Box>
                  }
                  title="Monetization"
                  action={() => setModal({ showMonetization: true })}
                />
              )}
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
              <FontAwesome
                name="user-circle-o"
                size={24}
                color={theme.colors.textColor}
              />
            }
            action={() => navigation.navigate("referrals")}
            title="Refer & Earn"
          />
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
        <Box paddingHorizontal="m" paddingTop="l" paddingBottom='xl'>
          <CustomText variant="subheader" fontSize={18}>
            Explore Popular Tags
          </CustomText>
          { isLoading && (
            <ActivityIndicator size='large' color={theme.colors.primaryColor} />
          )}
          {
            !isLoading && isError && (
              <CustomText variant="body">
                An Error occured while getting hashtags
              </CustomText>
            )
          }
          { !isLoading && hashtags.length > 0 && hashtags.map((item, index) => (
            <CustomText key={index.toString()} variant="body" marginTop="m" onPress={() => navigation.navigate('hashtag', { hashTag: item.name })}>
              #{item.name}
            </CustomText>
            ))}
        

         { !isLoading && !isError && (
           <Pressable
           style={{
             flexDirection: "row",
             alignItems: "center",
             marginTop: 15,
             height: 20,
           }}
           onPress={() => navigation.navigate('trending-hashtags')}
         >
           <CustomText variant="body">View More</CustomText>
           <Feather
             name="chevron-right"
             size={25}
             color={theme.colors.textColor}
           />
         </Pressable>
         )}
        </Box>
      </ScrollView>
    </Box>
  );
};

export default Sidebar;
