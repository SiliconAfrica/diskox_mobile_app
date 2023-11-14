import React from "react";
import { Image } from "expo-image";
import useForm from "../../hooks/useForm";
import { loginSchema } from "../../services/validations";
import Box from "../../components/general/Box";
import CustomText from "../../components/general/CustomText";
import { CustomTextInput } from "../../components/form/CustomInput";
import { SubmitButton } from "../../components/form/SubmittButton";
import LightBgButton from "../../components/general/LightBgButton";
import { useModalState } from "../../states/modalState";
import { useMutation, useQueryClient } from "react-query";
import httpService from "../../utils/httpService";
import { URLS } from "../../services/urls";
import { useDetailsState } from "../../states/userState";
import * as SecureStorage from "expo-secure-store";
import { useUtilState } from "../../states/util";
import { RootStackParamList } from "../../navigation/MainNavigation";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootBottomTabParamList } from "../../navigation/BottomTabs";
import { useMultipleAccounts } from "../../states/multipleAccountStates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handlePromise } from "../../utils/handlePomise";
import useToast from "../../hooks/useToast";
import CustomButton from "../../components/general/CustomButton";
import { useSignupState } from "../signup/state";

export type PageType = CompositeNavigationProp<
  BottomTabNavigationProp<RootBottomTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;
const Login = () => {
  const navigation = useNavigation<PageType>();
  const [setAll] = useModalState((state) => [state.setAll]);
  const { addAccount } = useModalState();
  const { setAll: updateDetails, username } = useDetailsState((state) => state);
  const userData = useDetailsState((state) => state);
  const { switchAccount, addAccountFn } = useMultipleAccounts((state) => state);
  const { setAll: updateUtil } = useUtilState((state) => state);
  const toast = useToast();
  const queryClient = useQueryClient();

  const { renderForm } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
  });
  //
  const { isLoading, mutate } = useMutation({
    mutationFn: (data: any) => httpService.post(`${URLS.LOGIN}`, data),
    onError: (error: any) => {
      toast.show(error.message, { type: "error" });
    },
    onSuccess: async (data) => {
      if (addAccount) {
        addAccountFn(userData, data.data.user); //this adds old user account to accounts arr
        switchAccount(
          data.data.user.username,
          data.data.authorisation.token,
          updateDetails,
          queryClient
        );
      } else {
        updateDetails({
          ...data.data.user,
          token: data.data.authorisation.token,
        });
      }
      //save logged in user in local
      await SecureStorage.setItemAsync(
        `---${data.data.user.username}---token`,
        data.data.authorisation.token
      );
      await SecureStorage.setItemAsync("token", data.data.authorisation.token);
      // await SecureStorage.setItemAsync("user", JSON.stringify(data.data.user));
      const [saveUser, saveUserErr] = await handlePromise(
        AsyncStorage.setItem(`user`, JSON.stringify(data.data.user))
      );
      updateUtil({ isLoggedIn: true });
      setAll({ showLogin: false });
      if (data.data?.email_verified_at) {
        navigation.navigate("home");
        return;
      } else {
        toast.show("Please verify your email", { type: "danger" });
        setAll({ showLogin: false });
        navigation.navigate("verify-email");
        return;
      }
    },
  });
  return renderForm(
    <Box paddingTop="xl">
      <CustomText variant="subheader">
        Hi there! Welcome back to diskox
      </CustomText>
      <CustomTextInput
        name="email"
        placeholder="Email"
        containerStyle={{ marginTop: 20 }}
      />
      <CustomTextInput
        name="password"
        placeholder="Password"
        isPassword
        containerStyle={{ marginTop: 10 }}
      />
      <Box height={40} />
      <SubmitButton
        label="Login"
        onSubmit={(data) => mutate(data)}
        isLoading={isLoading}
        width={"100%"}
      />

      <Box width="100%" marginTop="m" alignItems="center">
        <CustomButton
          color="#D0F1D9"
          textColor="#34A853"
          title="Signup"
          onPress={() => setAll({ showLogin: false, showSignup: true })}
        />
      </Box>

      <CustomText
        variant="body"
        textAlign="center"
        marginTop="xl"
        onPress={() => {
          setAll({ showLogin: false });
          navigation.navigate("reset-password");
        }}
      >
        Reset Password
      </CustomText>
    </Box>
  );
};

export default Login;
