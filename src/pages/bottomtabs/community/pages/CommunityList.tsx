import { View, Text, ActivityIndicator, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Box from "../../../../components/general/Box";
import CustomText from "../../../../components/general/CustomText";
import FadedButton from "../../../../components/general/FadedButton";
import { ScrollView } from "react-native-gesture-handler";
import CommunityListCard from "../../../../components/community/CommunityListCard";
import { useQueries, useQuery } from "react-query";
import httpService from "../../../../utils/httpService";
import { URLS } from "../../../../services/urls";
import { ICommunity } from "../../../../models/Community";
import { Theme } from "../../../../theme";
import _ from "lodash";
import { useTheme } from "@shopify/restyle";
import ReactNavtieModalWrapper from "../../../../components/ReactNavtieModalWrapper";
import CreateCommunityModal from "../../../../components/modals/CreateCommunityModal";
import { useDetailsState } from "../../../../states/userState";
import useToast from "../../../../hooks/useToast";
import { handlePromise } from "../../../../utils/handlePomise";
import CustomButton from "../../../../components/general/CustomButton";
import NormalButton from "../../../../components/general/NormalButton";
import { AntDesign } from "@expo/vector-icons";
import { ICountry } from "../../../../models/country";

const CommunityList = () => {
  const theme = useTheme<Theme>();
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<Partial<ICountry>>();
  const [pageForMyCommunities, setPageForMyCommunities] = useState(1);
  const [topCommunities, setTopCommunities] = useState<ICommunity[]>([]);
  const [pageForMyCommunitiesByCountries, setPageForMyCommunitiesByCountries] =
    useState(0);
  const { community_privilege, id, setAll } = useDetailsState((state) => state);
  const { isLoading, isError, isFetching, data } = useQuery(
    ["getCommunities", page],
    () => httpService.get(`${URLS.GET_COMMUNITIES}?page=${page}`),
    {
      onSuccess: (res) => {
        if (Array.isArray(res.data?.data?.data)) {
          if (topCommunities.length > 0) {
            const uniqArra = _.uniqBy<ICommunity>(
              [...topCommunities, ...res.data.data.data],
              "id"
            );
            setTopCommunities([...uniqArra]);
          } else {
            setTopCommunities([...res.data.data.data]);
          }
        }
      },
      keepPreviousData: true,
    }
  );

  const { data: myCommunities, isLoading: isLoadingMyCommunities } = useQuery(
    ["getMyCommunities", pageForMyCommunities],
    () =>
      httpService.get(
        `${URLS.GET_JOINED_COMMUNITIES}?page=${pageForMyCommunities}`
      ),
    {
      onSuccess: (res) => {
        console.log(res.data?.data, "hellllres.data?.data?.data");
      },
      keepPreviousData: true,
    }
  );

  const { data: communitiesCountry, isLoading: isLoadingCommunitiesCountry } =
    useQuery(
      ["communitiesCountry"],
      () => httpService.get(`${URLS.GET_COMMUNITY_COUNTRIES}`),
      {
        keepPreviousData: true,
      }
    );

  const {
    data: communitiesByCountry,
    isLoading: isLoadingCommunitiesByCountry,
    isFetching: isFetchingCommunitiesByCountry,
  } = useQuery(
    [
      `communitiesByCountry=${selectedCountry?.name}`,
      pageForMyCommunitiesByCountries,
    ],
    () =>
      httpService.get(
        `${URLS.GET_COMMUNITY_BY_COUNTRIES}/${selectedCountry?.name}?page=${pageForMyCommunities}`
      ),
    {
      keepPreviousData: pageForMyCommunities > 1 ? true : false,
    }
  );

  const getUserDetails = useQuery(
    ["getDetails", id],
    () => httpService.get(`${URLS.GET_USER_BY_ID}/${id}`),
    {
      keepPreviousData: true,
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
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
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
            Explore your communities
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

        {myCommunities?.data.data?.data.map((item) => (
          <CommunityListCard key={item.id} {...item} />
        ))}
        {isLoadingMyCommunities && (
          <ActivityIndicator
            size={30}
            color={theme.colors.primaryColor}
            style={{ paddingVertical: 10 }}
          />
        )}
        <Box
          flexDirection="row"
          alignItems="center"
          paddingHorizontal="s"
          justifyContent="space-between"
        >
          {!isLoadingMyCommunities &&
            myCommunities?.data?.data?.current_page > 1 && (
              <NormalButton
                label="Previous Page"
                width={
                  myCommunities?.data?.data?.next_page_url !== null
                    ? "45%"
                    : "100%"
                }
                action={() => setPageForMyCommunities((prev) => prev - 1)}
              />
            )}
          {!isLoadingMyCommunities &&
            myCommunities?.data?.data?.next_page_url !== null && (
              <NormalButton
                label="Next Page"
                width={
                  myCommunities?.data?.data?.current_page > 1 ? "45%" : "100%"
                }
                action={() => setPageForMyCommunities((prev) => prev + 1)}
              />
            )}
        </Box>

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
            Explore top communities
          </CustomText>
        </Box>

        {topCommunities.map((item) => {
          if (item.is_member === 0) {
            return <CommunityListCard key={item.id} {...item} />;
          }
        })}

        {!isLoading && data?.data?.data?.next_page_url !== null && (
          <NormalButton
            label="See more"
            action={() => setPage((prev) => prev + 1)}
          />
        )}
        {(isLoading || isFetching) && (
          <ActivityIndicator
            size={30}
            color={theme.colors.primaryColor}
            style={{ paddingVertical: 10 }}
          />
        )}

        <Box width="100%">
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
              Communities By Country
            </CustomText>
          </Box>
          {communitiesCountry?.data?.data &&
            communitiesCountry?.data?.data?.map((country: ICountry, i) => (
              <Box key={i}>
                <Pressable
                  onPress={() => {
                    if (selectedCountry?.id === country.id) {
                      setSelectedCountry({});
                    } else {
                      setSelectedCountry({ ...country });
                    }
                  }}
                >
                  <Box
                    justifyContent="space-between"
                    paddingVertical="m"
                    alignItems="center"
                    paddingHorizontal="m"
                    flexDirection="row"
                    width="100%"
                  >
                    <CustomText>{country.name}</CustomText>
                    {selectedCountry?.id === country.id ? (
                      <AntDesign
                        name="up"
                        size={16}
                        color={theme.colors.black}
                      />
                    ) : (
                      <AntDesign
                        name="down"
                        size={16}
                        color={theme.colors.black}
                      />
                    )}
                  </Box>
                </Pressable>
                {selectedCountry?.id === country.id && (
                  <Box>
                    {communitiesByCountry?.data?.data?.data.map((item) => {
                      if (item.is_member === 0) {
                        return <CommunityListCard key={item.id} {...item} />;
                      }
                    })}
                    {!isLoadingCommunitiesByCountry &&
                    !isFetchingCommunitiesByCountry &&
                    !communitiesByCountry?.data ? (
                      <CustomText paddingHorizontal="l">
                        No communities here yet
                      </CustomText>
                    ) : (
                      !isLoadingCommunitiesByCountry &&
                      communitiesByCountry?.data?.data?.next_page_url !==
                        null && (
                        <NormalButton
                          label="See More"
                          action={() =>
                            setPageForMyCommunitiesByCountries(
                              (prev) => prev + 1
                            )
                          }
                        />
                      )
                    )}
                    {(isLoadingCommunitiesByCountry ||
                      isFetchingCommunitiesByCountry) && (
                      <ActivityIndicator
                        size={30}
                        color={theme.colors.primaryColor}
                        style={{ paddingVertical: 10 }}
                      />
                    )}
                  </Box>
                )}
              </Box>
            ))}
        </Box>
      </ScrollView>
      {/* <FlashList
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
        onEndReached={() => {
          setShowOtherCommunities(true);
        }}
        data={data?.data.data?.data as ICommunity[]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <CommunityListCard {...item} />}
      /> */}
    </Box>
  );
};

export default CommunityList;
