import { View, Text } from "react-native";
import React from "react";
import useForm from "../../../hooks/useForm";
import { resetpasswordSchema } from "../../../services/validations";
import Box from "../../../components/general/Box";
import { CustomTextInput } from "../../../components/form/CustomInput";
import { SubmitButton } from "../../../components/form/SubmittButton";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "react-query";
import httpService from "../../../utils/httpService";
import { URLS } from "../../../services/urls";
import { useResetState } from "./state";
import useToast from "../../../hooks/useToast";

const Reset = () => {
  const { setAll, email } = useResetState((state) => state);
  const toast = useToast();

  const navigation = useNavigation<any>();
  const { isLoading, mutate } = useMutation({
    mutationFn: (data: any) => httpService.post(URLS.RESET_PASSWORD, data),
    onSuccess: () => {
      toast.show("Password was reset successfully", {
        type: "success",
        placement: "top",
      });
      setTimeout(() => {
        navigation.navigate("onboarding", { showModal: 1 });
      }, 2000);
    },
    onError: (error: any) => {
      // alert(JSON.stringify(error));
      toast.show(error.message, { type: "danger", placement: "top" });
    },
  });
  const { renderForm } = useForm({
    defaultValues: {
      password: "",
      password_confirmation: "",
      otp: "",
    },
    validationSchema: resetpasswordSchema,
  });

  const navigate = React.useCallback(
    (data: any) => {
      const obj = {
        ...data,
        email,
      };
      mutate(obj);
    },
    [email]
  );

  return renderForm(
    <Box flex={1}>
      <Box flex={0.7}>
        <CustomTextInput
          name="otp"
          placeholder="OTP sent to email"
          label="OTP code"
          containerStyle={{ marginTop: 20 }}
        />
        <CustomTextInput
          name="password"
          placeholder="Password"
          isPassword
          label="Password"
          containerStyle={{ marginTop: 20 }}
        />
        <CustomTextInput
          name="password_confirmation"
          placeholder="Confirm Password"
          label="Confirm Password"
          isPassword
          containerStyle={{ marginTop: 20 }}
        />

        <Box height={20} />
      </Box>
      <Box flex={0.3} justifyContent="center">
        <SubmitButton
          label="Reset Password"
          onSubmit={navigate}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default Reset;
