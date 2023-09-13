import { View, Text, Pressable } from "react-native";
import React from "react";
import Box from "../general/Box";
import CustomText from "../general/CustomText";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { useModalState } from "../../states/modalState";
import { POST_FILTERR } from "../../enums/Postfilters";

const FilterTopbar = () => {
  const theme = useTheme<Theme>();
  const { setAll, filterBy } = useModalState((state) => state);

  return (
    <Box
      borderBottomWidth={1}
      borderBottomColor="secondaryBackGroundColor"
      height={80}
      borderTopWidth={1}
      borderTopColor="secondaryBackGroundColor"
      backgroundColor="secondaryBackGroundColor"
      width="100%"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal="m"
      marginVertical="s"
    >
      <Pressable
        onPress={() => setAll({ showFilter: true })}
        style={{
          height: 40,
          width: "35%",
          borderRadius: 30,
          backgroundColor: "#F7FCF9",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {filterBy !== POST_FILTERR.ALL &&
          filterBy !== POST_FILTERR.TOP_STORIES && (
            <CustomText variant="body" color="primaryColor" fontSize={17}>
              {filterBy}
            </CustomText>
          )}
        {filterBy === POST_FILTERR.ALL && (
          <CustomText variant="body" color="primaryColor" fontSize={17}>
            SortBy
          </CustomText>
        )}
        <Ionicons
          name="chevron-down-outline"
          size={15}
          color={theme.colors.primaryColor}
          style={{ marginLeft: 6, marginTop: 3 }}
        />
      </Pressable>

      <Pressable
        onPress={() => setAll({ filterBy: POST_FILTERR.ALL })}
        style={{
          height: 40,
          borderRadius: 30,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="flash-outline"
          size={25}
          color={
            filterBy === POST_FILTERR.ALL
              ? theme.colors.primaryColor
              : theme.colors.textColor
          }
          style={{ marginRight: 4 }}
        />
        <CustomText
          variant="body"
          color={filterBy === POST_FILTERR.ALL ? "primaryColor" : "textColor"}
        >
          New
        </CustomText>
      </Pressable>

      <Pressable
        onPress={() => setAll({ filterBy: POST_FILTERR.TOP_STORIES })}
        style={{
          height: 40,
          borderRadius: 30,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="arrow-up-outline"
          size={25}
          color={
            filterBy === POST_FILTERR.TOP_STORIES
              ? theme.colors.primaryColor
              : theme.colors.textColor
          }
          style={{ marginRight: 4 }}
        />
        <CustomText
          variant="body"
          color={
            filterBy === POST_FILTERR.TOP_STORIES ? "primaryColor" : "textColor"
          }
        >
          Top Stories
        </CustomText>
      </Pressable>
    </Box>
  );
};

export default FilterTopbar;
