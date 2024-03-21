import { View, Text, useWindowDimensions, Pressable } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Box from "../../../../../components/general/Box";
import useForm from "../../../../../hooks/useForm";
import { editCommunity } from "../../../../../services/validations";
import { CustomTextInput } from "../../../../../components/form/CustomInput";
import CustomText from "../../../../../components/general/CustomText";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../../../../theme";
import { COMMUNITY_SETTING_TYPE } from "../../../../../enums/CommunitySettings";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../navigation/MainNavigation";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { PageType } from "../../../../login";
import SettingsHeader from "../../../../../components/settings/Header";
import { useCommunityDetailsState } from "../../states/Settings.state";
import NormalButton from "../../../../../components/general/NormalButton";
import { SubmitButton } from "../../../../../components/form/SubmittButton";
import { useMutation } from "react-query";
import httpService from "../../../../../utils/httpService";
import { URLS } from "../../../../../services/urls";
import useToast from "../../../../../hooks/useToast";
import { CUSTOM_STATUS_CODE } from "../../../../../enums/CustomCodes";
import { ICommunity } from "../../../../../models/Community";

const EditCommunity = () => {
  const navigation = useNavigation<PageType>();
  const toast = useToast();
  const theme = useTheme<Theme>();
  const HEIGHT = useWindowDimensions().height;
  const { title, description, username, topics, newTopic, setAll } =
    useCommunityDetailsState((state) => state);
  const [theTopic, setTheTopic] = useState("");
  const [showUsernameWarning, setShowUsernameWarning] = useState(false);

  useEffect(() => {
    setTheTopic(newTopic ? newTopic : topics);
  }, [newTopic]);
  const route = useRoute<RouteProp<RootStackParamList, "community-settings">>();
  const { id, type, username: CommunityUsername } = route.params;
  const { isLoading, mutate } = useMutation({
    mutationFn: (data: string) =>
      httpService.put(`${URLS.UPDATE_COMMUNITY_PROFILE}/${id}`, data),
    onSuccess: (data) => {
      if (data.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
        toast.show(data.data?.message, { type: "success" });
        const item: ICommunity = data.data?.data;
        setAll({
          title: item?.name,
          username: item?.username,
          description: item?.description,
          topics: item?.topics,
        });
      } else {
        toast.show(data.data?.message, { type: "danger" });
      }
    },
    onError: (e: any) => {
      toast.show(e.message, { type: "danger" });
    },
  });
  const handleSubmit = (data) => {
    const body = { ...data, topics: theTopic };
    mutate(body);
  };
  const { renderForm } = useForm({
    defaultValues: {
      name: title,
      username,
      description,
    },
    validationSchema: editCommunity,
  });

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = () => {
        setAll({ newTopic: "" });
      };

      return () => unsubscribe();
    }, [])
  );
  return renderForm(
    <Box flex={1} height={HEIGHT} backgroundColor="secondaryBackGroundColor">
      <SettingsHeader
        showSave={false}
        title="Edit"
        handleArrowPressed={() => navigation.goBack()}
      />
      <Box
        width="100%"
        backgroundColor="mainBackGroundColor"
        marginTop="m"
        paddingHorizontal="m"
        paddingVertical="m"
      >
        <CustomTextInput name="name" placeholder="Community title" required />
        <Box height={20} width={"100%"} />

        <CustomTextInput
          name="username"
          placeholder="Community username"
          maxLength={30}
          removeSpecialCharater
          required
          onChange={(text) => {
            setShowUsernameWarning(true);
          }}
        />
        {showUsernameWarning && (
          <CustomText fontSize={12} marginTop="s">
            Users will not be able to access your community with your previous
            link
          </CustomText>
        )}
        <Box height={20} width={"100%"} />

        <CustomTextInput
          name="description"
          multiline
          containerStyle={{ height: 80 }}
          placeholder="Description"
          required
        />
        <CustomText variant="xs">299</CustomText>
        <Box height={20} width={"100%"} />

        <Box flexDirection="row">
          <CustomText variant="subheader" fontSize={18}>
            Topics
          </CustomText>
          <CustomText style={{ color: "red" }}>*</CustomText>
        </Box>

        <Box width={"100%"} height={50} marginTop="m">
          <ScrollView
            horizontal
            contentContainerStyle={{ alignItems: "center" }}
          >
            <Pressable
              style={{
                paddingHorizontal: 15,
                height: 30,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.colors.secondaryBackGroundColor,
                minWidth: 40,
              }}
            >
              <CustomText variant="body">{theTopic}</CustomText>
            </Pressable>

            <CustomText
              color="primaryColor"
              marginLeft="m"
              onPress={() =>
                navigation.replace("community-settings", {
                  id: id,
                  username: CommunityUsername,
                  type: COMMUNITY_SETTING_TYPE.TOPIC,
                })
              }
            >
              Change Topic
            </CustomText>
          </ScrollView>
        </Box>
        <SubmitButton
          label="Update"
          onSubmit={(data) => handleSubmit(data)}
          isLoading={isLoading}
          width={160}
        />
      </Box>
    </Box>
  );
};

export default EditCommunity;
