import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import Box from "../general/Box";
import CustomText from "../general/CustomText";
import { Feather } from "@expo/vector-icons";
import { useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import { useTheme } from "@shopify/restyle";
import theme, { Theme } from "../../theme";
import { ScrollView } from "react-native-gesture-handler";
import { RouteProp, useRoute } from "@react-navigation/native";
import { CommunityStackParamList } from "../../pages/bottomtabs/community";
import { useQuery } from "react-query";
import httpService from "../../utils/httpService";
import { URLS } from "../../services/urls";
import PrimaryButton from "../general/PrimaryButton";
import { IRule } from "../../models/Rules";
import { FlashList } from "@shopify/flash-list";

const Accordion = ({
  id,
  title,
  deleted_at,
  description,
  created_at,
}: IRule) => {
  const theme = useTheme<Theme>();
  const [show, setShow] = React.useState(false);
  return (
    <Box
      width="100%"
      justifyContent="center"
      paddingVertical="s"
      borderBottomColor="secondaryBackGroundColor"
      borderBottomWidth={2}
      paddingHorizontal="m"
    >
      <Box
        borderBottomColor="secondaryBackGroundColor"
        borderBottomWidth={show ? 2 : 0}
        paddingBottom="s"
        flexDirection="row"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box flexDirection="row" alignItems="center">
          <Box width={2} height={2} borderRadius={1} backgroundColor="black" />
          <CustomText variant="body" fontSize={16} marginLeft="m">
            {title}
          </CustomText>
        </Box>
        <Feather
          name={show ? "chevron-up" : "chevron-down"}
          size={25}
          color={theme.colors.textColor}
          onPress={() => setShow((prev) => !prev)}
        />
      </Box>
      {show && (
        <Box paddingVertical="s" maxHeight={150} overflow="hidden">
          <ScrollView>
            <CustomText>{description}</CustomText>
          </ScrollView>
        </Box>
      )}
    </Box>
  );
};

const Rules = () => {
  const [rules, setRules] = React.useState<IRule[]>([]);
  const [errorMessage, setErrorMessage] = React.useState("");

  const route = useRoute<RouteProp<CommunityStackParamList, "community">>();
  const { id } = route.params;
  const { isLoading, isError, refetch } = useQuery(
    ["getRules", id],
    () => httpService.get(`${URLS.GET_COMMUNITY_RULES}/${id}`),
    {
      onSuccess: (data) => {
        if (data.data?.code === 1) {
          setRules(data?.data?.data?.data);
        }
        if (data?.data?.code === 4) {
          setErrorMessage(data?.data?.message);
        }
      },
      onError: (error: any) => {
        setErrorMessage(error.message);
      },
    }
  );
  return (
    <Box flex={1} padding="m">
      <Box
        marginTop="l"
        width="100%"
        borderRadius={10}
        borderWidth={2}
        borderColor="secondaryBackGroundColor"
        paddingBottom="s"
      >
        <Box
          width="100%"
          padding="m"
          borderBottomWidth={!isError ? 2 : 0}
          borderBottomColor="secondaryBackGroundColor"
        >
          <CustomText variant="subheader" fontSize={18}>
            Our rules & regulations
          </CustomText>
        </Box>

        {isError && (
          <Box
            width="100%"
            height={100}
            justifyContent="center"
            alignItems="center"
          >
            <CustomText>{errorMessage}</CustomText>
            <Box height={20} />
            <PrimaryButton title="Refetch" onPress={() => refetch()} />
          </Box>
        )}

        {!isError && (
          <FlashList
            data={rules}
            renderItem={({ item }) => <Accordion {...item} />}
            keyExtractor={(item, i) => i.toString()}
            estimatedItemSize={20}
            ListEmptyComponent={() => (
              <>
                {!isLoading && (
                  <Box
                    width="100%"
                    height={100}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <CustomText>No Rule set</CustomText>
                  </Box>
                )}
              </>
            )}
            ListFooterComponent={() => (
              <>
                {isLoading && (
                  <Box
                    width="100%"
                    height={100}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <ActivityIndicator
                      size="large"
                      color={theme.colors.primaryColor}
                    />
                  </Box>
                )}
              </>
            )}
          />
        )}
      </Box>
    </Box>
  );
};

export default Rules;
