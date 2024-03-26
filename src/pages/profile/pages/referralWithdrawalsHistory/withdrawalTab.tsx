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
    return status.toLowerCase() === "completed"
      ? {
          bgColor: theme.colors.almostPrimaryGreen,
          textColor: theme.colors.white,
        }
      : status.toLowerCase() === "failed"
      ? { bgColor: theme.colors.errorBg, textColor: theme.colors.white }
      : status.toLowerCase() === "pending"
      ? { bgColor: theme.colors.yellowGreen, textColor: theme.colors.white }
      : {
          bgColor: theme.colors.grey,
          textColor: theme.colors.black,
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
      <Box width="20%">
        <CustomText variant="xs">{withdrawal.transaction_id}</CustomText>
      </Box>
      <Box width="40%">
        <CustomText>&#8358;{withdrawal.amount.toLocaleString()}</CustomText>
      </Box>
      <Box width="20%">
        <CustomText variant="xs">{withdrawal.type}</CustomText>
      </Box>
      <Box
        width="20%"
        style={{ backgroundColor: statusColor(withdrawal.status).bgColor }}
        borderRadius={20}
        paddingVertical="s"
        paddingHorizontal="s"
      >
        <CustomText
          style={{ color: statusColor(withdrawal.status).textColor }}
          textAlign="center"
          variant="xs"
        >
          {withdrawal.status.toLowerCase()}
        </CustomText>
      </Box>
    </Box>
  );
}
