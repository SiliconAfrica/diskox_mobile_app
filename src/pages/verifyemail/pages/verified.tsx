import { View, Text } from "react-native";
import React from "react";
import Box from "../../../components/general/Box";
import CustomText from "../../../components/general/CustomText";
import NormalButton from "../../../components/general/NormalButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/MainNavigation";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../../theme";
import { saveScreen } from "../../../utils/saveCurrentPosition";

const Verified = () => {
  const navigate = useNavigation<NavigationProp<RootStackParamList>>();
  const theme = useTheme<Theme>();
  return (
    <Box flex={1}>
      <Box flex={0.8} paddingTop="xl">
        <Box height={100} />
        <Box
          borderRadius={50}
          width={70}
          height={70}
          backgroundColor="fadedButtonBgColor"
          alignSelf="center"
          alignItems="center"
          justifyContent="center"
        >
          <AntDesign
            name="checkcircle"
            size={50}
            color={theme.colors.primaryColor}
          />
        </Box>
        <CustomText variant="header" textAlign="center" marginTop="xl">
          Verification Successful
        </CustomText>
        <CustomText variant="body" textAlign="center" marginTop="m">
          Congratulations! Your email has been verified successfully
        </CustomText>
      </Box>
      <Box flex={0.2}>
        <NormalButton
          label="Continue"
          action={async () => {
            await saveScreen("set-up");
            navigate.navigate("set-up");
          }}
        />
      </Box>
    </Box>
  );
};

export default Verified;
