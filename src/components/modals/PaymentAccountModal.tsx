import { View, Text } from "react-native";
import React, { useEffect, useRef } from "react";
import ModalWrapper from "../ModalWrapper";
import Login, { PageType } from "../../pages/login";
import { useModalState } from "../../states/modalState";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Box from "../general/Box";
import CustomText from "../general/CustomText";
import PrimaryButton from "../general/PrimaryButton";
import { Image } from "expo-image";
import { useVerificationState } from "../../pages/verifyAccount/state";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/MainNavigation";

const PaymentAccountModal = () => {
  const [setAll] = useModalState((state) => [state.setAll]);
  const ref = useRef<BottomSheetModal>();
  const nav = useNavigation<PageType>();

  const handleClose = React.useCallback(() => {
    setAll({ showPaymentAccountModal: false });
  }, []);

  useEffect(() => {
    ref.current.present();
  }, []);

  const open_flutterwave = () => {
    handleClose();
    setAll({ showFlutterPaymentModal: true });
  };
  return (
    <ModalWrapper
      onClose={() => handleClose()}
      shouldScrroll
      snapPoints={["55%"]}
      ref={ref}
    >
      <Box
        flex={1}
        backgroundColor="mainBackGroundColor"
        paddingHorizontal="m"
        alignItems="center"
      >
        <CustomText
          variant="header"
          textAlign="center"
          fontSize={24}
          marginVertical="m"
        >
          Edit Payment Account
        </CustomText>
        <Box
          style={{ width: "100%" }}
          borderWidth={1}
          paddingHorizontal="s"
          marginTop="s"
          paddingVertical="m"
          borderRadius={10}
          borderColor="primaryColor"
        >
          <Image
            source={require("../../../assets/flutterwave.png")}
            style={{ width: 80, height: 12 }}
            contentFit="cover"
          />
          <CustomText color="black" marginVertical="s">
            Add a Fluterwave Payment Account
          </CustomText>
          <Box
            backgroundColor="lighterGrey"
            paddingHorizontal="m"
            paddingVertical="s"
            borderRadius={50}
            alignItems="center"
            width={"30%"}
          >
            <CustomText color="primaryColor">Available</CustomText>
          </Box>
        </Box>
        <Box
          style={{ width: "100%" }}
          borderWidth={1}
          paddingHorizontal="s"
          marginTop="s"
          paddingVertical="m"
          borderRadius={10}
          borderColor="grey"
        >
          <Image
            source={require("../../../assets/paypal.png")}
            style={{ width: 75, height: 20 }}
            contentFit="cover"
          />
          <CustomText color="black" marginVertical="s">
            Add a PayPal Payment Account
          </CustomText>
          <Box
            backgroundColor="lighterGrey"
            paddingHorizontal="m"
            paddingVertical="s"
            borderRadius={50}
            alignItems="center"
            width={"30%"}
          >
            <CustomText color="grey">Unavailable</CustomText>
          </Box>
        </Box>

        <Box width="100%" height={100} marginTop="m" alignItems="center">
          <PrimaryButton
            title="Add"
            width={100}
            height={44}
            onPress={open_flutterwave}
          />
        </Box>
      </Box>
    </ModalWrapper>
  );
};

export default PaymentAccountModal;
