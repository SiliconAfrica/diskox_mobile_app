import { View, Text, TextInput } from "react-native";
import React from "react";
import Box from "../../../../../components/general/Box";
import CustomText from "../../../../../components/general/CustomText";
import { Theme } from "../../../../../theme";
import { useTheme } from "@shopify/restyle";
import { Feather, Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../../../../../components/general/PrimaryButton";
import SettingsHeader from "../../../../../components/settings/Header";
import { useNavigation } from "@react-navigation/native";
import { PageType } from "../../../../login";

const Blocked = () => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<PageType>();

  return (
    <Box flex={1}>
      <SettingsHeader title="Blocked" showSave handleArrowPressed={() => navigation.goBack()} />
      <Box flex={1} padding="m">

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

        <Box
          width="100%"
          height={350}
          justifyContent="center"
          alignItems="center"
        >
          <Ionicons name="cube" size={100} color={theme.colors.primaryColor} />
          <CustomText
            variant="subheader"
            fontSize={18}
            textAlign="center"
            marginTop="m"
          >
            You  have not blocked anyone in c/SkyHunters
          </CustomText>
          <Box height={20} />
        </Box>
      </Box>
    </Box>
  );
};

export default Blocked
