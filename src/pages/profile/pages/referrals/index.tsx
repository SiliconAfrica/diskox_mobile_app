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

export default function Referrals() {
  const navigation = useNavigation<PageType>();
  const theme = useTheme<Theme>();
  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <ScrollView>
        <SettingsHeader
          showSave={false}
          title="Refer & Earn"
          handleArrowPressed={() => navigation.goBack()}
        />
        <EarningsBox />
        <TotalReferrals />
        <ReferralList />
      </ScrollView>
    </Box>
  );
}
