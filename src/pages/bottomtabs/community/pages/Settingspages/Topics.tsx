import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Box from "../../../../../components/general/Box";
import { ScrollView } from "react-native-gesture-handler";
import CustomText from "../../../../../components/general/CustomText";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../../../../theme";
import { Feather } from "@expo/vector-icons";
import SettingsHeader from "../../../../../components/settings/Header";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { PageType } from "../../../../login";
import { useCommunityDetailsState } from "../../states/Settings.state";
import { useQuery } from "react-query";
import httpService from "../../../../../utils/httpService";
import { CUSTOM_STATUS_CODE } from "../../../../../enums/CustomCodes";
import useToast from "../../../../../hooks/useToast";
import { URLS } from "../../../../../services/urls";
import { IInterest } from "../../../../../models/Interests";
import { COMMUNITY_SETTING_TYPE } from "../../../../../enums/CommunitySettings";
import { RootStackParamList } from "../../../../../navigation/MainNavigation";

const Topics = ({}) => {
  const theme = useTheme<Theme>();
  const toast = useToast();
  const [interests, setInterests] = useState([]);
  const navigation = useNavigation<PageType>();
  const route = useRoute<RouteProp<RootStackParamList, "community-settings">>();
  const { id, type, username: CommunityUsername } = route.params;
  const { topics, setAll } = useCommunityDetailsState((state) => state);

  const [active, setActive] = React.useState(topics);

  useEffect(() => {
    if (active !== topics) {
      setAll({ newTopic: active });
      navigation.replace("community-settings", {
        id: id,
        username: CommunityUsername,
        type: COMMUNITY_SETTING_TYPE.EDIT,
      });
    }
  }, [active]);
  const getInterests = useQuery(
    ["getInterests"],
    () => httpService.get(`${URLS.GET_CATEGORIES}`),
    {
      onSuccess: (data) => {
        if (data?.data?.code === CUSTOM_STATUS_CODE.INTERNAL_SERVER_ERROR) {
          toast.show(
            data?.data?.message || "An error occured while getting interests",
            { type: "error" }
          );
        }
        if (data?.data?.code === CUSTOM_STATUS_CODE.SUCCESS) {
          setInterests(data?.data?.data as IInterest[]);
        }
      },
      onError: (error: any) => {
        toast.show(error.message, { type: "error" });
      },
    }
  );

  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <SettingsHeader
        showSave
        title="Topics"
        handleArrowPressed={() =>
          navigation.navigate("community-settings", {
            id,
            type: COMMUNITY_SETTING_TYPE.EDIT,
            username: CommunityUsername,
          })
        }
      />
      <Box flex={1} padding="m">
        <Box height={55}>
          <Pressable
            style={{
              paddingHorizontal: 15,
              height: 30,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.colors.secondaryBackGroundColor,
              width: 200,
              flexDirection: "row",
            }}
          >
            <CustomText variant="body">{active}</CustomText>
            <Feather
              name="x"
              size={20}
              color={theme.colors.textColor}
              style={{ marginLeft: 20 }}
            />
          </Pressable>
        </Box>
        <Box flex={0.9}>
          <ScrollView>
            {Array.isArray(interests) &&
              interests.map((item, index) => (
                <Pressable
                  key={item.id.toString()}
                  onPress={() => setActive(item.name)}
                  style={{
                    paddingHorizontal: 15,
                    width: "100%",
                    marginBottom: 30,
                    height: 30,
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "flex-start",
                    minWidth: 40,
                  }}
                >
                  <CustomText key={item.id.toString()} variant="body">
                    {item.name}
                  </CustomText>
                </Pressable>
              ))}
          </ScrollView>
        </Box>
      </Box>
    </Box>
  );
};

export default Topics;
