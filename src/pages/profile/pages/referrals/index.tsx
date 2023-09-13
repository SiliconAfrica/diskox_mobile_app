import Box from "../../../../components/general/Box";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import CustomText from "../../../../components/general/CustomText";
import SettingsHeader from "../../../../components/settings/Header";
import { useNavigation } from "@react-navigation/native";
import { PageType } from "../../../login";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../../../theme";
import EarningsBox from "./EarningsBox";

export default function Referrals() {
  const navigation = useNavigation<PageType>();
  const theme = useTheme<Theme>();
  return (
    <Box flex={1}>
      <SettingsHeader
        showSave={false}
        title="Refer & Earn"
        handleArrowPressed={() => navigation.goBack()}
      />
      <EarningsBox />
      {/* <Box backgroundColor=""></Box> */}
    </Box>
  );
}
