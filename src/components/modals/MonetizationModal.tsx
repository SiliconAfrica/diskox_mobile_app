import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import useToast from "../../hooks/useToast";
import { useDetailsState } from "../../states/userState";
import { useModalState } from "../../states/modalState";
import ModalWrapper from "../ModalWrapper";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Box from "../general/Box";
import { Image } from "expo-image";
import CustomText from "../general/CustomText";
import { Checkbox } from "react-native-ui-lib";
import { useMutation } from "react-query";
import httpService from "../../utils/httpService";
import { URLS } from "../../services/urls";
import { CUSTOM_STATUS_CODE } from "../../enums/CustomCodes";

const MonetizationModal = () => {
  const toast = useToast();
  const ref = useRef<BottomSheetModal>();
  const [checked, setChecked] = useState<boolean>(false);
  const { setAll } = useModalState();
  const theme = useTheme<Theme>();

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: any) =>
      httpService.put(`${URLS.AD_SHARING_REQUEST}`, data),
    onSuccess: (data) => {
      if (data?.data?.code === CUSTOM_STATUS_CODE.SUCCESS) {
        console.log(data?.data, "olsjj");
        toast.show(
          "YOu have successfully requested to allow ads on your profile. Once approved, you will be notified",
          { type: "success" }
        );
        setAll({ showMonetization: false });
      }
    },
    onError: (error: any) => {
      toast.show(error?.message, { type: "error" });
    },
  });

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.present();
    }
  }, []);

  return (
    <ModalWrapper
      onClose={() => setAll({ showMonetization: false })}
      shouldScrroll={false}
      snapPoints={["60%"]}
      ref={ref}
    >
      <Box
        width="100%"
        paddingHorizontal="s"
        paddingVertical="s"
        alignItems="center"
      >
        <Box
          width={"50%"}
          position="relative"
          style={{ paddingTop: "50%" }}
          marginVertical="s"
        >
          <Image
            source={require("../../../assets/images/cashbag.png")}
            contentFit="contain"
            style={{
              width: "100%",
              height: undefined,
              aspectRatio: 1,
              position: "absolute",
            }}
          />
        </Box>
        <CustomText variant="header">Ad Revenue Sharing</CustomText>
        <CustomText variant="body" textAlign="center" marginVertical="s">
          You agree that diskox can put ads on your post, user profile and
          community created by this user.
        </CustomText>
        <Box flexDirection="row">
          <Checkbox
            value={checked}
            onValueChange={() => setChecked((prev) => !prev)}
            color={checked ? theme.colors.primaryColor : theme.colors.textColor}
          />
          <CustomText variant="body" marginHorizontal="s">
            I agree
          </CustomText>
        </Box>
        <Pressable
          onPress={() => {
            if (checked) {
              mutate({});
            } else {
              toast.show("Please agree to the terms and conditions", {
                type: "danger",
              });
            }
          }}
        >
          <Box
            marginVertical="s"
            style={[styles.btn, { backgroundColor: theme.colors.primaryColor }]}
          >
            {isLoading ? (
              <ActivityIndicator size={15} color={theme.colors.white} />
            ) : (
              <CustomText color="white">Start Monetizing</CustomText>
            )}
          </Box>
        </Pressable>
      </Box>
    </ModalWrapper>
  );
};

export default MonetizationModal;

const styles = StyleSheet.create({
  btn: {
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: "5%",
    minWidth: "40%",
  },
});
