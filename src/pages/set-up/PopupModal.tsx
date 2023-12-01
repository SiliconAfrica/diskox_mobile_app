import { View, Text, Modal, ActivityIndicator } from "react-native";
import React from "react";
import Box from "../../components/general/Box";
import { Image } from "expo-image";
import CustomText from "../../components/general/CustomText";
import NormalButton from "../../components/general/NormalButton";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/MainNavigation";

const PopupModal = ({
  visible = false,
  setVisible,
}: {
  visible: boolean;
  setVisible: any;
}) => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <Modal
      style={{ flex: 1 }}
      visible={visible}
      onDismiss={() => {}}
      animationType="slide"
    >
      <Box flex={1} backgroundColor="mainBackGroundColor">
        <View
          style={{
            width: "100%",
            height: "50%",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
        >
          <Image
            source={require("../../../assets/images/personcircle.png")}
            style={{ width: 120, height: 120, borderRadius: 60 }}
            contentFit="contain"
          />
          <CustomText variant="subheader" textAlign="center">
            Your profile is 50% complete
          </CustomText>
          <CustomText variant="body" textAlign="center" mt="m">
            Click on continue to finish setting up your profile
          </CustomText>
        </View>

        <View
          style={{
            height: "40%",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingHorizontal: 20,
          }}
        >
          {/* <ActivityIndicator color={theme.colors.primaryColor} size='large' /> */}
          <CustomText
            variant="body"
            textAlign="center"
            mt="m"
            onPress={() => navigation.navigate("home")}
          >
            I'll do this later
          </CustomText>
          <NormalButton
            action={() => {
              setVisible(false);
              navigation.navigate("categories");
            }}
            label="Continue"
          />
        </View>
      </Box>
    </Modal>
  );
};

export default PopupModal;
