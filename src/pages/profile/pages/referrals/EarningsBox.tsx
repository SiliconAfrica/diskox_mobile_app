import Box from "../../../../components/general/Box";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import CustomText from "../../../../components/general/CustomText";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../../../theme";
import httpService, { FRONTEND_BASE_URL } from "../../../../utils/httpService";
import { useQuery } from "react-query";
import { useState } from "react";
import { URLS } from "../../../../services/urls";
import { Pressable } from "react-native";
import { copyToClipboard } from "../../../../utils/clipboard";
import { useDetailsState } from "../../../../states/userState";

type TRefPoints = {
  total_points: number;
  balance: number;
  threshold: number;
  point_per_ref: number;
};
export default function EarningsBox() {
  const theme = useTheme<Theme>();
  const [refPoints, setRefPoints] = useState<TRefPoints>();
  const { username } = useDetailsState((state) => state);

  const { isLoading } = useQuery(
    ["referrals_point"],
    () => httpService.get(`${URLS.FETCH_REF_POINTS}`),
    {
      onSuccess: (data) => {
        if (data.data.code === 1) {
          setRefPoints({ ...data.data.data });
        }
      },
      onError: (error: any) => {
        alert(error.message);
      },
    }
  );

  return (
    <Box backgroundColor="primaryColor" mx="s" borderRadius={10} py="m" px="m">
      <CustomText variant="body" color="whitesmoke">
        Total Earnings
      </CustomText>
      <Box width="100%" flexDirection="row" alignItems="center">
        <CustomText variant="header" color="whitesmoke">
          {refPoints?.total_points}
        </CustomText>
        <CustomText variant="xs" color="whitesmoke">
          {" pts"}
        </CustomText>
      </Box>
      <Box
        width="100%"
        height={10}
        backgroundColor="primaryColor"
        borderRadius={50}
        borderWidth={1}
        borderColor="white"
        alignSelf="center"
        style={{ overflow: "hidden" }}
      >
        <Box
          width={`${
            (refPoints?.total_points
              ? refPoints.total_points / refPoints.threshold
              : 0) * 100
          }%`}
          backgroundColor="white"
          height={"100%"}
        ></Box>
      </Box>
      <CustomText color="whitesmoke" mt="l" variant="body">
        Referral link
      </CustomText>
      <Box
        borderRadius={40}
        backgroundColor="grey"
        px="s"
        py="s"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <CustomText color="white" style={{ width: "78%" }} numberOfLines={1}>
          {`${FRONTEND_BASE_URL}register?ref=${username}`}
        </CustomText>
        <Pressable
          onPress={() =>
            copyToClipboard(`${FRONTEND_BASE_URL}register?ref=${username}`)
          }
          style={{ flexDirection: "row", width: "20%", alignItems: "center" }}
        >
          <CustomText color="white">Copy</CustomText>
          <Ionicons name="copy" size={20} color={theme.colors.white} />
        </Pressable>
      </Box>
      <CustomText color="whitesmoke" mt="s" variant="body">
        Share to
      </CustomText>
      <Box flexDirection="row">
        <Box
          width={35}
          height={35}
          borderRadius={50}
          backgroundColor="white"
          alignItems="center"
          justifyContent="center"
        >
          <Entypo
            name="facebook-with-circle"
            size={24}
            color={theme.colors.textBlue}
          />
        </Box>
        <Box
          width={35}
          height={35}
          borderRadius={50}
          mx="s"
          backgroundColor="white"
          alignItems="center"
          justifyContent="center"
        >
          <Entypo
            name="twitter-with-circle"
            size={24}
            color={theme.colors.twitterBlue}
          />
        </Box>
        <Box
          width={35}
          height={35}
          borderRadius={50}
          backgroundColor="white"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            width={24}
            height={24}
            borderRadius={50}
            backgroundColor="whatsappGreen"
            alignItems="center"
            justifyContent="center"
          >
            <FontAwesome name="whatsapp" size={18} color={theme.colors.white} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
