import { View, Text } from "react-native";
import React from "react";
import Box from "../general/Box";
import CustomText from "../general/CustomText";
import CustomButton from "../general/CustomButton";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { IRecommendedPeople } from "../../models/RecommendedPeople";
import { Image } from "expo-image";
import httpService, { IMAGE_BASE } from "../../utils/httpService";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "react-query";
import { URLS } from "../../services/urls";
import { useToast } from "react-native-toast-notifications";

interface IProp {
  user: IRecommendedPeople;
  removedUser: (index: number) => void;
  index: number;
}

const RecommendedUsersCard = ({
  user: { id, username, name, recommended_followers, profile_image },
  removedUser,
  index,
}: IProp) => {
  const theme = useTheme<Theme>();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: () => httpService.post(`${URLS.FOLLOW_OR_UNFOLLOW_USER}/${id}`),
    onSuccess: (data) => {
      toast.show(data.data.message, { type: "success" });
      removedUser(index);
      queryClient.invalidateQueries(["getRecommendedPeople"]);
    },
    onError: (error: any) => {
      toast.show(error.message, { type: "error", placement: "top" });
    },
  });

  return (
    <Box width="100%" height={"100%"} justifyContent="center">
      <Box
        width={"100%"}
        flexDirection="row"
        alignItems="center"
        marginBottom="m"
      >
        <Box
          width={50}
          height={50}
          borderRadius={35}
          bg="borderColor"
          overflow="hidden"
        >
          {profile_image === null && (
            <Box
              width={"100%"}
              height={"100%"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Ionicons
                name="person"
                color={theme.colors.textColor}
                size={25}
              />
            </Box>
          )}
          {profile_image !== null && (
            <Box width={"100%"} height={"100%"} overflow="hidden">
              <Image
                source={{ uri: `${IMAGE_BASE}${profile_image}` }}
                contentFit="cover"
                style={{ width: "100%", height: "100%" }}
              />
            </Box>
          )}
        </Box>
        <Box width={"100%"} marginLeft={"s"}>
          {name && (
            <CustomText variant="subheader" fontSize={16}>
              {name?.length > 12 ? name?.slice(0, 12) + "..." : name}
            </CustomText>
          )}
          <CustomText variant="body" fontSize={14}>
            @{username?.length > 12 ? username?.slice(0, 12) + "..." : username}
          </CustomText>
        </Box>
      </Box>

      <CustomButton
        onPress={() => {
          mutate();
        }}
        title="Follow"
        color={theme.colors.secondaryBackGroundColor}
        textColor={theme.colors.primaryColor}
        width={"100%"}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default RecommendedUsersCard;
