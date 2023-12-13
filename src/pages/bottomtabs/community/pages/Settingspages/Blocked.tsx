import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Pressable,
} from "react-native";
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
import { COMMUNITY_SETTING_TYPE } from "../../../../../enums/CommunitySettings";
import { FlashList } from "@shopify/flash-list";
import httpService, { IMAGE_BASE } from "../../../../../utils/httpService";
import { useInfiniteQuery } from "react-query";
import { URLS } from "../../../../../services/urls";
import useToast from "../../../../../hooks/useToast";
import { useCommunityDetailsState } from "../../states/Settings.state";
import { CUSTOM_STATUS_CODE } from "../../../../../enums/CustomCodes";
import { IUser } from "../../../../../models/user";
import { useModalState } from "../../../../../states/modalState";
import { Image } from "expo-image";

const MemberCardSingle = ({
  id,
  username,
  profile_image,
  name,
}: Partial<IUser & { communityUsername: string; communityId: number }>) => {
  const theme = useTheme<Theme>();
  const { setAll: setCommunity } = useCommunityDetailsState((state) => state);
  const { setAll } = useModalState((state) => state);
  return (
    <Pressable
      onPress={() => {
        setCommunity({
          communityUserToTakeActionOn: { username, id, profile_image },
        });
        setAll({ showBlockMemberFromCommunity: true });
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
          {/* <Box width={30} height={30} borderRadius={15} backgroundColor='primaryColor' /> */}
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
          <Box marginLeft="m">
            <Box flexDirection="row">
              <CustomText variant="subheader" fontSize={18}>
                {name}
              </CustomText>
              <CustomText variant="xs" fontSize={18} marginLeft="s">
                @{username}
              </CustomText>
            </Box>
          </Box>
        </Box>
      </Box>
    </Pressable>
  );
};

const Blocked = () => {
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
    queryKey: [`getBlockedCommunityMembers-${id}`, id],
    queryFn: ({ pageParam = 1 }) =>
      httpService.get(
        `${URLS.FETCH_BLOCKED_COMMUNITY_MEMBERS}/${id}?page=${pageParam}`
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
        title="Blocked"
        showSave
        handleArrowPressed={() => navigation.goBack()}
        RightItem={
          <CustomText
            variant="body"
            color="primaryColor"
            onPress={() =>
              navigation.push("community-settings", {
                id: 23,
                type: COMMUNITY_SETTING_TYPE.BLOCK_MEMBER,
                username: communityUsername,
              })
            }
          >
            Block Member
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
              placeholder="Search for a member"
              placeholderTextColor={theme.colors.textColor}
            />
          </Box>
        </Box>

        {/* <Box
          width="100%"
          height={350}
          justifyContent="center"
          alignItems="center"
        >
          <Ionicons name="cube" size={100} color={theme.colors.primaryColor} />
          <CustomText
            variant="subheader"
            fontSize={18}
            textAlign="center"
            marginTop="m"
          >
            You have not blocked anyone in c/SkyHunters
          </CustomText>
          <Box height={20} />
        </Box> */}
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
                    There are no blocked members
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
              <MemberCardSingle
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
  );
};

export default Blocked;
