import { View, Text, Switch } from "react-native";
import React, { useEffect, useState } from "react";
import Box from "../../../../../components/general/Box";
import CustomText from "../../../../../components/general/CustomText";
import SettingsHeader from "../../../../../components/settings/Header";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { PageType } from "../../../../login";
import { useMutation } from "react-query";
import httpService from "../../../../../utils/httpService";
import { URLS } from "../../../../../services/urls";
import { CUSTOM_STATUS_CODE } from "../../../../../enums/CustomCodes";
import useToast from "../../../../../hooks/useToast";
import { useCommunityDetailsState } from "../../states/Settings.state";
import { ICommunity } from "../../../../../models/Community";
import { RootStackParamList } from "../../../../../navigation/MainNavigation";

interface IOptions {
  restricted: number;
  post_approval: number;
}
const ContentControl = () => {
  const navigation = useNavigation<PageType>();
  const route = useRoute<RouteProp<RootStackParamList, "community-settings">>();
  const { id } = route.params;

  const toast = useToast();
  const { setAll, restricted, post_approval } = useCommunityDetailsState(
    (state) => state
  );

  const [options, setOptions] = useState<IOptions>({
    restricted,
    post_approval,
  });

  useEffect(() => {
    setOptions({ restricted, post_approval });
  }, [restricted, post_approval]);

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: { post_approval: number; restricted: number }) =>
      httpService.put(`${URLS.UPDATE_COMMUNITY_TYPE}/${id}`, data),
    onSuccess: (data) => {
      if (data.data?.code === CUSTOM_STATUS_CODE.SUCCESS) {
        toast.show(data?.data?.message || "Update successful", {
          type: "success",
        });
        // navigation.goBack();
        const item: ICommunity = data?.data?.data;
        setAll({
          post_approval: item?.post_approval,
          restricted: item?.restricted,
        });
        return;
      }
      if (data.data?.code === CUSTOM_STATUS_CODE.INTERNAL_SERVER_ERROR) {
        toast.show(data?.data?.message, { type: "error" });
      }
      //reverse the changed status because it failed
      setAll({
        post_approval: options.post_approval === 1 ? 0 : 1,
        restricted: options.restricted === 1 ? 0 : 1,
      });
    },
    onError: (error: any) => {
      //reverse the changed status because it failed
      setAll({
        post_approval: options.post_approval === 1 ? 0 : 1,
        restricted: options.restricted === 1 ? 0 : 1,
      });
      toast.show(error.message, { type: "error" });
    },
  });

  const handleToggleSwitch = (property, value) => {
    let body = { restricted, post_approval };
    if (property === "restricted") {
      body = { ...body, [property]: value === false ? 1 : 0 };
    } else if (property === "post_approval") {
      body = { ...body, [property]: value === false ? 0 : 1 };
    }
    setAll({
      post_approval: body.post_approval,
      restricted: body.restricted,
    });
    mutate(body);
  };
  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <SettingsHeader
        showSave={true}
        title="Content control"
        handleArrowPressed={() => navigation.goBack()}
      />

      <Box paddingHorizontal="m">
        <CustomText variant="body" fontSize={18}>
          Set requirements and restrictions for how people post and comment in
          your community
        </CustomText>
      </Box>

      <Box
        width="100%"
        flexDirection="row"
        justifyContent="space-between"
        marginTop="l"
        paddingHorizontal="m"
      >
        <Box flex={0.9}>
          <CustomText variant="subheader" fontSize={18}>
            Allow members create post for the community
          </CustomText>
          <CustomText variant="body" fontSize={14} marginTop="s">
            All members of the community can create and share post
          </CustomText>
        </Box>

        <Switch
          value={options.restricted === 0 ? true : false}
          onValueChange={(val) => handleToggleSwitch("restricted", val)}
        />
      </Box>

      <Box
        width="100%"
        flexDirection="row"
        justifyContent="space-between"
        marginTop="l"
        paddingHorizontal="m"
      >
        <Box flex={0.9}>
          <CustomText variant="subheader" fontSize={18}>
            Post approval
          </CustomText>
          <CustomText variant="body" fontSize={14} marginTop="s">
            All community content must be approved by a moderator
          </CustomText>
        </Box>

        <Switch
          value={options.post_approval === 0 ? false : true}
          onValueChange={(val) => handleToggleSwitch("post_approval", val)}
        />
      </Box>
    </Box>
  );
};

export default ContentControl;
