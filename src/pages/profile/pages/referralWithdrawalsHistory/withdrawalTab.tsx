import { useTheme } from "@shopify/restyle";
import Box from "../../../../components/general/Box";
import { Theme } from "../../../../theme";
import { IWithdrawal } from "./index";
import CustomText from "../../../../components/general/CustomText";

export default function WithdrawalTab({
  withdrawal,
}: {
  withdrawal: IWithdrawal;
}) {
  const theme = useTheme<Theme>();

  const statusColor = (status) => {
    return status === "success"
      ? {
          bgColor: theme.colors.almostPrimaryGreen,
          textColor: theme.colors.primaryColor,
        }
      : status === "failed"
      ? { bgColor: theme.colors.errorBg, textColor: theme.colors.error }
      : status === "pending"
      ? { bgColor: theme.colors.yellowGreen, textColor: theme.colors.yellow }
      : {
          bgColor: theme.colors.almostPrimaryGreen,
          textColor: theme.colors.primaryColor,
        };
  };
  return (
    <Box
      width={"100%"}
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      paddingHorizontal="s"
      paddingVertical="s"
    >
      <Box width="10%">
        <CustomText>ase1</CustomText>
      </Box>
      <Box width="40%">
        <CustomText>N10,000</CustomText>
      </Box>
      <Box width="30%">
        <CustomText>Flutterwave</CustomText>
      </Box>
      <Box
        width="20%"
        style={{ backgroundColor: statusColor("").bgColor }}
        borderRadius={20}
        paddingVertical="s"
        paddingHorizontal="s"
      >
        <CustomText
          style={{ color: statusColor("").textColor }}
          textAlign="center"
        >
          Pending
        </CustomText>
      </Box>
    </Box>
  );
}
