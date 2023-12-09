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
import { useInfiniteQuery, useQuery } from "react-query";
import { useCommunityDetailsState } from "../../states/Settings.state";
import httpService, { IMAGE_BASE } from "../../../../../utils/httpService";
import { URLS } from "../../../../../services/urls";
import { FlashList } from "@shopify/flash-list";
import { useToast } from "react-native-toast-notifications";
import { IUser } from "../../../../../models/user";
import { Image } from "expo-image";

const testArray = [2, 2, 3, 4, 5, 6, 7, 7, 6, 5, 4, 3];

const MemberCard = ({ id, name, username, profile_image }: Partial<IUser>) => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<PageType>();
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
        {/* <CustomButton
          title="Delete"
          onPress={() => {}}
          height={30}
          color="red"
          width={60}
        /> */}
      </Box>
    </Box>
  );
};

const Members = () => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<PageType>();
  const toast = useToast();
  const { username } = useCommunityDetailsState((state) => state);
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
    queryKey: [`getCommunityMembers-${username}`],
    queryFn: ({ pageParam = 1 }) =>
      httpService.get(
        `${URLS.GET_COMMUNITY_MEMBERS}/${username}?page=${pageParam}`
      ),
    getNextPageParam: (_lastpage, allPages) => {
      const currentPage = allPages[allPages.length - 1];
      if (currentPage.data.data.next_page_url) {
        return allPages.length + 1;
      } else {
        return undefined;
      }
    },
    onError: (e) => {
      toast.show("Fetch error", { type: "error" });
    },
  });

  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <SettingsHeader
        showSave
        title="Members"
        handleArrowPressed={() => navigation.goBack()}
      />
      <Box flex={1} padding="m">
        <CustomText variant="subheader" fontSize={14}>
          200 members
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
            />
          </Box>
        </Box>

        <Box flex={1}>
          {/* <ScrollView>
            {testArray.map((item, inex) => (
              <MemberCard key={inex.toString()} />
            ))}
                  </ScrollView> */}
          <FlashList
            ListEmptyComponent={() => (
              <>
                {!isLoading && (
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
                {isLoading && (
                  <Box>
                    <ActivityIndicator
                      size="large"
                      color={theme.colors.primaryColor}
                    />
                  </Box>
                )}
              </>
            )}
            data={data?.pages}
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
                <MemberCard
                  key={member.id.toString()}
                  id={member.id}
                  profile_image={member.profile_image}
                  username={member.username}
                />
              ))
            }
            // renderItem={({ item }) => <MemberCard {...item} />}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Members;
