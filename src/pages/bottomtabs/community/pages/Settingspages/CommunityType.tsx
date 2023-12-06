import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Box from "../../../../../components/general/Box";
import CustomText from "../../../../../components/general/CustomText";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../../../../theme";
import { useUtilState } from "../../../../../states/util";
import SettingsHeader from "../../../../../components/settings/Header";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { PageType } from "../../../../login";
import { useMutation } from "react-query";
import httpService from "../../../../../utils/httpService";
import { URLS } from "../../../../../services/urls";
import { CommunityStackParamList } from "../..";
import { RootStackParamList } from "../../../../../navigation/MainNavigation";
import useToast from "../../../../../hooks/useToast";
import { CUSTOM_STATUS_CODE } from "../../../../../enums/CustomCodes";
import { useCommunityDetailsState } from "../../states/Settings.state";
import { ICommunity } from "../../../../../models/Community";

const TypeCard = ({
  active,
  isPublic,
  action,
}: {
  active: boolean;
  isPublic: boolean;
  action: (isPublic: boolean) => void;
}) => {
  const { isDarkMode } = useUtilState((state) => state);
  const theme = useTheme<Theme>();

  return (
    <Box
      width="100%"
      height={100}
      borderRadius={20}
      borderLeftWidth={4}
      borderLeftColor={active ? "primaryColor" : "grey"}
      flexDirection="row"
      alignItems="center"
      backgroundColor={"secondaryBackGroundColor"}
      marginBottom="m"
      paddingHorizontal="m"
    >
      <Box
        width={30}
        height={30}
        borderRadius={15}
        borderWidth={2}
        borderColor={active ? "primaryColor" : "grey"}
        justifyContent="center"
        alignItems="center"
        backgroundColor="mainBackGroundColor"
      >
        {/* <Box width={20} height={20} borderRadius={10} backgroundColor={active ? 'primaryColor':'grey'} ></Box> */}
        <Pressable
          onPress={() => action(isPublic)}
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: active ? theme.colors.primaryColor : "transparent",
          }}
        ></Pressable>
      </Box>

      <Box marginLeft="m" flex={1}>
        <Box flexDirection="row" alignItems="center">
          <Ionicons
            name={isPublic ? "people-outline" : "lock-closed-outline"}
            size={30}
            color={active ? theme.colors.primaryColor : theme.colors.textColor}
          />
          <CustomText
            variant="subheader"
            fontSize={20}
            marginLeft="s"
            color={active ? "primaryColor" : "grey"}
          >
            {isPublic ? "Public" : "Private"}
          </CustomText>
        </Box>
        <CustomText variant="xs">
          {isPublic
            ? "Anyone can view, post, and comment to this community"
            : "Only invited users can post in this community"}
        </CustomText>
      </Box>
    </Box>
  );
};

const CommunityType = () => {
  const navigation = useNavigation<PageType>();
  const theme = useTheme<Theme>();
  const toast = useToast();
  const { type, setAll } = useCommunityDetailsState((state) => state);
  const [isPublic, setIsPublic] = React.useState(true);

  const route = useRoute<RouteProp<RootStackParamList, "community-settings">>();

  const { id } = route.params;

  useEffect(() => {
    if (type === "public") {
      setIsPublic(true);
    } else {
      setIsPublic(false);
    }
  }, [type]);
  const { isLoading, mutate } = useMutation({
    mutationFn: (data: { type: string }) =>
      httpService.put(`${URLS.UPDATE_COMMUNITY_TYPE}/${id}`, data),
    onSuccess: (data) => {
      if (data.data?.code === CUSTOM_STATUS_CODE.SUCCESS) {
        toast.show(data?.data?.message || "Update successful", {
          type: "success",
        });
        // navigation.goBack();
        const item: ICommunity = data?.data?.data;
        setAll({
          type: item?.type,
        });
      }
      if (data.data?.code === CUSTOM_STATUS_CODE.INTERNAL_SERVER_ERROR) {
        toast.show(data?.data?.message, { type: "error" });
      }
    },
    onError: (error: any) => {
      toast.show(error.message, { type: "error" });
    },
  });

  const action = (isPublicc: boolean) => {
    setIsPublic(true);
    const body = {
      type: "public",
    };
    mutate(body);
  };

  const action2 = (isPublicc: boolean) => {
    setIsPublic(false);
    const body = {
      type: "private",
    };
    mutate(body);
  };
  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <SettingsHeader
        showSave={false}
        title="Community type"
        handleArrowPressed={() => navigation.goBack()}
      />

      <Box padding="m">
        <CustomText variant="body" marginBottom="m">
          Change people who can access your community
        </CustomText>

        {!isLoading && (
          <Box>
            <TypeCard
              isPublic
              active={isPublic ? true : false}
              action={action}
            />
            <TypeCard
              isPublic={false}
              active={isPublic ? false : true}
              action={action2}
            />
          </Box>
        )}
        {isLoading && (
          <Box width="100%" justifyContent="center" alignItems="center">
            <ActivityIndicator size="large" color={theme.colors.primaryColor} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CommunityType;
