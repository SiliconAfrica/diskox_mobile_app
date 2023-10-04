import { View, Text } from "react-native";
import React from "react";
import Box from "../../../components/general/Box";
import CustomText from "../../../components/general/CustomText";
import useForm from "../../../hooks/useForm";
import {
  passwordSchema,
  usernameSelectSchema,
} from "../../../services/validations";
import { CustomTextInput } from "../../../components/form/CustomInput";
import { SubmitButton } from "../../../components/form/SubmittButton";
import { useSignupState } from "../state";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/MainNavigation";
import { useModalState } from "../../../states/modalState";
import { useMutation } from "react-query";
import httpService from "../../../utils/httpService";
import { useDetailsState } from "../../../states/userState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

type RegisterPayload = {
  email: string;
  username: string;
  password: string;
  password_confirmation: string;
};

const Password = () => {
  const navigation = useNavigation<any>();
  const [setAll] = useModalState((state) => [state.setAll]);
  const {
    username,
    email,
    setAll: setValues,
  } = useSignupState((state) => state);
  const { setAll: updateUser } = useDetailsState((state) => state);

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: RegisterPayload) =>
      httpService.post(`/auth/register`, data),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: async (data) => {
      updateUser({ ...data.data.user, token: data.data.authorisation.token });
      await SecureStore.setItemAsync("token", data.data.authorisation.token);
      console.log(data.data);
      setAll({ showSignup: false });
      navigation.navigate("verify-email");
    },
  });

  const { renderForm } = useForm({
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
    validationSchema: passwordSchema,
  });

  const navigate = React.useCallback((data: any) => {
    const obj: RegisterPayload = {
      email,
      username: username.toLowerCase(),
      password: data.password,
      password_confirmation: data.password_confirmation,
    };
    setValues({
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
    mutate(obj);
  }, []);
  return renderForm(
    <Box flex={1} marginTop="xl">
      <CustomText variant="subheader">
        Hi there! Sign up and start diskoxing
      </CustomText>

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
      <SubmitButton
        label="Continue"
        onSubmit={navigate}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default Password;
