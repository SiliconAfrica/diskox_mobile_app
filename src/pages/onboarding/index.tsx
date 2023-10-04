import { View, Text, Pressable } from "react-native";
import React from "react";
import Box from "../../components/general/Box";
import { Image } from "expo-image";
import CustomText from "../../components/general/CustomText";
import { useUtilState } from "../../states/util";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { useModalState } from "../../states/modalState";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/MainNavigation";

const Onboarding = ({
  route,
}: NativeStackScreenProps<RootStackParamList, "onboarding">) => {
  const [isDarkMode] = useUtilState((state) => [state.isDarkMode]);
  const [setAll] = useModalState((state) => [state.setAll]);
  const { showModal, addAccount } = route.params;
  const theme = useTheme<Theme>();

  React.useEffect(() => {
    if (showModal === 1) {
      setAll({ showLogin: true, addAccount: addAccount || false });
    }
    if (showModal === 2) {
      setAll({ showSignup: true, addAccount: addAccount || false });
    }
  }, [showModal]);
  return (
    <Box
      backgroundColor="mainBackGroundColor"
      flex={1}
      paddingHorizontal="m"
      paddingTop="xl"
      paddingBottom="l"
    >
      <Box
        width="100%"
        height="40%"
        alignItems="center"
        justifyContent="center"
      >
        <Image
          transition={1000}
          source={
            isDarkMode
              ? require("../../../assets/images/logo.png")
              : require("../../../assets/images/logoB.png")
          }
          contentFit="contain"
          style={{ width: 120, height: 120 }}
        />
        <CustomText variant="header" textAlign="center">
          Join The Conversation With Millions Of People
        </CustomText>

        <CustomText variant="body" textAlign="center" marginTop="m">
          The best place to connect, interact and grow with people around the
          world
        </CustomText>
      </Box>

      <Box width="100%" height="40%" alignItems="center" paddingTop="xl">
        <Pressable
          style={{
            borderWidth: 1,
            borderColor: theme.colors.primaryColor,
            borderRadius: 50,
            height: 45,
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: 20,
          }}
        >
          <Box flex={0.3}>
            <Image
              source={require("../../../assets/images/googlelogo.png")}
              contentFit="contain"
              style={{ width: 30, height: 30 }}
            />
          </Box>
          <Box flex={0.7}>
            <CustomText variant="header" style={{ fontSize: 18 }}>
              Continue with Google
            </CustomText>
          </Box>
        </Pressable>

        <Pressable
          onPress={() =>
            setAll({
              showSignup: true,
              addAccount: addAccount || false,
            })
          }
          style={{
            backgroundColor: theme.colors.primaryColor,
            borderRadius: 50,
            height: 45,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <CustomText color="white">Signup</CustomText>
        </Pressable>

        <Pressable
          onPress={() =>
            setAll({
              showLogin: true,
              addAccount: addAccount || false,
            })
          }
          style={{
            backgroundColor: "#34a85350",
            borderRadius: 50,
            height: 40,
            width: "30%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <CustomText
            variant="header"
            style={{ fontSize: 18 }}
            color="primaryColor"
          >
            Login
          </CustomText>
        </Pressable>
      </Box>

      <Box width="100%" height="15%" justifyContent="center">
        <CustomText variant="xs" textAlign="center">
          By continuing, you agree to Diskos{" "}
          <CustomText variant="xs" color="textBlue">
            User Agreement
          </CustomText>{" "}
          and acknowledge that you’ve read our{" "}
          <CustomText variant="xs" color="textBlue">
            Privacy Policy
          </CustomText>
          .
        </CustomText>
      </Box>
    </Box>
  );
};

export default Onboarding;
