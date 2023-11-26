import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Box from "../../../../components/general/Box";
import CustomText from "../../../../components/general/CustomText";
import FadedButton from "../../../../components/general/FadedButton";
import { ScrollView } from "react-native-gesture-handler";
import CommunityListCard from "../../../../components/community/CommunityListCard";
import { useQueries, useQuery } from "react-query";
import httpService from "../../../../utils/httpService";
import { URLS } from "../../../../services/urls";
import { FlashList } from "@shopify/flash-list";
import { ICommunity } from "../../../../models/Community";
import { Theme } from "../../../../theme";
import { useTheme } from "@shopify/restyle";
import ReactNavtieModalWrapper from "../../../../components/ReactNavtieModalWrapper";
import CreateCommunityModal from "../../../../components/modals/CreateCommunityModal";
import { useDetailsState } from "../../../../states/userState";
import useToast from "../../../../hooks/useToast";
import { handlePromise } from "../../../../utils/handlePomise";

const CommunityList = () => {
  const theme = useTheme<Theme>();
  const toast = useToast();
  const [showModal, setShowModal] = React.useState(false);
  const { community_privilege, id, setAll } = useDetailsState((state) => state);
  const { isLoading, isError, data } = useQuery(["getCommunities"], () =>
    httpService.get(`${URLS.GET_COMMUNITIES}`)
  );

  const getUserDetails = useQuery(
    ["getDetails", id],
    () => httpService.get(`${URLS.GET_USER_BY_ID}/${id}`),
    {
      onError: () => {},
      onSuccess: async (data) => {
        setAll(data?.data?.data);
        const [saveUser, saveUserErr] = await handlePromise(
          AsyncStorage.setItem(`user`, JSON.stringify(data.data.data))
        );
      },
    }
  );

  const deny_modal = () => {
    getUserDetails.refetch();
    toast.show(
      "Sorry, you cannot create communities at this time as you have not met the needed criteria.",
      { type: "danger" }
    );
  };
  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      {/* MODALS */}
      <CreateCommunityModal
        isVisisble={showModal}
        onClose={() => setShowModal((prev) => !prev)}
      />

      {/* HEADER */}
      <Box
        width="100%"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="s"
        marginTop="m"
        paddingBottom="m"
      >
        <CustomText variant="header" fontSize={15}>
          Explore Popular communities
        </CustomText>
        <FadedButton
          title="Create community"
          width={150}
          height={40}
          onPress={
            community_privilege === 0 ? deny_modal : () => setShowModal(true)
          }
        />
      </Box>

      <FlashList
        estimatedItemSize={20}
        ListFooterComponent={() => (
          <>
            {isLoading && (
              <Box width="100%" alignItems="center" justifyContent="center">
                <ActivityIndicator
                  size="large"
                  color={theme.colors.primaryColor}
                />
              </Box>
            )}
          </>
        )}
        data={data?.data.data?.data as ICommunity[]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <CommunityListCard {...item} />}
      />
    </Box>
  );
};

export default CommunityList;
