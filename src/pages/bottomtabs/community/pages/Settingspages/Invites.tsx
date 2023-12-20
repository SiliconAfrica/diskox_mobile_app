import { TextInput, Pressable, ActivityIndicator } from "react-native";
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
import { useCommunityDetailsState } from "../../states/Settings.state";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import httpService, { IMAGE_BASE } from "../../../../../utils/httpService";
import { URLS } from "../../../../../services/urls";
import useToast from "../../../../../hooks/useToast";
import { CUSTOM_STATUS_CODE } from "../../../../../enums/CustomCodes";
import { IUser } from "../../../../../models/user";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";

const PostCard = ({
  id,
  username,
  profile_image,
  communityId,
  active,
}: Partial<IUser & { communityId: number; active: number }>) => {
  const theme = useTheme<Theme>();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationKey: ["revoke_community_invitation", id],
    mutationFn: (data: any) =>
      httpService.post(
        `${URLS.CANCEL_COMMUNITY_INVITATIONS}/${communityId}/${id}`,
        data
      ),
    onSuccess: (res) => {
      if (res.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
        toast.show(res.data.message || "Invitation revoked successfully", {
          type: "success",
        });
        queryClient.invalidateQueries([
          `getPendingInvitationRequests-${communityId}`,
          communityId,
        ]);
        return;
      }
      toast.show(res.data.message || "An error occurred", { type: "danger" });
    },
    onError: (e: any) => {
      toast.show(e?.message || "An error occurred", { type: "danger" });
    },
  });
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
      <Box flexDirection="row">
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
          <Box flexDirection="row">
            <CustomText variant="subheader" fontSize={18}>
              @{username}
            </CustomText>
          </Box>
        </Box>
      </Box>

      {active === 1 && (
        <CustomButton
          title="Revoke"
          onPress={() => mutate({})}
          height={30}
          color={"red"}
          width={100}
          isLoading={isLoading}
        />
      )}
    </Box>
  );
};

const Invites = () => {
  const theme = useTheme<Theme>();
  const toast = useToast();
  const navigation = useNavigation<PageType>();
  const { id, username } = useCommunityDetailsState((state) => state);

  // state
  const [active, setActive] = React.useState(1);
  const [fetchMore, setFetchMore] = React.useState(false);
  const [fetchMorePending, setFetchMorePending] = useState(false);

  const {
    isError,
    isLoading,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    keepPreviousData: false,
    queryKey: [`getAcceptedInvitationRequests-${id}`, id],
    queryFn: ({ pageParam = 1 }) =>
      httpService.get(
        `${URLS.FETCH_ACCEPTED_COMMUNITY_INVITATIONS}/${id}?page=${pageParam}`
      ),
    getNextPageParam: (_lastpage, allPages) => {
      const currentPage = allPages[allPages.length - 1];
      if (currentPage.data.data.next_page_url) {
        return allPages.length + 1;
      } else {
        return undefined;
      }
    },
    onSuccess: () => {
      setFetchMore(false);
    },
    onError: (e: any) => {
      if (e.code !== CUSTOM_STATUS_CODE.NO_DATA) {
        toast.show(e.message, { type: "danger" });
      }
    },
  });
  const {
    isError: isErrorPending,
    isLoading: isLoadingPending,
    data: pending,
    hasNextPage: hasPendingNextPage,
    fetchNextPage: fetchPendingNextPage,
    isFetchingNextPage: isFetchingPendingNextPage,
    isFetching: isFetchingPending,
  } = useInfiniteQuery({
    keepPreviousData: false,
    queryKey: [`getPendingInvitationRequests-${id}`, id],
    queryFn: ({ pageParam = 1 }) =>
      httpService.get(
        `${URLS.FETCH_PENDING_COMMUNITY_INVITATIONS}/${id}?page=${pageParam}`
      ),
    getNextPageParam: (_lastpage, allPages) => {
      const currentPage = allPages[allPages.length - 1];
      if (currentPage.data.data.next_page_url) {
        return allPages.length + 1;
      } else {
        return undefined;
      }
    },
    onSuccess: () => {
      setFetchMorePending(false);
    },
    onError: (e: any) => {
      if (e.code !== CUSTOM_STATUS_CODE.NO_DATA) {
        toast.show(e.message, { type: "danger" });
      }
    },
  });

  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <SettingsHeader
        title="Invites"
        showSave
        handleArrowPressed={() => navigation.goBack()}
        RightItem={
          <CustomText
            variant="body"
            color="primaryColor"
            onPress={() =>
              navigation.push("community-settings", {
                id: id,
                username: username,
                type: COMMUNITY_SETTING_TYPE.INVITE_MEMBERS_FROM_FOLLOWERS,
              })
            }
          >
            Invite member
          </CustomText>
        }
      />
      <Box flex={1}>
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

        <Box
          flexDirection="row"
          width="100%"
          justifyContent="center"
          marginVertical="m"
        >
          <Pressable
            onPress={() => setActive(1)}
            style={{
              height: 35,
              width: 130,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                active === 1
                  ? theme.colors.secondaryBackGroundColor
                  : "transparent",
            }}
          >
            <CustomText
              variant="subheader"
              fontSize={16}
              color={active === 1 ? "primaryColor" : "textColor"}
            >
              Pending invites
            </CustomText>
          </Pressable>

          <Pressable
            onPress={() => setActive(2)}
            style={{
              height: 35,
              width: 130,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                active === 2
                  ? theme.colors.secondaryBackGroundColor
                  : "transparent",
              marginLeft: 10,
            }}
          >
            <CustomText
              variant="subheader"
              fontSize={16}
              color={active === 2 ? "primaryColor" : "textColor"}
            >
              Accepted invites
            </CustomText>
          </Pressable>
        </Box>

        <Box flex={1}>
          {/* <ScrollView>
            {testArray.map((item, index) => (
              <PostCard key={index.toString()} />
            ))}
          </ScrollView> */}
          {active === 1 ? (
            <FlashList
              ListEmptyComponent={() => (
                <>
                  {!isLoadingPending && (
                    <Box
                      width="100%"
                      height={350}
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
                        There are no pending invites
                      </CustomText>
                    </Box>
                  )}
                </>
              )}
              ListFooterComponent={() => (
                <>
                  {(isLoadingPending ||
                    isFetchingPending ||
                    isFetchingPendingNextPage) && (
                    <ActivityIndicator
                      size="large"
                      style={{ marginTop: 20 }}
                      color={theme.colors.primaryColor}
                    />
                  )}
                </>
              )}
              data={
                Array.isArray(pending?.pages) && pending.pages[0].data.data
                  ? pending?.pages
                  : []
              }
              onScrollBeginDrag={() => {
                if (hasPendingNextPage) {
                  setFetchMorePending(true);
                }
              }}
              onEndReachedThreshold={0.5}
              onEndReached={async () => {
                if (
                  fetchMorePending &&
                  hasPendingNextPage &&
                  (!isFetchingPending || !isFetchingPendingNextPage)
                ) {
                  await fetchPendingNextPage();
                }
              }}
              estimatedItemSize={10}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) =>
                item.data.data.data.map((member: IUser) => (
                  <PostCard
                    key={member.id.toString()}
                    id={member.id}
                    profile_image={member.profile_image}
                    username={member.username}
                    communityId={id}
                    active={active}
                  />
                ))
              }
            />
          ) : (
            <FlashList
              ListEmptyComponent={() => (
                <>
                  {!isLoading && (
                    <Box
                      width="100%"
                      height={350}
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
                        There are no accepted invites
                      </CustomText>
                    </Box>
                  )}
                </>
              )}
              ListFooterComponent={() => (
                <>
                  {(isLoading || isFetching || isFetchingNextPage) && (
                    <ActivityIndicator
                      size="large"
                      style={{ marginTop: 20 }}
                      color={theme.colors.primaryColor}
                    />
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
                item.data.data.data.map((member: IUser) => (
                  <PostCard
                    key={member.id.toString()}
                    id={member.id}
                    profile_image={member.profile_image}
                    username={member.username}
                    communityId={id}
                    active={active}
                  />
                ))
              }
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Invites;
