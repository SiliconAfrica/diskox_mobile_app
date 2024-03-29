import { View, Text, TextInput, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import Box from "../../../../../components/general/Box";
import CustomText from "../../../../../components/general/CustomText";
import { Theme } from "../../../../../theme";
import { useTheme } from "@shopify/restyle";
import { Feather, Ionicons } from "@expo/vector-icons";
import FadedButton from "../../../../../components/general/FadedButton";
import CustomButton from "../../../../../components/general/CustomButton";
import { ScrollView } from "react-native-gesture-handler";
import SettingsHeader from "../../../../../components/settings/Header";
import { useNavigation } from "@react-navigation/native";
import { PageType } from "../../../../login";
import { COMMUNITY_SETTING_TYPE } from "../../../../../enums/CommunitySettings";
import { Image } from "expo-image";
import httpService, { IMAGE_BASE } from "../../../../../utils/httpService";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { URLS } from "../../../../../services/urls";
import useToast from "../../../../../hooks/useToast";
import { useCommunityDetailsState } from "../../states/Settings.state";
import { IUser } from "../../../../../models/user";
import { useModalState } from "../../../../../states/modalState";
import { CUSTOM_STATUS_CODE } from "../../../../../enums/CustomCodes";

const PostCard = ({ id, username, profile_image, permissions }) => {
  const theme = useTheme<Theme>();
  const queryClient = useQueryClient();
  const toast = useToast();
  const {
    setAll: setCommunity,
    single_moderator_permissions,
    id: communityId,
  } = useCommunityDetailsState((state) => state);
  const { setAll } = useModalState((state) => state);

  const { mutate: revoke_permissions, isLoading } = useMutation({
    mutationKey: `revoke-community-permissions=${id}`,
    mutationFn: (data: any) =>
      httpService.post(`${URLS.REVOKE_COMMUNITY_ROLE}/${communityId}/${id}`),
    onSuccess: (res) => {
      if (res.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
        setCommunity({
          single_moderator_permissions: {
            rules: false,
            content: false,
            users: false,
          },
          communityUserToTakeActionOn: { username, id, profile_image },
        });
        toast.show(res.data.message || "Successfully revoked permissions", {
          type: "success",
        });
        queryClient.invalidateQueries(["getModerators", communityId]);
        return;
      }
      toast.show(res.data.message || "An error occured", { type: "danger" });
    },
    onError: (e: any) => {
      toast.show(e.message || "An error occured", { type: "danger" });
    },
  });
  useEffect(() => {
    const allPermissionsGiven = permissions.map(
      (permission) => permission.permission
    );
    setCommunity({
      single_moderator_permissions: {
        rules: allPermissionsGiven.includes("rules"),
        users: allPermissionsGiven.includes("users"),
        content: allPermissionsGiven.includes("contents"),
      },
    });
  }, [permissions]);
  return (
    <Box
      width="100%"
      paddingVertical="m"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      backgroundColor="mainBackGroundColor"
      borderBottomWidth={1}
      borderBottomColor="secondaryBackGroundColor"
      marginBottom="s"
      paddingHorizontal="m"
    >
      <Box flexDirection="row" paddingVertical="s">
        {profile_image ? (
          <Image
            source={{ uri: `${IMAGE_BASE}${profile_image}` }}
            style={{ width: 30, height: 30, borderRadius: 17 }}
            contentFit="cover"
          />
        ) : (
          <Box
            width={30}
            height={30}
            borderRadius={15}
            backgroundColor="fadedButtonBgColor"
            justifyContent="center"
            alignItems="center"
          >
            <CustomText variant="subheader" color="primaryColor" fontSize={18}>
              {username[0]?.toUpperCase() ?? ""}
            </CustomText>
          </Box>
        )}
        <Box marginLeft="m">
          <Box flexDirection="row" alignItems="center">
            <CustomText variant="subheader" fontSize={18}>
              @{username}
            </CustomText>
            <Feather
              name="edit"
              size={20}
              style={{ marginLeft: 10 }}
              color={theme.colors.textColor}
              onPress={() => {
                setCommunity({
                  communityUserToTakeActionOn: { id, username, profile_image },
                });
                setAll({ showInviteModerator: true });
              }}
            />
          </Box>
        </Box>
      </Box>

      <CustomButton
        title="Revoke"
        onPress={() => revoke_permissions({})}
        height={30}
        isLoading={isLoading}
        color={"red"}
        width={100}
      />
    </Box>
  );
};

const Moderators = () => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<PageType>();
  const toast = useToast();
  const [fetchMore, setFetchMore] = useState(false);

  const { id, username: communityUsername } = useCommunityDetailsState(
    (state) => state
  );

  const {
    isError,
    isLoading,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["getModerators", id],
    queryFn: ({ pageParam = 1 }) =>
      httpService.get(
        `${URLS.GET_COMMUNITY_MODERATORS}/${id}?page=${pageParam}`
      ),
    getNextPageParam: (_lastpage, allPages) => {
      const currentPage = allPages[allPages.length - 1];
      if (currentPage?.data?.data?.next_page_url) {
        return allPages.length + 1;
      } else {
        return undefined;
      }
    },
    onSuccess: () => {
      setFetchMore(false);
    },
    onError: (e: any) => {
      toast.show(e.message, { type: "danger" });
    },
  });

  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <SettingsHeader
        title="Moderators"
        showSave
        handleArrowPressed={() => navigation.goBack()}
        RightItem={
          <CustomText
            variant="body"
            color="primaryColor"
            onPress={() =>
              navigation.push("community-settings", {
                id: id,
                type: COMMUNITY_SETTING_TYPE.INVITE,
                username: communityUsername,
              })
            }
          >
            Invite moderators
          </CustomText>
        }
      />
      <Box flex={1}>
        <CustomText
          marginTop="m"
          marginLeft="m"
          variant="subheader"
          fontSize={14}
        >
          {data?.pages?.map((page, i) => page?.data?.data?.total || 0)}{" "}
          Moderators
        </CustomText>

        {/* SEARCH BOX */}

        <Box marginHorizontal="m">
          <Box width="100%" marginTop="m">
            <Box
              width={"100%"}
              height={45}
              borderRadius={25}
              backgroundColor="secondaryBackGroundColor"
              flexDirection="row"
              alignItems="center"
              paddingHorizontal="m"
            >
              <Feather name="search" size={25} color={theme.colors.textColor} />
              <TextInput
                style={{
                  flex: 1,
                  color: theme.colors.textColor,
                  fontFamily: "RedRegular",
                  paddingLeft: 10,
                }}
                placeholder="Search for a moderator"
                placeholderTextColor={theme.colors.textColor}
              />
            </Box>
          </Box>
        </Box>

        <Box flex={1}>
          <FlashList
            ListEmptyComponent={() => (
              <>
                {!isLoading && !isFetching && (
                  <Box
                    width="100%"
                    height={350}
                    paddingHorizontal="s"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Ionicons
                      name="cube"
                      size={100}
                      color={theme.colors.primaryColor}
                    />
                    <CustomText
                      variant="subheader"
                      fontSize={18}
                      textAlign="center"
                      marginTop="m"
                    >
                      No moderators have been assigned permissions yet in your
                      community
                    </CustomText>
                  </Box>
                )}
              </>
            )}
            ListFooterComponent={() => (
              <>
                {(isLoading || isFetching || isFetchingNextPage) && (
                  <Box paddingTop="m">
                    <ActivityIndicator
                      size="large"
                      color={theme.colors.primaryColor}
                    />
                  </Box>
                )}
              </>
            )}
            data={
              Array.isArray(data?.pages) && data.pages[0].data.data
                ? data?.pages
                : []
            }
            onScrollBeginDrag={() => {
              if (hasNextPage) {
                setFetchMore(true);
              }
            }}
            onEndReachedThreshold={0.5}
            onEndReached={async () => {
              if (
                fetchMore &&
                hasNextPage &&
                (!isFetching || !isFetchingNextPage)
              ) {
                await fetchNextPage();
              }
            }}
            estimatedItemSize={10}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) =>
              item?.data?.data?.map((member: IUser & { permissions: any }) => (
                <PostCard
                  key={member.id.toString()}
                  id={member.id}
                  permissions={member.permissions}
                  profile_image={member.profile_image}
                  username={member.username}
                />
              ))
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Moderators;
