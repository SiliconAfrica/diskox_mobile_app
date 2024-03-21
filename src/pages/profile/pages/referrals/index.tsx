import Box from "../../../../components/general/Box";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import CustomText from "../../../../components/general/CustomText";
import SettingsHeader from "../../../../components/settings/Header";
import { useNavigation } from "@react-navigation/native";
import { PageType } from "../../../login";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../../../theme";
import EarningsBox from "./EarningsBox";
import TotalReferrals from "./totalReferrals";
import ReferralList from "./ReferralList";
import { ScrollView } from "react-native";
import TotalWithdrawals from "./totalWithdrawals";
import CustomButton from "../../../../components/general/CustomButton";
import useToast from "../../../../hooks/useToast";

export default function Referrals() {
  const navigation = useNavigation<PageType>();
  const theme = useTheme<Theme>();
  const toast = useToast();

  const showErr = () => {
    toast.show(
      "You need to earn more points and reach the threshold to add a payment account or see withdrawals",
      { type: "danger" }
    );
  };
  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <ScrollView>
        <SettingsHeader
          showSave={false}
          title="Refer & Earn"
          handleArrowPressed={() => navigation.goBack()}
        />
        <Box
          flexDirection="row"
          justifyContent="space-between"
          paddingVertical="m"
          paddingHorizontal="s"
          alignItems="center"
        >
          <CustomText color="primaryColor" onPress={showErr}>
            Add Payment Account
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
            onPress={showErr}
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
