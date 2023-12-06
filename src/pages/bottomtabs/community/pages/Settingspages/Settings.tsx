import { View, Text, Pressable } from "react-native";
import React from "react";
import Box from "../../../../../components/general/Box";
import CustomText from "../../../../../components/general/CustomText";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../../../../theme";
import { COMMUNITY_SETTING_TYPE } from "../../../../../enums/CommunitySettings";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { PageType } from "../../../../login";
import SettingsHeader from "../../../../../components/settings/Header";
import { ScrollView } from "react-native-gesture-handler";
import { RootStackParamList } from "../../../../../navigation/MainNavigation";
import { useQuery } from "react-query";
import httpService from "../../../../../utils/httpService";
import { ICommunity } from "../../../../../models/Community";
import { useCommunityDetailsState } from "../../states/Settings.state";
import { URLS } from "../../../../../services/urls";

const SectionHeader = ({
  icon,
  title,
  color = undefined,
}: {
  icon: JSX.Element;
  title: string;
  color?: string;
}) => {
  const theme = useTheme<Theme>();
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      paddingHorizontal="m"
      marginTop="m"
    >
      {icon}
      <CustomText
        variant="body"
        marginLeft="m"
        style={{ color: color !== undefined ? color : theme.colors.textColor }}
      >
        {title || ""}
      </CustomText>
    </Box>
  );
};

const ListItem = ({
  type,
  title,
}: {
  title: string;
  type: COMMUNITY_SETTING_TYPE;
}) => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<PageType>();
  const route = useRoute<RouteProp<RootStackParamList, "community-settings">>();

  const { id, username } = route.params;

  const handlePress = React.useCallback(() => {
    navigation.push("community-settings", { id, username, type });
  }, [type]);

  return (
    <Pressable
      style={{
        flexDirection: "row",
        width: "100%",
        height: 40,
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 0,
        marginTop: 25,
      }}
      onPress={handlePress}
    >
      <CustomText variant="body" marginLeft="m">
        {title || ""}
      </CustomText>
      <Feather name="chevron-right" size={30} color={theme.colors.textColor} />
    </Pressable>
  );
};

const Settings = () => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<PageType>();
  const { setAll } = useCommunityDetailsState((state) => state);

  // const { isError, isLoading, refetch } = useQuery(
  //     ["getCommunityDetails", username],
  //     () => httpService.get(`${URLS.GET_SINGLE_COMMUNITY}/${username}`),
  //     {
  //       onSuccess: (data) => {
  //         const item: ICommunity = data?.data?.data;
  //         setAll({
  //           id: item?.id,
  //           username: item?.username,
  //           title: item?.name,
  //           description: item?.description,
  //           topics: item?.topics,
  //           type: item?.type,
  //           banner_image: item?.banner_image,
  //           profile_image: item?.profile_image,
  //           restricted: item?.restricted,
  //           status: item?.status,
  //           user_id: item?.user_id,
  //         });
  //       },
  //     }
  //   );
  return (
    <Box flex={1}>
      <SettingsHeader
        title="Community Settings"
        showSave={false}
        handleArrowPressed={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* SETTINGS SECTION */}
        <SectionHeader
          title={"Community settings"}
          icon={
            <Ionicons name="person" size={25} color={theme.colors.textColor} />
          }
        />
        <ListItem title="Profile" type={COMMUNITY_SETTING_TYPE.EDIT} />
        <ListItem title="Community type" type={COMMUNITY_SETTING_TYPE.TYPE} />
        <ListItem
          title="Member request"
          type={COMMUNITY_SETTING_TYPE.REQUEST}
        />
        <ListItem title="All members" type={COMMUNITY_SETTING_TYPE.MEMBERS} />

        {/* MANAGEMENT SECTION */}
        <SectionHeader
          title={"Management"}
          icon={
            <Ionicons
              name="settings-outline"
              size={25}
              color={theme.colors.textColor}
            />
          }
        />
        <ListItem title="Post approval" type={COMMUNITY_SETTING_TYPE.POSTS} />
        <ListItem title="Moderators" type={COMMUNITY_SETTING_TYPE.MODERATORS} />
        <ListItem
          title="Suspended"
          type={COMMUNITY_SETTING_TYPE.SUSPENDED_MEMBERS}
        />
        <ListItem
          title="Blocked"
          type={COMMUNITY_SETTING_TYPE.BLOCKED_MEMBERS}
        />
        <ListItem title="Invite" type={COMMUNITY_SETTING_TYPE.INVITE_MEMBERS} />

        {/* RULES SECTION */}
        <SectionHeader
          title={"Rules & Regulations"}
          icon={
            <Ionicons
              name="file-tray-stacked"
              size={25}
              color={theme.colors.textColor}
            />
          }
        />
        <ListItem title="Rules" type={COMMUNITY_SETTING_TYPE.RULES} />
        <ListItem
          title="Removal reason"
          type={COMMUNITY_SETTING_TYPE.REMOVAL_RREASON}
        />
        <ListItem
          title="Content controls"
          type={COMMUNITY_SETTING_TYPE.CONTENT_CONTROL}
        />

        <SectionHeader
          title={"DELETE COMMUNITY"}
          icon={<Ionicons name="trash-outline" size={25} color={"red"} />}
          color="red"
        />
      </ScrollView>
    </Box>
  );
};

export default Settings;
