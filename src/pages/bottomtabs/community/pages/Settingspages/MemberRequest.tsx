import { View, Text, TextInput, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import Box from "../../../../../components/general/Box";
import CustomText from "../../../../../components/general/CustomText";
import { Theme } from "../../../../../theme";
import { useTheme } from "@shopify/restyle";
import { Feather, Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../../../../../components/general/PrimaryButton";
import SettingsHeader from "../../../../../components/settings/Header";
import { useNavigation } from "@react-navigation/native";
import { PageType } from "../../../../login";
import { useCommunityDetailsState } from "../../states/Settings.state";
import { COMMUNITY_SETTING_TYPE } from "../../../../../enums/CommunitySettings";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import httpService, { IMAGE_BASE } from "../../../../../utils/httpService";
import { URLS } from "../../../../../services/urls";
import { CUSTOM_STATUS_CODE } from "../../../../../enums/CustomCodes";
import useToast from "../../../../../hooks/useToast";
import { FlatList } from 'react-native-gesture-handler'
import { IUser } from "../../../../../models/user";
import CustomButton from "../../../../../components/general/CustomButton";
import { Image } from "expo-image";

const PostCard = ({
  id,
  username,
  profile_image,
  communityId,
}: Partial<IUser & { communityId: number }>) => {
  const theme = useTheme<Theme>();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { mutate: accept, isLoading: isAccepting } = useMutation({
    mutationKey: `accept-member-request-${communityId}`,
    mutationFn: (data: any) =>
      httpService.put(
        `${URLS.ACCEPT_COMMUNITY_MEMBER_REQUEST}/${communityId}/${id}`
      ),
    onSuccess: (res) => {
      if (res.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
        queryClient.invalidateQueries([`getMemberRequests`]);
        toast.show(res.data?.message || "Request has been accepted", {
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
  const { mutate: decline, isLoading: isDeclining } = useMutation({
    mutationKey: `decline-member-request-${communityId}`,
    mutationFn: (data: any) =>
      httpService.delete(
        `${URLS.DECLINE_COMMUNITY_MEMBER_REQUEST}/${communityId}/${id}`
      ),
    onSuccess: (res) => {
      if (res.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
        queryClient.invalidateQueries([`getMemberRequests`]);
        toast.show(res.data?.message || "Member has been declined", {
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
      <Box flexDirection="row">
        <CustomButton
          title="Decline"
          onPress={() => decline({})}
          height={30}
          color={theme.colors.error}
          width={70}
          isLoading={isDeclining}
        />
        <Box width={5} />
        <CustomButton
          title="Accept"
          onPress={() => accept({})}
          height={30}
          isLoading={isAccepting}
          color={theme.colors.primaryColor}
          width={70}
        />
      </Box>
    </Box>
  );
};

const MemberRequest = () => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<PageType>();
  const toast = useToast();
  const { type, id, username } = useCommunityDetailsState((state) => state);
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
    keepPreviousData: false,
    queryKey: [`getMemberRequests`, id],
    queryFn: ({ pageParam = 1 }) =>
      httpService.get(
        `${URLS.FETCH_COMMUNITY_MEMBER_REQUEST}/${id}?page=${pageParam}`
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
  return (
    <Box flex={1}>
      <SettingsHeader
        title="Members Request"
        showSave
        handleArrowPressed={() => navigation.goBack()}
      />
      <Box flex={1} padding="m">
        <CustomText>Accept request of member into your community</CustomText>

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
            />
          </Box>
        </Box>

        {type === "public" ? (
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
              You don’t have any membership request, your community is public.
            </CustomText>
            <Box height={20} />
            <PrimaryButton
              title="Change"
              onPress={() =>
                navigation.push("community-settings", {
                  id: id,
                  type: COMMUNITY_SETTING_TYPE.TYPE,
                  username: username,
                })
              }
              height={35}
            />
          </Box>
        ) : (
          <FlatList
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
                      There are no membership requests
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
              Array.isArray(data?.pages) && data.pages[0].data.data?.total
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
            renderItem={({ item, index }) =>
              item.data.data.data.map((member: IUser) => (
                <PostCard
                  key={member.id.toString()}
                  id={member.id}
                  profile_image={member.profile_image}
                  username={member.username}
                  communityId={id}
                />
              ))
            }
          />
        )}
      </Box>
    </Box>
  );
};

export default MemberRequest;
