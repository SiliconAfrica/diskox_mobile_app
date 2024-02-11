import { View, Text, TextInput, ActivityIndicator } from "react-native";
import React, { useState } from "react";
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
import { FlatList } from 'react-native-gesture-handler'
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import httpService, { IMAGE_BASE } from "../../../../../utils/httpService";
import useToast from "../../../../../hooks/useToast";
import { URLS } from "../../../../../services/urls";
import { useCommunityDetailsState } from "../../states/Settings.state";
import { IUser } from "../../../../../models/user";
import { IPost } from "../../../../../models/post";
import { Image } from "expo-image";

const testArray = [2, 2, 3, 4, 5, 6, 7, 7, 6, 5, 4, 3];

const PostCard = ({
  user,
  title,
  description,
  id,
  community_id,
}: Partial<IPost>) => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<PageType>();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { mutate: approvePost, isLoading: isApproving } = useMutation({
    mutationKey: `approve_post-${id}`,
    mutationFn: (data: { post_id: string }) =>
      httpService.put(`${URLS.APPROVE_COMMUNITY_POST}/${community_id}`, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries([`getCommunityPosts`, community_id]);
      toast.show(res.data.message, { type: "success" });
    },
    onError: (e: any) => {
      toast.show(e.message || "An error occured", { type: "danger" });
    },
  });
  const { mutate: declinePost, isLoading: isDeclining } = useMutation({
    mutationKey: `decline_post-${id}`,
    mutationFn: (data: { post_id: string }) =>
      httpService.put(`${URLS.APPROVE_COMMUNITY_POST}/${community_id}`, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries([`getCommunityPosts`, community_id]);
      toast.show(res.data.message, { type: "success" });
    },
    onError: (e: any) => {
      toast.show(e.message || "An error occured", { type: "danger" });
    },
  });

  return (
    <Box
      width="100%"
      paddingVertical="m"
      flexDirection="row"
      backgroundColor="mainBackGroundColor"
      borderBottomWidth={4}
      borderBottomColor="secondaryBackGroundColor"
      marginBottom="s"
      paddingHorizontal="s"
    >
      {user.profile_image ? (
        <Image
          source={{ uri: `${IMAGE_BASE}${user.profile_image}` }}
          style={{ width: 30, height: 30, borderRadius: 17 }}
          contentFit="cover"
        />
      ) : (
        !user.profile_image && (
          <Box
            width={30}
            height={30}
            borderRadius={15}
            backgroundColor="fadedButtonBgColor"
            justifyContent="center"
            alignItems="center"
          >
            <CustomText variant="subheader" color="primaryColor" fontSize={18}>
              {user.username[0]?.toUpperCase() ?? ""}
            </CustomText>
          </Box>
        )
      )}

      <Box width="100%" marginLeft="s">
        <Box flexDirection="row" alignItems="center">
          <CustomText variant="subheader" fontSize={18}>
            @{user?.username}
          </CustomText>
          <CustomText variant="xs" marginLeft="s">
            3 min ago.
          </CustomText>
        </Box>

        <CustomText
          variant="body"
          style={{ width: "88%" }}
          marginTop="m"
          fontSize={16}
        >
          {description}
        </CustomText>

        <Box flexDirection="row" alignItems="center" marginTop="m">
          <CustomButton
            title="Decline"
            color={theme.colors.secondaryBackGroundColor}
            textColor={theme.colors.black}
            onPress={() => declinePost({ post_id: id.toString() })}
            height={30}
            width={100}
            isLoading={isDeclining}
          />
          <Box width={10} />
          <CustomButton
            title="Approve"
            onPress={() => approvePost({ post_id: id.toString() })}
            height={30}
            width={100}
            color={theme.colors.primaryColor}
            isLoading={isApproving}
          />
          <CustomText
            marginLeft="m"
            onPress={() => navigation.navigate("profile", { userId: user.id })}
          >
            View Profile
          </CustomText>
        </Box>
      </Box>
    </Box>
  );
};

const PostApproval = () => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<PageType>();
  const toast = useToast();
  const { id } = useCommunityDetailsState((state) => state);
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
    queryKey: [`getCommunityPosts`, id],
    queryFn: ({ pageParam = 1 }) =>
      httpService.get(
        `${URLS.GET_COMMUNITY_PENDING_POSTS}/${id}?page=${pageParam}`
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
        title="Approve Post"
        showSave
        handleArrowPressed={() => navigation.goBack()}
      />
      <CustomText
        marginTop="m"
        marginLeft="m"
        variant="subheader"
        fontSize={14}
      >
        {data?.pages.map((page, i) => page?.data?.data?.total || 0)} pending
        posts
      </CustomText>

      {/* SEARCH BOX */}

      <Box flex={1}>
        {/* <ScrollView>
            {
                testArray.map((item, index) => (
                    <PostCard key={index.toString()} />
                ))
            }
            </ScrollView> */}
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
                    There are no pending posts
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
          renderItem={({ item, index }) =>
            item?.data?.data?.data?.map((post: IPost) => (
              <PostCard
                key={post.id.toString()}
                community_id={id}
                id={post.id}
                description={post.description}
                title={post.title}
                user={post.user}
              />
            ))
          }
        />
      </Box>
    </Box>
  );
};

export default PostApproval;
