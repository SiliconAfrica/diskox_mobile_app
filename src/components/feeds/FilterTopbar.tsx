import { View, Text, Pressable } from "react-native";
import React from "react";
import Box from "../general/Box";
import CustomText from "../general/CustomText";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { useModalState } from "../../states/modalState";
import { POST_FILTERR } from "../../enums/Postfilters";
import { useUtilState } from "../../states/util";
import { Image } from "expo-image";

export enum FILTER_BAR_ENUM {
  NEW = 'NEW',
  FOLLOWING = 'FOLLOWING',
  TRENDING = 'TRENDING'
}

const FilterTopbar = ({
  activeTab,
  onActive
}: {
  activeTab?: FILTER_BAR_ENUM,
  onActive?: (data: FILTER_BAR_ENUM) => void
}) => {
  const theme = useTheme<Theme>();
  const { setAll, filterBy } = useModalState((state) => state);
  const { isDarkMode, isLoggedIn } = useUtilState((state) => state)

  return (
    <Box
      borderBottomWidth={0.3}
      borderBottomColor={isDarkMode ? 'secondaryBackGroundColor':"lightGrey"}
      height={60}
      borderTopWidth={0.3}
      borderTopColor={isDarkMode ? 'secondaryBackGroundColor':"lightGrey"}
      backgroundColor={ isDarkMode ? "secondaryBackGroundColor":'mainBackGroundColor'}
      width="100%"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal="m"
     
    >
        

      <Pressable
        onPress={() => onActive(FILTER_BAR_ENUM.NEW)}
        style={{
          flex: 1,
          height: 40,
          borderRadius: 30,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 10,
          backgroundColor: activeTab === FILTER_BAR_ENUM.NEW ? isDarkMode ? theme.colors.mainBackGroundColor:theme.colors.fadedButtonBgColor : 'transparent'
        }}
      >
        <Ionicons
          name="flash-outline"
          size={20}
          color={
            activeTab === FILTER_BAR_ENUM.NEW
              ? isDarkMode ? 'white': theme.colors.primaryColor
              : theme.colors.lightGrey
          }
          style={{ marginRight: 4 }}
        />
        <CustomText
          variant="subheader"
          fontSize={14}
          style={{
            color: activeTab === FILTER_BAR_ENUM.NEW ? isDarkMode ? "white": theme.colors.primaryColor : theme.colors.lightGrey,
          }}
        >
          New
        </CustomText>
      </Pressable>

      <Pressable
        onPress={() => onActive(FILTER_BAR_ENUM.TRENDING)}
        style={{
          flex: 1,
          height: 40,
          borderRadius: 30,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 10,
          backgroundColor: activeTab === FILTER_BAR_ENUM.TRENDING ? isDarkMode ? theme.colors.mainBackGroundColor:theme.colors.fadedButtonBgColor : 'transparent'
        }}
      >
        <Ionicons size={20} name='trending-up' color={activeTab === FILTER_BAR_ENUM.TRENDING ? isDarkMode ? 'white': theme.colors.primaryColor : theme.colors.lightGrey} style={{ marginRight: 4 }} />
        <CustomText
          variant="subheader"
          fontSize={14}
          style={{
            color: activeTab === FILTER_BAR_ENUM.TRENDING ? isDarkMode ? "white": theme.colors.primaryColor : theme.colors.lightGrey,
          }}
        >
          Trending
        </CustomText>
      </Pressable>

      { isLoggedIn && (
          <Pressable
          onPress={() => onActive(FILTER_BAR_ENUM.FOLLOWING)}
          style={{
            flex: 1,
            height: 40,
            borderRadius: 30,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
            backgroundColor: activeTab === FILTER_BAR_ENUM.FOLLOWING ? isDarkMode ? theme.colors.mainBackGroundColor:theme.colors.fadedButtonBgColor : 'transparent'
          }}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color={
              activeTab === FILTER_BAR_ENUM.FOLLOWING
                ? isDarkMode ? 'white': theme.colors.primaryColor
                : theme.colors.lightGrey
            }
            style={{ marginRight: 4 }}
          />
          <CustomText
            variant="subheader"
            fontSize={14}
            style={{
              color: activeTab === FILTER_BAR_ENUM.FOLLOWING ? isDarkMode ? "white": theme.colors.primaryColor : theme.colors.lightGrey,
            }}
          >
            Following
          </CustomText>
        </Pressable>
      )}

    
    </Box>
  );
};

export default FilterTopbar;
