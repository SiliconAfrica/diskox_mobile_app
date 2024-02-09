import { View, Text, TextInput, Alert, Pressable } from "react-native";
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
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import httpService, { IMAGE_BASE } from "../../../../../utils/httpService";
import { URLS } from "../../../../../services/urls";
import { useCommunityDetailsState } from "../../states/Settings.state";
import useToast from "../../../../../hooks/useToast";
import { FlatList } from 'react-native-gesture-handler'
import { ActivityIndicator } from "react-native";
// import { MemberCardSingle } from "./Members";
import { IUser } from "../../../../../models/user";
import { COMMUNITY_SETTING_TYPE } from "../../../../../enums/CommunitySettings";
import { CUSTOM_STATUS_CODE } from "../../../../../enums/CustomCodes";
import CustomButton from "../../../../../components/general/CustomButton";
import { Image } from "expo-image";
import { useDetailsState } from "../../../../../states/userState";

export const MemberCardSingle = ({
  id,
  name,
  username,
  profile_image,
  communityId,
}: Partial<IUser & { communityId: number }>) => {
  console.log(communityId, "lp");
  const theme = useTheme<Theme>();
  const toast = useToast();
  const navigation = useNavigation<PageType>();
  const queryClient = useQueryClient();
  const { id: loggedInUserId } = useDetailsState((state) => state);
  const { mutate, isLoading } = useMutation({
    mutationKey: `unsuspend_community_member-${communityId}`,
    mutationFn: (data: any) =>
      httpService.put(
        `${URLS.UNSUSPEND_COMMUNITY_MEMBER}/${communityId}/${id}`
      ),
    onSuccess: (res) => {
      if (res.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
        queryClient.invalidateQueries([`getSuspendedCommunityMembers`]);
        toast.show(res.data?.message || "Member has been unsuspended", {
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

  const unsuspend_user = () => {
    Alert.alert(
      "Unsuspend user",
      `Are you sure you want to unsuspend "${username}"?`,
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
        <Pressable
          onPress={() => navigation.navigate("profile", { userId: id })}
        >
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
        </Pressable>

        <CustomText variant="body" marginLeft="s">
          @{username}
        </CustomText>
      </Box>
      <Box flexDirection="row" alignItems="center">
        <CustomButton
          title="Unsuspend"
          onPress={unsuspend_user}
          isLoading={isLoading}
          height={30}
          color="red"
          width={80}
        />
      </Box>
    </Box>
  );
};

const Suspended = () => {
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
    queryKey: [`getSuspendedCommunityMembers`, id],
    queryFn: ({ pageParam = 1 }) =>
      httpService.get(
        `${URLS.GET_SUSPENDED_COMMUNITY_MEMBERS}/${id}?page=${pageParam}`
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
        title="Suspended"
        showSave
        handleArrowPressed={() => navigation.goBack()}
        RightItem={
          <CustomText
            variant="body"
            color="primaryColor"
            onPress={() =>
              navigation.push("community-settings", {
                id: 23,
                type: COMMUNITY_SETTING_TYPE.SUSPEND_MEMBER,
                username: communityUsername,
              })
            }
          >
            Suspend Member
          </CustomText>
        }
      />
      <Box flex={1} padding="m">
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
              placeholder="Search for a suspended member"
              placeholderTextColor={theme.colors.textColor}
            />
          </Box>
        </Box>

        <Box flex={1}>
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
                      There are no suspended members
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
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) =>
              item.data.data.data.map((member: IUser) => (
                <MemberCardSingle
                  key={member.id.toString()}
                  id={member.id}
                  profile_image={member.profile_image}
                  username={member.username}
                  communityId={id}
                />
              ))
            }
            // renderItem={({ item }) => <MemberCard {...item} />}
          />
          <Box height={20} />
        </Box>
      </Box>
    </Box>
  );
};

export default Suspended;
