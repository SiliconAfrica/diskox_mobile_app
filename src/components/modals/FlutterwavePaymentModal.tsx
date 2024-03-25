import { View, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import { CustomTextInputWithoutForm } from "../form/CustomInputWithoutForm";
import { useMutation } from "react-query";
import httpService from "../../utils/httpService";
import { URLS } from "../../services/urls";
import { CUSTOM_STATUS_CODE } from "../../enums/CustomCodes";
import useToast from "../../hooks/useToast";

const FlutterwavePaymentModal = () => {
  const [setAll] = useModalState((state) => [state.setAll]);
  const ref = useRef<BottomSheetModal>();
  const nav = useNavigation<PageType>();
  const toast = useToast();
  const [form, setForm] = useState({
    account_number: "",
    account_name: "",
    bank_name: "flutterwave",
    otp: "",
  });
  const [showOTP, setShowOTP] = useState(false);
  const handleClose = React.useCallback(() => {
    setAll({ showFlutterPaymentModal: false });
  }, []);

  const { isLoading: isSavingAccount, mutate } = useMutation(
    ["save_bank_account"],
    (body: any) => httpService.post(`${URLS.BANK_ACCOUNT}`, body),
    {
      onSuccess: (data) => {
        if (data.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
          setShowOTP(true);
          toast.show("Your payment method has been added", { type: "success" });
          handleClose();
        } else {
          toast.show("Could not add payment method", { type: "danger" });
        }
      },
      onError: (e: any) => {
        toast.show(e.message, { type: "danger" });
      },
    }
  );

  const {
    isLoading,
    isError,
    mutate: send_otp,
  } = useMutation(
    ["generate_withdrawal_otp"],
    () => httpService.post(`${URLS.SEND_WITHDRAWAL_OTP}`, {}),
    {
      onSuccess: (data) => {
        if (data.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
          setShowOTP(true);
        } else {
          toast.show("Could not add payment method", { type: "danger" });
        }
      },
      onError: (e) => {
        toast.show("Could not add payment method", { type: "danger" });
      },
    }
  );

  useEffect(() => {
    ref.current.present();
  }, []);
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
          Edit Payment Accountxx
        </CustomText>
        {showOTP ? (
          <Box width={"100%"}>
            <CustomTextInputWithoutForm
              label="OTP"
              name="otp"
              placeholder=" "
              required
              onChangeText={(val) => {
                setForm((prev) => ({ ...prev, otp: val }));
              }}
              value={form.otp}
            />
            <Box width="100%" height={100} marginTop="m" alignItems="center">
              <PrimaryButton
                title="Submit"
                width={100}
                height={44}
                isLoading={isSavingAccount}
                onPress={() => mutate(form)}
              />
            </Box>
          </Box>
        ) : (
          <Box width={"100%"}>
            <CustomTextInputWithoutForm
              label="Merchant ID"
              name="account_number"
              placeholder=" "
              required
              onChangeText={(val) => {
                setForm((prev) => ({ ...prev, account_number: val }));
              }}
              value={form.account_number}
            />
            <Box marginBottom="m" />
            <CustomTextInputWithoutForm
              label="Account Name"
              name="account_name"
              placeholder=" "
              required
              onChangeText={(val) => {
                setForm((prev) => ({ ...prev, account_name: val }));
              }}
              value={form.account_name}
            />
            <Box width="100%" height={100} marginTop="m" alignItems="center">
              <PrimaryButton
                title="Submit"
                width={100}
                height={44}
                isLoading={isLoading}
                onPress={send_otp}
              />
            </Box>
          </Box>
        )}
      </Box>
    </ModalWrapper>
  );
};

export default FlutterwavePaymentModal;
