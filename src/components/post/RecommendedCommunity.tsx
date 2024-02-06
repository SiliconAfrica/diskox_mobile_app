import React from "react";
import Box from "../general/Box";
import CustomText from "../general/CustomText";
import CustomButton from "../general/CustomButton";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { Image } from "expo-image";
import httpService, { IMAGE_BASE } from "../../utils/httpService";
import { Ionicons } from "@expo/vector-icons";
import { IRecommendedCommunities } from "../../models/RecommendCommunity";
import { useMutation, useQueryClient } from "react-query";
import { URLS } from "../../services/urls";
import { useToast } from "react-native-toast-notifications";

interface IProp {
  community: IRecommendedCommunities;
  removedCommunity: (index: number) => void;
  index: number;
}

const RecommendedCommunityCard = ({
  community: {
    id,
    username,
    name,
    recommended_members,
    profile_image,
    members_count,
  },
  removedCommunity,
  index,
}: IProp) => {
  const theme = useTheme<Theme>();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: () => httpService.post(`${URLS.JOIN_COMMUNITY}/${id}`),
    onSuccess: (data) => {
      toast.show(data.data.message, { type: "success" });
      removedCommunity(index);
      queryClient.invalidateQueries(["getRecommendedCommunities"]);
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
              c/{name?.length > 12 ? name?.slice(0, 12) + "..." : name}
            </CustomText>
          )}
          <CustomText variant="body" fontSize={14}>
            {members_count} {members_count > 1 ? "Members" : "Memebr"}
          </CustomText>
        </Box>
      </Box>

      <CustomButton
        onPress={() => {
          mutate();
        }}
        title="Join"
        color={theme.colors.secondaryBackGroundColor}
        textColor={theme.colors.primaryColor}
        width={"100%"}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default RecommendedCommunityCard;
