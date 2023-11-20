import { useQuery } from "react-query";
import Box from "../../../../components/general/Box";
import CustomText from "../../../../components/general/CustomText";
import httpService from "../../../../utils/httpService";
import { URLS } from "../../../../services/urls";
import { useState } from "react";

export default function TotalWithdrawals() {
  const [total, setTotal] = useState<number>(0);
  const { isLoading } = useQuery(
    ["withdrawals_count"],
    () => httpService.get(`${URLS.FETCH_REF_POINTS}`),
    {
      onSuccess: (data) => {
        if (data.data.code === 1) {
          setTotal(data.data.data.total_amount_withdrawn);
        }
      },
      onError: (error: any) => {
        alert(error.message);
      },
    }
  );
  return (
    <Box
      backgroundColor="white"
      borderRadius={10}
      px="s"
      py="s"
      mx="s"
      my="s"
      alignItems="center"
    >
      <Box
        backgroundColor="lightGrey"
        borderRadius={10}
        width={"100%"}
        px="l"
        py="xl"
        mx="s"
        my="s"
        alignItems="center"
      >
        <CustomText variant="subheader" color="grey">
          Withdrawn Points
        </CustomText>
        <CustomText variant="subheader" color="black">
          {total}
        </CustomText>
      </Box>
    </Box>
  );
}
