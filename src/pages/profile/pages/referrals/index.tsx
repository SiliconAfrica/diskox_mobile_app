import Box from "../../../../components/general/Box";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import CustomText from "../../../../components/general/CustomText";
import SettingsHeader from "../../../../components/settings/Header";
import { useNavigation } from "@react-navigation/native";
import { PageType } from "../../../login";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../../../theme";
import EarningsBox, { TRefPoints } from "./EarningsBox";
import TotalReferrals from "./totalReferrals";
import ReferralList from "./ReferralList";
import { ScrollView } from "react-native";
import TotalWithdrawals from "./totalWithdrawals";
import CustomButton from "../../../../components/general/CustomButton";
import useToast from "../../../../hooks/useToast";
import { useModalState } from "../../../../states/modalState";
import { Image } from "expo-image";
import httpService from "../../../../utils/httpService";
import { useQuery } from "react-query";
import { URLS } from "../../../../services/urls";
import { useState } from "react";
import { CUSTOM_STATUS_CODE } from "../../../../enums/CustomCodes";
import { useDetailsState } from "../../../../states/userState";

interface IBank {
  id: number;
  bank_name: string;
  account_name: string;
  account_number: string;
}
export default function Referrals() {
  const navigation = useNavigation<PageType>();
  const theme = useTheme<Theme>();
  const [bank, setBank] = useState<IBank>();
  const [canWithdrawEarnings, setCanWithdrawEarnings] = useState(false);
  const { setAll } = useModalState();
  const toast = useToast();

  const { isLoading: isLoadingRefPoint } = useQuery(
    ["referrals_point"],
    () => httpService.get(`${URLS.FETCH_REF_POINTS}`),
    {
      onSuccess: (data) => {
        if (data.data.code === 1) {
          if (data.data.data?.threshold === data.data.data?.available_points) {
            setCanWithdrawEarnings(true);
          }
        }
      },
      onError: (error: any) => {
        alert(error.message);
      },
    }
  );

  const { isLoading, refetch } = useQuery(
    ["fetch_payment_account"],
    () => httpService.get(`${URLS.BANK_ACCOUNT}`),
    {
      onSuccess: (data) => {
        if (data.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
          setBank({ ...data.data.data });
        }
      },
      onError: (error: any) => {
        toast.show(error.message, { type: "danger" });
      },
    }
  );

  const showErr = () => {
    toast.show(
      "You need to earn more points and reach the threshold to add a payment account",
      { type: "danger" }
    );
  };

  const addPayment = () => {
    setAll({ showPaymentAccountModal: true });
  };
  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <ScrollView>
        <SettingsHeader
          showSave={false}
          title="Refer & Earn"
          handleArrowPressed={() => navigation.goBack()}
        />
        {bank && (
          <Box
            flexDirection="row"
            paddingVertical="m"
            paddingHorizontal="s"
            alignItems="center"
          >
            <Image
              source={require("../../../../../assets/flutterwaveicon.png")}
              style={{ width: 30, height: 30 }}
              contentFit="cover"
            />
            <Box marginLeft="s">
              <CustomText color="black">{bank.account_name}</CustomText>
              <CustomText color="black">
                {bank.account_number.slice(0, 3)}***
              </CustomText>
            </Box>
          </Box>
        )}
        <Box
          flexDirection="row"
          justifyContent="space-between"
          paddingVertical="m"
          paddingHorizontal="s"
          alignItems="center"
        >
          <CustomText
            color="primaryColor"
            onPress={canWithdrawEarnings ? addPayment : showErr}
          >
            {bank ? "Update Payment Account" : "Add Payment Account"}
          </CustomText>

          <CustomText
            color="primaryColor"
            style={{
              backgroundColor: theme.colors.white,
              borderWidth: 1,
              borderColor: theme.colors.primaryColor,
              paddingHorizontal: theme.spacing.m,
              paddingVertical: theme.spacing.s,
              borderRadius: 20,
            }}
            onPress={() => navigation.navigate("referralWithdrawalHistory")}
          >
            Withdrawals
          </CustomText>
        </Box>
        <EarningsBox />
        <TotalReferrals />
        <TotalWithdrawals />
        <ReferralList />
      </ScrollView>
    </Box>
  );
}
