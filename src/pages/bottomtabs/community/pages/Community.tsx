import { useWindowDimensions, Pressable, ImageBackground } from "react-native";
import React, { memo, useState } from "react";
import Box from "../../../../components/general/Box";
import { Feather, Ionicons, FontAwesome, Entypo } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../../../theme";
import { ScrollView } from "react-native-gesture-handler";
import CustomText from "../../../../components/general/CustomText";
import Posts from "../../../../components/community/Posts";
import AboutCommunity from "../../../../components/community/About";
import Rules from "../../../../components/community/Rules";
import { COMMUNITY_SETTING_TYPE } from "../../../../enums/CommunitySettings";
import { PageType } from "../../../login";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { CommunityStackParamList } from "..";
import { ICommunity } from "../../../../models/Community";
import { useMutation, useQuery, useQueryClient } from "react-query";
import httpService, { IMAGE_BASE } from "../../../../utils/httpService";
import { URLS } from "../../../../services/urls";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import PrimaryButton from "../../../../components/general/PrimaryButton";
import useToast from "../../../../hooks/useToast";
import mime from "mime";

const Community = () => {
  const theme = useTheme<Theme>();
  const WIDTH = useWindowDimensions().width;
  const [active, setActive] = React.useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();
  const navigation = useNavigation<PageType>();
  const route = useRoute<RouteProp<CommunityStackParamList, "community">>();

  const { id, data } = route.params;
  const [details, setDetails] = React.useState<null | ICommunity>(null);
  const [banner, setBanner] = React.useState("");
  const [profilePicture, setProfilePicture] = React.useState("");

  const { isLoading, isError } = useQuery(
    ["getCommunity", id],
    () => httpService.get(`${URLS.GET_SINGLE_COMMUNITY}/${data.username}`),
    {
      onSuccess: (data) => {
        setDetails(data?.data?.data);
      },
    }
  );
  const { isLoading: isLoadingRole } = useQuery(
    ["getCommunityRole", id],
    () => httpService.get(`${URLS.CHECK_COMMUNITY_ROLE}/${id}`),
    {
      onSuccess: (res) => {
        if (
          Array.isArray(res.data) &&
          res.data[0].data &&
          res.data[0].data.permissions
        ) {
          setShowSettings(true);
        }
      },
    }
  );

  const { isLoading: isJoining, mutate } = useMutation({
    mutationFn: () => httpService.post(`${URLS.JOIN_COMMUNITY}/${id}`),
    onSuccess: (data) => {
      toast.show(`${data?.data?.message || "Success"}`, {
        type: "success",
      });
      queryClient.invalidateQueries(["getCommunities"]);
      queryClient.invalidateQueries(["getCommunity", id]);
    },
    onError: (e) => {
      toast.show(`An error occured`, {
        type: "danger",
      });
    },
  });
  const { isLoading: isAccepting, mutate: acceptInvite } = useMutation({
    mutationFn: () =>
      httpService.post(`${URLS.ACCEPT_COMMUNITY_INVITATION}/${id}`),
    onSuccess: (data) => {
      toast.show(data?.data?.message || "Invitation accepted successfully", {
        type: "success",
      });
      queryClient.invalidateQueries(["getCommunities"]);
      queryClient.invalidateQueries(["getCommunity", id]);
    },
    onError: (e) => {
      toast.show(`An error occured`, {
        type: "danger",
      });
    },
  });
  const { isLoading: isDeclining, mutate: declineInvite } = useMutation({
    mutationFn: () =>
      // update_community_banner_image
      httpService.post(`${URLS.DECLINE_COMMUNITY_INVITATION}/${id}`),
    onSuccess: (data) => {
      toast.show(data?.data?.message || "Invitation declined successfully", {
        type: "success",
      });
      queryClient.invalidateQueries(["getCommunities"]);
      queryClient.invalidateQueries(["getCommunity", id]);
    },
    onError: (e) => {
      toast.show(`An error occured`, {
        type: "danger",
      });
    },
  });
  const { isLoading: isUploading, mutate: changeBanner } = useMutation({
    mutationFn: (body: FormData) =>
      httpService.post(`${URLS.UPDATE_COMMUNITY_BANNER_IMAGE}/${id}`, body),
    onSuccess: (data) => {
      toast.show(data?.data?.message || "Updated successfully", {
        type: "success",
      });
      queryClient.invalidateQueries(["getCommunities"]);
      queryClient.invalidateQueries(["getCommunity"]);
    },
    onError: (e) => {
      setBanner("");
      toast.show(`An error occured`, {
        type: "danger",
      });
    },
  });
  const { mutate: changeProfileImage } = useMutation({
    mutationFn: (body: FormData) =>
      httpService.post(`${URLS.UPDATE_COMMUNITY_PROFILE_IMAGE}/${id}`, body),
    onSuccess: (data) => {
      toast.show(data?.data?.message || "Updated successfully", {
        type: "success",
      });
      queryClient.invalidateQueries(["getCommunities"]);
      queryClient.invalidateQueries(["getCommunity"]);
    },
    onError: (e) => {
      setProfilePicture("");
      toast.show(`An error occured`, {
        type: "danger",
      });
    },
  });
  const change_profile_image = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const file = result.assets[0];
      const mimeType = mime.getType(file.uri);
      const name = file.uri.split("/").pop();
      setProfilePicture(file.uri);

      const form = new FormData();
      form.append("profile_image", {
        uri: file.uri,
        type: mimeType,
        name,
      } as any);
      changeProfileImage(form);
    }
  };
  const change_banner_image = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const file = result.assets[0];
      const mimeType = mime.getType(file.uri);
      const name = file.uri.split("/").pop();
      setBanner(file.uri);

      const form = new FormData();
      form.append("banner_image", {
        uri: file.uri,
        type: mimeType,
        name,
      } as any);
      changeBanner(form);
    }
  };
  const switchPages = React.useCallback(() => {
    switch (active) {
      case 1: {
        return <Posts />;
      }
      case 2: {
        return <AboutCommunity />;
      }
      case 3: {
        return <Rules />;
      }
    }
  }, [active]);
  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <ScrollView>
        {/* BANNER */}
        <Box
          width="100%"
          height={120}
          position="relative"
          style={{ backgroundColor: "#E3A812" }}
        >
          <ImageBackground
            source={{
              uri: banner ? banner : IMAGE_BASE + details?.banner_image,
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <Box
              flexDirection="row"
              paddingTop="m"
              justifyContent="space-between"
              paddingHorizontal="m"
            >
              <Box
                width={40}
                height={40}
                borderRadius={20}
                justifyContent="center"
                alignItems="center"
                bg="fadedButtonBgColor"
              >
                <Feather
                  name="arrow-left"
                  size={25}
                  color={theme.colors.primaryColor}
                  onPress={() => navigation.popToTop()}
                />
              </Box>
              <Box flexDirection="row">
                {details?.is_member === 1 && showSettings && (
                  <Box
                    width={40}
                    height={40}
                    borderRadius={20}
                    justifyContent="center"
                    alignItems="center"
                    bg="fadedButtonBgColor"
                  >
                    <FontAwesome
                      name="paint-brush"
                      color={theme.colors.primaryColor}
                      size={25}
                      onPress={change_banner_image}
                    />
                  </Box>
                )}
                <Box width={5} />
                {details?.is_member === 1 && showSettings && (
                  <Box
                    width={40}
                    height={40}
                    borderRadius={20}
                    justifyContent="center"
                    alignItems="center"
                    bg="fadedButtonBgColor"
                  >
                    <Feather
                      name="settings"
                      size={25}
                      color={theme.colors.primaryColor}
                      onPress={() =>
                        navigation.navigate("community-settings", {
                          id: details.id,
                          username: details.username,
                          type: COMMUNITY_SETTING_TYPE.DEFAULT,
                        })
                      }
                    />
                  </Box>
                )}
              </Box>
            </Box>

            <Box
              width={120}
              height={120}
              borderWidth={4}
              borderRadius={70}
              position="absolute"
              backgroundColor="secondaryBackGroundColor"
              left={(WIDTH / 100) * 35}
              top={60}
              style={{ borderColor: "white" }}
              justifyContent="center"
              alignItems="center"
            >
              {details?.profile_image || profilePicture ? (
                <Image
                  source={{
                    uri: profilePicture
                      ? profilePicture
                      : `${IMAGE_BASE}/${details?.profile_image}`,
                  }}
                  contentFit="cover"
                  style={{ width: "100%", height: "100%", borderRadius: 70 }}
                />
              ) : (
                <Ionicons
                  name="people"
                  size={90}
                  color={theme.colors.mainBackGroundColor}
                />
              )}
              <Box
                width={30}
                height={30}
                borderRadius={25}
                style={{ position: "absolute", right: 0, bottom: 0 }}
                justifyContent="center"
                alignItems="center"
                bg="white"
              >
                <Entypo
                  onPress={change_profile_image}
                  name="camera"
                  size={20}
                  color={theme.colors.primaryColor}
                />
              </Box>
            </Box>
          </ImageBackground>
        </Box>

        <Box alignItems="center" style={{ marginTop: 70 }}>
          <CustomText variant="subheader">{details?.name}</CustomText>
          <CustomText marginBottom="m">c/{details?.username}</CustomText>
          {details?.is_member_request_pending === 1 ? (
            <PrimaryButton
              title={"Pending"}
              onPress={() => mutate({} as any)}
              isLoading={isJoining}
              color={theme.colors.yellowGreen}
            />
          ) : details?.is_invited === 1 ? (
            <Box flexDirection="row">
              <PrimaryButton
                title={"Accept"}
                isLoading={isAccepting}
                onPress={() => acceptInvite()}
              />
              <PrimaryButton
                title={"Decline"}
                isLoading={isDeclining}
                onPress={() => declineInvite()}
                color={theme.colors.error}
              />
            </Box>
          ) : (
            details?.is_member === 0 && (
              <PrimaryButton
                title={"Join"}
                isLoading={isJoining}
                onPress={() => mutate({} as any)}
              />
            )
          )}
        </Box>

        {/* TABVIEW         */}
        <Box
          width={"100%"}
          height={50}
          flexDirection="row"
          borderBottomWidth={1}
          borderBottomColor="secondaryBackGroundColor"
          paddingHorizontal="l"
          marginTop="s"
        >
          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderBottomColor: theme.colors.primaryColor,
              borderBottomWidth: active === 1 ? 2 : 0,
            }}
            onPress={() => setActive(1)}
          >
            <CustomText
              variant="subheader"
              fontSize={18}
              color={active === 1 ? "primaryColor" : "textColor"}
            >
              POST
            </CustomText>
          </Pressable>

          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderBottomColor: theme.colors.primaryColor,
              borderBottomWidth: active === 2 ? 2 : 0,
            }}
            onPress={() => setActive(2)}
          >
            <CustomText
              variant="subheader"
              fontSize={18}
              color={active === 2 ? "primaryColor" : "textColor"}
            >
              ABOUT
            </CustomText>
          </Pressable>

          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderBottomColor: theme.colors.primaryColor,
              borderBottomWidth: active === 3 ? 2 : 0,
            }}
            onPress={() => setActive(3)}
          >
            <CustomText
              variant="subheader"
              fontSize={18}
              color={active === 3 ? "primaryColor" : "textColor"}
            >
              RULES
            </CustomText>
          </Pressable>
        </Box>

        {/* MAIN CONTENT AREA */}

        {switchPages()}
      </ScrollView>
    </Box>
  );
};

export default memo(Community);
