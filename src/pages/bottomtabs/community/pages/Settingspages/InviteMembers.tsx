import { TextInput, ActivityIndicator, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Box from "../../../../../components/general/Box";
import CustomText from "../../../../../components/general/CustomText";
import { Theme } from "../../../../../theme";
import { useTheme } from "@shopify/restyle";
import { Feather, Ionicons } from "@expo/vector-icons";
import SettingsHeader from "../../../../../components/settings/Header";
import { useNavigation } from "@react-navigation/native";
import { PageType } from "../../../../login";
import { FlatList } from 'react-native-gesture-handler'
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import httpService, { IMAGE_BASE } from "../../../../../utils/httpService";
import { useCommunityDetailsState } from "../../states/Settings.state";
import { URLS } from "../../../../../services/urls";
import useToast from "../../../../../hooks/useToast";
import { IUser } from "../../../../../models/user";
import { Image } from "expo-image";
import { useModalState } from "../../../../../states/modalState";
import { useDetailsState } from "../../../../../states/userState";
import CustomButton from "../../../../../components/general/CustomButton";
import { CUSTOM_STATUS_CODE } from "../../../../../enums/CustomCodes";
import { Alert } from "react-native";

const PostCard = ({
  id,
  username,
  profile_image,
  name,
  communityId,
}: Partial<IUser & { communityUsername: string; communityId: number }>) => {
  const theme = useTheme<Theme>();
  const toast = useToast();
  const navigation = useNavigation<PageType>();
  const queryClient = useQueryClient();
  const { setAll: setCommunity } = useCommunityDetailsState((state) => state);
  const { setAll } = useModalState((state) => state);

  const { mutate, isLoading } = useMutation({
    mutationKey: ["invite_follower", id],
    mutationFn: (data: FormData) =>
      httpService.post(`${URLS.INVITE_COMMUNITY_MEMBER}/${communityId}`, data),
    onSuccess: (res) => {
      if (res.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
        toast.show(res.data?.message || "Invitation sent successfully", {
          type: "success",
        });
        queryClient.invalidateQueries([
          `getInvitationRequests-${communityId}-1`,
          communityId,
        ]);
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
        return;
      }
      toast.show(res.data?.message || "An error occurred", { type: "danger" });
    },
    onError: (e: any) => {
      toast.show(e?.message || "An error occurred", { type: "danger" });
    },
  });
  const invite_user = () => {
    const form = new FormData();
    form.append("user_ids[]", id.toString());
    mutate(form);
  };
  return (
    <Pressable
      onPress={() => {
        setCommunity({
          communityUserToTakeActionOn: { id, username, profile_image },
        });
        setAll({ showInviteModerator: true });
      }}
    >
      <Box
        width="100%"
        paddingVertical="m"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="mainBackGroundColor"
        borderBottomWidth={0}
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
              <CustomText
                variant="subheader"
                color="primaryColor"
                fontSize={18}
              >
                {username[0]?.toUpperCase() ?? ""}
              </CustomText>
            </Box>
          )}
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            width={"90%"}
          >
            <Box flexDirection="row">
              <CustomText
                onPress={() => navigation.navigate("profile", { userId: id })}
                variant="xs"
                fontSize={18}
                marginLeft="s"
              >
                @{username}
              </CustomText>
            </Box>

            <CustomButton
              title="Invite"
              color={theme.colors.secondaryBackGroundColor}
              textColor={theme.colors.black}
              onPress={invite_user}
              height={30}
              isLoading={isLoading}
            />
          </Box>
        </Box>
      </Box>
    </Pressable>
  );
};

const InviteMembers = () => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<PageType>();
  const toast = useToast();
  const { username, id } = useDetailsState((state) => state);
  const { id: communityId } = useCommunityDetailsState((state) => state);
  const [queryUrl, setQueryUrl] = useState(
    `${URLS.FETCH_USER_FOLLOWERS}/${id}`
  );
  const [search, setSearch] = useState("");
  const [fetchMore, setFetchMore] = useState(false);

  const {
    isError,
    isLoading,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: [`getCommunityMembers-${username}`, queryUrl],
    queryFn: ({ pageParam = 1 }) =>
      httpService.get(`${queryUrl}?page=${pageParam}`),
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
      toast.show(e.message, { type: "danger" });
    },
  });
  useEffect(() => {
    const getAll = `${URLS.FETCH_USER_FOLLOWERS}/${id}`;
    const searchAll = `${URLS.SEARCH_USER_FOLLOWERS}/${username}`;
    // queryClient.invalidateQueries(`getCommunityMembers-${username}`);
    if (search.length > 0) {
      setQueryUrl(searchAll);
    } else {
      setQueryUrl(getAll);
    }
  }, [search]);
  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <SettingsHeader
        title="Followers"
        showSave
        handleArrowPressed={() => navigation.goBack()}
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
                placeholder="Search for your follower"
                placeholderTextColor={theme.colors.textColor}
                value={search}
                onChangeText={(val) => setSearch(val)}
              />
            </Box>
          </Box>
        </Box>

        <Box flex={1}>
          <FlatList
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
                      No members yet
                    </CustomText>
                  </Box>
                )}
              </>
            )}
            ListFooterComponent={() => (
              <>
                {(isLoading || isFetching || isFetchingNextPage) && (
                  <Box>
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
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return item.data.data.data.map(
                (user: { user_id: number; follower: IUser }) => (
                  <PostCard
                    key={user.follower.id.toString()}
                    id={user.follower.id}
                    profile_image={user.follower.profile_image}
                    username={user.follower.username}
                    name={user.follower.name}
                    communityId={communityId}
                  />
                )
              );
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InviteMembers;
