import { TextInput, ActivityIndicator, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Box from "../../../../../components/general/Box";
import CustomText from "../../../../../components/general/CustomText";
import { Theme } from "../../../../../theme";
import { useTheme } from "@shopify/restyle";
import { Feather } from "@expo/vector-icons";
import CustomButton from "../../../../../components/general/CustomButton";
import SettingsHeader from "../../../../../components/settings/Header";
import { useNavigation } from "@react-navigation/native";
import { PageType } from "../../../../login";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { useCommunityDetailsState } from "../../states/Settings.state";
import httpService, { IMAGE_BASE } from "../../../../../utils/httpService";
import { URLS } from "../../../../../services/urls";
import { FlashList } from "@shopify/flash-list";
import { useToast } from "react-native-toast-notifications";
import { IUser } from "../../../../../models/user";
import { Image } from "expo-image";
import { CUSTOM_STATUS_CODE } from "../../../../../enums/CustomCodes";
import { useDetailsState } from "../../../../../states/userState";

export const MemberCardSingle = ({
  id,
  name,
  username,
  profile_image,
  communityUsername,
  communityId,
}: Partial<IUser & { communityUsername: string; communityId: number }>) => {
  const theme = useTheme<Theme>();
  const toast = useToast();
  const navigation = useNavigation<PageType>();
  const queryClient = useQueryClient();
  const { id: loggedInUserId } = useDetailsState((state) => state);
  const { mutate, isLoading } = useMutation({
    mutationKey: `remove_community_member-${communityId}`,
    mutationFn: (data: any) =>
      httpService.delete(
        `${URLS.REMOVE_COMMUNITY_MEMBER}/${communityId}/${id}`,
        data
      ),
    onSuccess: (res) => {
      if (res.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
        queryClient.invalidateQueries([
          `getCommunityMembers-${communityUsername}`,
        ]);
        toast.show(res.data?.message || "Member has been removed", {
          type: "success",
        });
        return;
      }
      toast.show(res.data?.message || "An error occured", { type: "danger" });
    },
    onError: (e: any) => {
      toast.show(e?.message || "An error occured", { type: "danger" });
    },
  });

  const remove_user = () => {
    Alert.alert(
      "Remove user",
      `Are you sure you want to remove "${username}" from this community?`,
      [
        {
          text: "No",
          onPress: () => {},
          style: "cancel",
        },
        { text: "Yes", onPress: () => mutate({}) },
      ]
    );
  };
  return (
    <Box
      width="100%"
      height={60}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box flexDirection="row" alignItems="center">
        {profile_image ? (
          <Image
            source={{ uri: `${IMAGE_BASE}${profile_image}` }}
            style={{ width: 30, height: 30, borderRadius: 17 }}
            contentFit="cover"
          />
        ) : (
          !profile_image && (
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
          )
        )}

        <CustomText variant="body" marginLeft="s">
          @{username}
        </CustomText>
      </Box>

      <Box flexDirection="row" alignItems="center">
        <CustomButton
          title="View Profile"
          color={theme.colors.secondaryBackGroundColor}
          textColor={theme.colors.black}
          onPress={() => navigation.navigate("profile", { userId: id })}
          height={30}
          width={100}
        />
        <Box width={10} />
        {id !== loggedInUserId && (
          <CustomButton
            title="Remove"
            onPress={remove_user}
            isLoading={isLoading}
            height={30}
            color="red"
            width={60}
          />
        )}
      </Box>
    </Box>
  );
};

const Members = () => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<PageType>();
  const toast = useToast();
  const { username, id } = useCommunityDetailsState((state) => state);
  const [fetchMore, setFetchMore] = useState(false);
  const [queryUrl, setQueryUrl] = useState(
    `${URLS.GET_COMMUNITY_MEMBERS}/${username}`
  );
  const [search, setSearch] = useState("");

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
    const getAll = `${URLS.GET_COMMUNITY_MEMBERS}/${username}`;
    const searchAll = `${URLS.SEARCH_COMMUNITY_MEMBERS_BY_USERNAME}/${id}/${search}`;
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
        showSave
        title="Members"
        handleArrowPressed={() => navigation.goBack()}
      />
      <Box flex={1} padding="m">
        <CustomText variant="subheader" fontSize={14}>
          {data?.pages.map((page, i) => page.data.data.total)} members
        </CustomText>

        {/* SEARCH BOX */}

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
              placeholder="Search for a member"
              placeholderTextColor={theme.colors.textColor}
              value={search}
              onChangeText={(val) => setSearch(val)}
            />
          </Box>
        </Box>

        <Box flex={1}>
          <FlashList
            ListEmptyComponent={() => (
              <>
                {!isLoading && !isFetching && (
                  <Box
                    width="100%"
                    height={40}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <CustomText>No members</CustomText>
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
            estimatedItemSize={10}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) =>
              item.data.data.data.map((member: IUser) => (
                <MemberCardSingle
                  key={member.id.toString()}
                  id={member.id}
                  profile_image={member.profile_image}
                  username={member.username}
                  communityUsername={username}
                  communityId={id}
                />
              ))
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Members;
