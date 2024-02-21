import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import Box from "../../components/general/Box";
import SettingsHeader from "../../components/settings/Header";
import CustomText from "../../components/general/CustomText";
import PrimaryButton from "../../components/general/PrimaryButton";
import { useDetailsState } from "../../states/userState";
import httpService from "../../utils/httpService";
import { URLS } from "../../services/urls";
import { useMutation, useQuery } from "react-query";
import { IInterest } from "../../models/Interests";
import useToast from "../../hooks/useToast";
import { CUSTOM_STATUS_CODE } from "../../enums/CustomCodes";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import InterestChip from "../../components/interest/InterestChip";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PageType } from "../login";
import { RootStackParamList } from "../../navigation/MainNavigation";
import { ScrollView } from "react-native-gesture-handler";
import { da } from "date-fns/locale";

const Interests = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "categories">) => {
  // states
  const [interests, setInterests] = React.useState<IInterest[]>([]);
  const [selectedInterests, setSelectedInterests] = React.useState<number[]>(
    []
  );
  // utils
  const { username } = useDetailsState((state) => state);
  const toast = useToast();
  const theme = useTheme<Theme>();
  const shouldSelectCommunitiesNext =
    route?.params?.shouldSelectCommunitiesNext;
  // get user interests
  const { isLoading, isError } = useQuery(
    ["getUserInterests", username],
    () => httpService.get(`${URLS.GET_USER_BY_USERNAME}/${username}`),
    {
      onSuccess: (data) => {
        if (data?.data?.code === CUSTOM_STATUS_CODE.INTERNAL_SERVER_ERROR) {
          toast.show(
            data?.data?.message ||
              "An error occured while getting your interests",
            { type: "error" }
          );
        }
        if (data?.data?.code === CUSTOM_STATUS_CODE.SUCCESS) {
          const interets: IInterest[] = data?.data?.data?.interests;
          const ids = interets.map((item) => {
            return item.id;
          });
          setSelectedInterests(ids);
        }
      },
      onError: (error: any) => {
        toast.show(error.message, { type: "error" });
      },
    }
  );

  const getInterests = useQuery(
    ["getInterests"],
    () => httpService.get(`${URLS.GET_CATEGORIES}`),
    {
      onSuccess: (data) => {
        if (data?.data?.code === CUSTOM_STATUS_CODE.INTERNAL_SERVER_ERROR) {
          toast.show(
            data?.data?.message || "An error occured while getting interests",
            { type: "error" }
          );
        }
        if (data?.data?.code === CUSTOM_STATUS_CODE.SUCCESS) {
          setInterests(data?.data?.data as IInterest[]);
        }
      },
      onError: (error: any) => {
        toast.show(error.message, { type: "error" });
      },
    }
  );

  // mutations
  const updateInterestMutation = useMutation({
    mutationFn: (data: FormData) =>
      httpService.post(`${URLS.UPDATE_INTEREST}`, data),
    onSuccess: (data) => {
      if (data?.data?.code === CUSTOM_STATUS_CODE.INTERNAL_SERVER_ERROR) {
        toast.show(
          data?.data?.message || "An error occured while getting interests",
          { type: "error" }
        );
      } else {
        toast.show("Successful", { type: "success" });
        if (shouldSelectCommunitiesNext) {
          navigation.navigate("select-communities");
        } else {
          navigation.navigate("home");
        }
      }
    },
    onError: (error: any) => {
      toast.show(error.message, { type: "error" });
    },
  });

  // fucntions
  const handleSelect = React.useCallback(
    (id: number) => {
      if (selectedInterests.includes(id)) {
        setSelectedInterests((prev) => prev.filter((item) => item !== id));
      } else {
        if (selectedInterests.length < 5) {
          setSelectedInterests((prev) => [...prev, id]);
        }
      }
    },
    [selectedInterests]
  );

  const handleSubmit = React.useCallback(async () => {
    if (selectedInterests.length < 3) {
      toast.show("You must select at least 3 categories", {
        type: "warning",
        animationType: "zoom-in",
        placement: "top",
      });
      return;
    }
    const formData = new FormData();
    selectedInterests.forEach((item) => {
      formData.append("interests[]", item.toString());
    });
    updateInterestMutation.mutate(formData);
  }, [selectedInterests]);
  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <SettingsHeader
        title="Select Interests"
        showSave={false}
        handleArrowPressed={() => navigation.goBack()}
      />
      <Box width={"100%"} padding="m">
        <CustomText variant="subheader" textAlign="center">
          What topics are you most interested in?
        </CustomText>
        <CustomText variant="body" marginVertical="s" textAlign="center">
          Select 3 or more to continue. We’ll use this to show posts or
          recommend communities you may like.
        </CustomText>
      </Box>
      <Box flex={1} backgroundColor="white">
        {getInterests.isError ||
          (isError && (
            <Box
              justifyContent="center"
              alignItems="center"
              width="100%"
              height="110%"
            >
              <CustomText>
                {" "}
                An error occured while fetching categories
              </CustomText>
            </Box>
          ))}
        {getInterests.isLoading ||
          (isLoading && (
            <Box justifyContent="center" alignItems="center" width="100%">
              <CustomText>Fetching catergory list</CustomText>
              <ActivityIndicator
                size="large"
                color={theme.colors.primaryColor}
              />
            </Box>
          ))}
        {!getInterests.isLoading &&
          !getInterests.isError &&
          interests.length > 0 && (
            <ScrollView
              contentContainerStyle={{
                flexDirection: "row",
                flexWrap: "wrap",
                paddingTop: 20,
              }}
            >
              {interests.map((item, index) => (
                <InterestChip
                  key={index.toString()}
                  data={item}
                  isSelected={selectedInterests.includes(item.id)}
                  onPress={(id) => handleSelect(id)}
                />
              ))}
            </ScrollView>
          )}

        {!getInterests.isLoading && interests.length < 1 && (
          <Box width="100%" alignItems="center" justifyContent="center">
            <CustomText>No Category to select</CustomText>
          </Box>
        )}
      </Box>
      <Box
        width="100%"
        height={120}
        justifyContent="center"
        alignItems="center"
      >
        <PrimaryButton
          width="90%"
          title="Save"
          onPress={handleSubmit}
          isLoading={updateInterestMutation.isLoading}
        />
      </Box>
    </Box>
  );
};

export default Interests;
