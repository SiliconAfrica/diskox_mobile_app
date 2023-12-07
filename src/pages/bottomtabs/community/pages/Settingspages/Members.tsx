import { View, Text, TextInput, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import Box from "../../../../../components/general/Box";
import CustomText from "../../../../../components/general/CustomText";
import { Theme } from "../../../../../theme";
import { useTheme } from "@shopify/restyle";
import { Feather, Ionicons } from "@expo/vector-icons";
import FadedButton from "../../../../../components/general/FadedButton";
import CustomButton from "../../../../../components/general/CustomButton";
import { ScrollView } from "react-native-gesture-handler";
import SettingsHeader from "../../../../../components/settings/Header";
import { useNavigation } from "@react-navigation/native";
import { PageType } from "../../../../login";
import { useQuery } from "react-query";
import { useCommunityDetailsState } from "../../states/Settings.state";
import httpService from "../../../../../utils/httpService";
import { URLS } from "../../../../../services/urls";
import { FlashList } from "@shopify/flash-list";

const testArray = [2, 2, 3, 4, 5, 6, 7, 7, 6, 5, 4, 3];

const MemberCard = () => {
  const theme = useTheme<Theme>();
  return (
    <Box
      width="100%"
      height={60}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box flexDirection="row" alignItems="center">
        <Box
          width={30}
          height={30}
          borderRadius={15}
          backgroundColor="fadedButtonBgColor"
        />
        <CustomText variant="body" marginLeft="s">
          Nkem owo
        </CustomText>
      </Box>

      <Box flexDirection="row" alignItems="center">
        <CustomButton
          title="View Profile"
          color={theme.colors.secondaryBackGroundColor}
          textColor={theme.colors.black}
          onPress={() => {}}
          height={30}
          width={100}
        />
        <Box width={10} />
        <CustomButton
          title="Delete"
          onPress={() => {}}
          height={30}
          color="red"
          width={60}
        />
      </Box>
    </Box>
  );
};

const Members = () => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<PageType>();
  const { username } = useCommunityDetailsState((state) => state);
  const [members, setMembers] = useState([]);

  const { isError, isLoading } = useQuery(
    ["getCommunityMembers", username],
    () => httpService.get(`${URLS.GET_COMMUNITY_MEMBERS}/${username}`),
    {
      onSuccess: (data) => {
        if (data.data.code === 1 && members.length < 1) {
          setMembers(data.data.data.data);
        } else {
          setMembers((prev) => [...prev, ...data?.data?.data?.data]);
        }
      },
    }
  );

  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <SettingsHeader
        showSave
        title="Members"
        handleArrowPressed={() => navigation.goBack()}
      />
      <Box flex={1} padding="m">
        <CustomText variant="subheader" fontSize={14}>
          200 members
        </CustomText>

        {/* SEARCH BOX */}

        <Box width="100%" marginTop="m">
          <Box
            width={"100%"}
            height={45}
            borderRadius={25}
            backgroundColor="secondaryBackGroundColor"
            flexDirection="row"
            alignItems="center"
            paddingHorizontal="m"
          >
            <Feather name="search" size={25} color={theme.colors.textColor} />
            <TextInput
              style={{
                flex: 1,
                color: theme.colors.textColor,
                fontFamily: "RedRegular",
                paddingLeft: 10,
              }}
              placeholder="Search for a member"
              placeholderTextColor={theme.colors.textColor}
            />
          </Box>
        </Box>

        <Box flex={1}>
          {/* <ScrollView>
            {testArray.map((item, inex) => (
              <MemberCard key={inex.toString()} />
            ))}
                  </ScrollView> */}
          <FlashList
            ListEmptyComponent={() => (
              <>
                {!isLoading && (
                  <Box
                    width="100%"
                    height={40}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <CustomText>No members</CustomText>
                  </Box>
                )}
              </>
            )}
            ListFooterComponent={() => (
              <>
                {isLoading && (
                  <Box>
                    <ActivityIndicator
                      size="large"
                      color={theme.colors.primaryColor}
                    />
                  </Box>
                )}
              </>
            )}
            data={[]}
            estimatedItemSize={10}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={({ item, index }) => (
              <MemberCard key={index.toString()} />
            )}
            // renderItem={({ item }) => <MemberCard {...item} />}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Members;
