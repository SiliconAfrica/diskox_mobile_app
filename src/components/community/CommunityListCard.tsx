import React from "react";
import Box from "../general/Box";
import PrimaryButton from "../general/PrimaryButton";
import CustomText from "../general/CustomText";
import { useNavigation } from "@react-navigation/native";
import { PageType } from "../../pages/login";
import { ICommunity } from "../../models/Community";
import { Image } from "expo-image";
import httpService, { IMAGE_BASE } from "../../utils/httpService";
import { useMutation, useQueryClient } from "react-query";
import { URLS } from "../../services/urls";
import useToast from "../../hooks/useToast";
import ErrorButton from "../general/ErrorButton";
import { ActivityIndicator, Pressable } from "react-native";
import theme from "../../theme";

const CommunityListCard = (props: ICommunity) => {
  const { name, description, profile_image, id, is_member } = props;
  const navigation = useNavigation<PageType>();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { isLoading, mutate } = useMutation({
    mutationFn: () => httpService.post(`${URLS.JOIN_COMMUNITY}/${id}`),
    onSuccess: (data) => {
      // alert(`You've successfully join ${name} community`);
      if (
        data?.data?.message === "you have successfully joined this community"
      ) {
        toast.show(`You have successfully joined ${name} community`, {
          type: "success",
        });
        navigation.navigate("community", { id, data: props });
      } else if (data?.data?.message === "you have left the community") {
        toast.show(`You have left ${name} community`, {
          type: "success",
        });
      } else {
        toast.show(data?.data?.message, {
          type: "success",
        });
      }
      queryClient.invalidateQueries(["getCommunities"]);
    },
    onError: (e) => {
      toast.show(`An error occured`, {
        type: "danger",
      });
    },
  });
  return (
    <Pressable
      onPress={() => navigation.navigate("community", { id, data: props })}
      style={{
        width: "100%",
        height: 100,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: theme.spacing.m,
        borderBottomColor: theme.colors.secondaryBackGroundColor,
        borderBottomWidth: 2,
      }}
      // width={"100%"}
      // height={100}
      // flexDirection="row"
      // justifyContent="space-between"
      // alignItems="center"
      // paddingHorizontal="m"
      // borderBottomColor="secondaryBackGroundColor"
      // borderBottomWidth={2}
    >
      <Box flexDirection="row" flex={0.6} alignItems="center">
        <Box
          height={30}
          width={30}
          borderRadius={15}
          bg="primaryColor"
          overflow="hidden"
        >
          <Image
            source={{ uri: `${IMAGE_BASE}${profile_image}` }}
            contentFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </Box>

        <Box marginLeft="s">
          <CustomText variant="subheader" fontSize={16}>
            {name}
          </CustomText>
          <CustomText variant="body" fontSize={15}>
            {description?.length > 20
              ? description?.substring(0, 20) + "..."
              : description}
          </CustomText>
        </Box>
      </Box>

      {is_member === 0 ? (
        <PrimaryButton
          title={"Join"}
          isLoading={isLoading}
          onPress={() => mutate()}
          height={35}
          width={70}
        ></PrimaryButton>
      ) : (
        <ErrorButton
          title={"Leave"}
          onPress={() => mutate()}
          height={35}
          isLoading={isLoading}
          width={70}
        ></ErrorButton>
      )}
    </Pressable>
  );
};

export default CommunityListCard;
