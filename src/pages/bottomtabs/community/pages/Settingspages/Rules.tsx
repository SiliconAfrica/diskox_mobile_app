import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Box from "../../../../../components/general/Box";
import CustomText from "../../../../../components/general/CustomText";
import { Theme } from "../../../../../theme";
import { useTheme } from "@shopify/restyle";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import FadedButton from "../../../../../components/general/FadedButton";
import CustomButton from "../../../../../components/general/CustomButton";
import { ScrollView } from "react-native-gesture-handler";
import SettingsHeader from "../../../../../components/settings/Header";
import { useNavigation } from "@react-navigation/native";
import { PageType } from "../../../../login";
import { COMMUNITY_SETTING_TYPE } from "../../../../../enums/CommunitySettings";
import { IUser } from "../../../../../models/user";
import { FlatList } from 'react-native-gesture-handler'
import useToast from "../../../../../hooks/useToast";
import { useCommunityDetailsState } from "../../states/Settings.state";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import httpService from "../../../../../utils/httpService";
import { URLS } from "../../../../../services/urls";
import { CUSTOM_STATUS_CODE } from "../../../../../enums/CustomCodes";
import { useModalState } from "../../../../../states/modalState";
import { IRule } from "../../../../../models/Rules";

const PostCard = ({
  index,
  id,
  title,
  description,
  communityId,
}: Partial<IRule & { index: number; communityId: number }>) => {
  const theme = useTheme<Theme>();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { setAll } = useModalState((state) => state);
  const { setAll: setCommunity } = useCommunityDetailsState((state) => state);

  const { mutate, isLoading } = useMutation({
    mutationKey: [],
    mutationFn: () =>
      httpService.delete(`${URLS.DELETE_COMMUNITY_RULE}/${communityId}/${id}`),
    onSuccess: (res) => {
      if (res.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
        toast.show(res.data.message, { type: "success" });
        queryClient.invalidateQueries([
          `getCommunityRules-${communityId}`,
          communityId,
        ]);
        return;
      }
      toast.show(res?.data?.message || "An error occured", { type: "danger" });
    },
    onError: (e: any) => {
      toast.show(e.message || "An error occured", { type: "danger" });
    },
  });
  const delete_rule = () => {
    Alert.alert("Delete rule", `Are you sure you want to delete this rule?`, [
      {
        text: "No",
        onPress: () => {},
        style: "cancel",
      },
      { text: "Yes", onPress: () => mutate() },
    ]);
  };
  return (
    <Box
      width="100%"
      paddingVertical="m"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="flex-start"
      backgroundColor="mainBackGroundColor"
      borderWidth={2}
      borderColor="secondaryBackGroundColor"
      marginBottom="s"
      paddingHorizontal="m"
    >
      <CustomText variant="subheader" fontSize={20}>
        {index}
      </CustomText>

      <Box marginLeft="s" width="100%">
        <CustomText variant="subheader" fontSize={20}>
          {title}
        </CustomText>
        <CustomText fontSize={16} marginTop="s">
          {description}
        </CustomText>
        <Box flexDirection="row" justifyContent="flex-end">
          <Feather
            name="edit"
            size={30}
            style={{ marginRight: 5 }}
            color={theme.colors.black}
            onPress={() => {
              setCommunity({ ruleToActOn: { id, title, description } });
              setAll({ showAddCommunityRule: true });
            }}
          />
          {!isLoading ? (
            <MaterialIcons
              name="delete"
              size={30}
              style={{ marginRight: 5 }}
              color={theme.colors.black}
              onPress={delete_rule}
            />
          ) : (
            <ActivityIndicator size={30} color={theme.colors.primaryColor} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

const Rules = () => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<PageType>();
  const toast = useToast();
  const [fetchMore, setFetchMore] = useState(false);

  const { id, username: communityUsername } = useCommunityDetailsState(
    (state) => state
  );
  const { setAll } = useModalState((state) => state);

  const {
    isError,
    isLoading,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: [`getCommunityRules-${id}`, id],
    queryFn: ({ pageParam = 1 }) =>
      httpService.get(`${URLS.GET_COMMUNITY_RULES}/${id}?page=${pageParam}`),
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
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <SettingsHeader
        title="Rules"
        showSave
        handleArrowPressed={() => navigation.goBack()}
        RightItem={
          <CustomText
            variant="body"
            color="primaryColor"
            onPress={() => setAll({ showAddCommunityRule: true })}
          >
            Add Rule
          </CustomText>
        }
      />
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
                    There are no community rules yet
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
            item.data.data.map((rule: IRule, i) => (
              <PostCard
                key={rule.id.toString()}
                index={i + 1}
                id={rule.id}
                title={rule.title}
                description={rule.description}
                communityId={id}
              />
            ))
          }
        />
      </Box>
    </Box>
  );
};

export default Rules;
