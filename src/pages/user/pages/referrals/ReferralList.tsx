import { useTheme } from "@shopify/restyle";
import { useQuery } from "react-query";
import Box from "../../../../components/general/Box";
import CustomText from "../../../../components/general/CustomText";
import { Theme } from "../../../../theme";
import { ScrollView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import httpService from "../../../../utils/httpService";
import { URLS } from "../../../../services/urls";
import { IUser } from "../../../../models/user";

export default function ReferralList() {
  const theme = useTheme<Theme>();
  const [tableData, setTableData] = useState<IUser[]>([]);

  const { isLoading, refetch } = useQuery(
    ["all_referrals"],
    () => httpService.get(`${URLS.GET_REFERRALS}`),
    {
      onSuccess: (data) => {
        if (
          data.data.code === 1 &&
          data.data.data &&
          Array.isArray(data.data.data)
        ) {
          setTableData([...data.data.data]);
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
      flex={1}
      borderRadius={10}
      px="s"
      py="s"
      mx="s"
      my="s"
    >
      <CustomText variant="subheader" color="black">
        People you've invited
      </CustomText>
      <Box borderBottomWidth={1} borderBottomColor="primaryColor" mt="s">
        <CustomText variant="body" color="primaryColor">
          Total Referrals
        </CustomText>
      </Box>
      {tableData.length === 0 ? (
        <Box width="100%" px="s" py="xl" my="l">
          <CustomText textAlign="center">
            Refer your friends to Diskox and gain points
          </CustomText>
        </Box>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Box>
            <Box flexDirection="row">
              <Box width={80} padding={"s"}>
                <CustomText variant="body" fontFamily="RedBold" color="black">
                  S/N
                </CustomText>
              </Box>
              <Box width={180} padding={"s"}>
                <CustomText variant="body" fontFamily="RedBold" color="black">
                  Username
                </CustomText>
              </Box>
            </Box>
            {tableData.map((item, index) => (
              <Box key={index} flexDirection="row">
                <Box width={80} padding={"s"}>
                  <CustomText variant="body">{index + 1}</CustomText>
                </Box>
                <Box width={180} padding={"s"}>
                  <CustomText variant="body" color="primaryColor">
                    {item.username}
                  </CustomText>
                </Box>
              </Box>
            ))}
          </Box>
        </ScrollView>
      )}
    </Box>
  );
}
