import { ActivityIndicator, FlatList, ScrollView } from "react-native";
import Box from "../../../../components/general/Box";
import { Entypo, Feather, AntDesign } from "@expo/vector-icons";
import CustomText from "../../../../components/general/CustomText";
import SettingsHeader from "../../../../components/settings/Header";
import { useNavigation } from "@react-navigation/native";
import { PageType } from "../../../login";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../../../theme";
import _ from "lodash";
import useToast from "../../../../hooks/useToast";
import { useModalState } from "../../../../states/modalState";
import { Image } from "expo-image";
import httpService from "../../../../utils/httpService";
import { useQuery } from "react-query";
import { URLS } from "../../../../services/urls";
import { useEffect, useState } from "react";
import { CUSTOM_STATUS_CODE } from "../../../../enums/CustomCodes";
import WithdrawalTab from "./withdrawalTab";

interface IBank {
  id: number;
  bank_name: string;
  account_name: string;
  account_number: string;
}
export interface IWithdrawal {
  id: number;
  amount: number;
  paymentType: string;
  status: string;
}
export default function ReferralWithdrawalHistory() {
  const navigation = useNavigation<PageType>();
  const theme = useTheme<Theme>();
  const [bank, setBank] = useState<IBank>();
  const [page, setPage] = useState(1);
  const [fetchMore, setFetchMore] = useState(false);
  const [withdrawals, setWithdrawals] = useState<IWithdrawal[]>();
  const { setAll } = useModalState();
  const toast = useToast();

  const { isLoading, refetch } = useQuery(
    ["fetch_payment_account"],
    () => httpService.get(`${URLS.BANK_ACCOUNT}`),
    {
      onSuccess: (data) => {
        if (data.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
          setBank({ ...data.data.data });
        } else {
          toast.show("An error occurred", { type: "danger" });
        }
      },
      onError: (error: any) => {
        toast.show(error.message, { type: "danger" });
      },
    }
  );
  const {
    isLoading: isLoadingWithdrawals,
    refetch: refetchWithdrawals,
    isFetching: isFetchingWithdrawals,
  } = useQuery(
    ["fetch_user_withdrawals"],
    () => httpService.get(`${URLS.FETCH_USER_WITHDRAWAL}?page=${page}`),
    {
      onSuccess: (data) => {
        if (data.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
          if (withdrawals.length > 0) {
            const uniqArr = _.uniqBy<IWithdrawal>(
              [...withdrawals, ...data?.data?.data?.data],
              "id"
            );
            setWithdrawals([...uniqArr]);
          } else {
            setWithdrawals([...data.data.data?.data]);
          }
        }
      },
      onError: (error: any) => {
        toast.show(error.message, { type: "danger" });
      },
    }
  );

  const addPayment = () => {
    setAll({ showPaymentAccountModal: true });
  };

  useEffect(() => {
    if (fetchMore) {
      refetchWithdrawals();
    }
  }, [fetchMore]);

  const getNextPayout = () => {
    const date = new Date();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const nextMonth =
      date.getMonth() < 11 ? months[date.getMonth() + 1] : months[0];
    const nextYear =
      date.getMonth() < 11 ? date.getFullYear() : date.getFullYear() + 1;
    return `${nextMonth} 21, ${nextYear}`;
  };
  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <SettingsHeader
        showSave={false}
        title="Withdrawals"
        handleArrowPressed={() => navigation.goBack()}
      />
      <CustomText color="black" paddingTop="m" paddingHorizontal="s">
        <Feather
          name="info"
          size={theme.textVariants.body.fontSize}
          color={theme.colors.black}
        />{" "}
        The next payout date is {getNextPayout()}
      </CustomText>
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
        justifyContent="center"
        paddingBottom="m"
        paddingHorizontal="s"
        alignItems="center"
        width={"100%"}
      >
        <CustomText
          color="primaryColor"
          onPress={addPayment}
          textAlign="center"
          style={{ width: "100%" }}
        >
          <AntDesign
            name="plus"
            size={theme.textVariants.body.fontSize}
            color={theme.colors.primaryColor}
          />
          {bank ? "Update Payment Account" : "Add Payment Account"}
        </CustomText>
      </Box>
      <Box backgroundColor="white">
        <Box
          flexDirection="row"
          backgroundColor="almostPrimaryGreen"
          justifyContent="center"
          paddingVertical="s"
          paddingHorizontal="s"
          alignItems="center"
          borderRadius={20}
          width={"60%"}
          alignSelf="center"
        >
          <CustomText
            color="primaryColor"
            onPress={addPayment}
            textAlign="center"
          >
            Withdrawals
          </CustomText>
        </Box>
      </Box>

      <FlatList
        data={withdrawals ? withdrawals : []}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => <WithdrawalTab withdrawal={item} />}
        ListHeaderComponent={
          withdrawals && (
            <Box
              width={"100%"}
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              paddingHorizontal="s"
              paddingVertical="s"
              marginTop="m"
            >
              <Box width="10%">
                <CustomText color="grey">ID</CustomText>
              </Box>
              <Box width="40%">
                <CustomText color="grey">Amount</CustomText>
              </Box>
              <Box width="30%">
                <CustomText color="grey">Method</CustomText>
              </Box>
              <Box
                width="20%"
                borderRadius={20}
                paddingVertical="s"
                paddingHorizontal="s"
              >
                <CustomText textAlign="center" color="grey">
                  Status
                </CustomText>
              </Box>
            </Box>
          )
        }
        ListFooterComponent={
          (isLoadingWithdrawals || isFetchingWithdrawals) && (
            <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
          )
        }
        ListEmptyComponent={() =>
          !isLoading &&
          !isFetchingWithdrawals && (
            <Box
              flex={1}
              justifyContent="center"
              alignItems="center"
              width={"100%"}
              height={400}
            >
              <CustomText textAlign="center" variant="header">
                No withdrawals yet
              </CustomText>
            </Box>
          )
        }
        onEndReached={() => {
          if (!isFetchingWithdrawals && !isLoadingWithdrawals) {
            setPage((prev) => prev + 1);
            setFetchMore(true);
          }
        }}
        onEndReachedThreshold={1}
      />
    </Box>
  );
}
