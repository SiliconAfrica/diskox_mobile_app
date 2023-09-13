import { useTheme } from "@shopify/restyle";
import Box from "../../../../components/general/Box";
import CustomText from "../../../../components/general/CustomText";
import { Theme } from "../../../../theme";

export default function ReferralList() {
  const theme = useTheme<Theme>();
  return (
    <Box backgroundColor="white" borderRadius={10} px="s" py="s" mx="s" my="s">
      <CustomText variant="subheader" color="black">
        People you've invited
      </CustomText>
      <Box borderBottomWidth={1} borderBottomColor="primaryColor" mt="s">
        <CustomText
          variant="body"
          color="primaryColor"
          style={{
            borderBottomWidth: 3,
            borderBottomColor: theme.colors.primaryColor,
          }}
        >
          Total Referrals
        </CustomText>
      </Box>
      <Box width="100%" px="s" py="xl" my="l">
        <CustomText textAlign="center">
          Refer your friends to Diskox and gain points
        </CustomText>
      </Box>
    </Box>
  );
}
