import { View, Text, Pressable, ActivityIndicator } from "react-native";
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
import useToast from "../../hooks/useToast";

// google auth
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as SecureStorage from "expo-secure-store";
import * as AuthSession from "expo-auth-session";
import { useMutation } from "react-query";
import httpService from "../../utils/httpService";
import { URLS } from "../../services/urls";
import { CustomTextInput } from "../../components/form/CustomInput";
import useForm from "../../hooks/useForm";
import { useSignupState } from "../signup/state";
import {
  registerSchema,
  usernameSelectSchema,
} from "../../services/validations";
import { SubmitButton } from "../../components/form/SubmittButton";
import {
  useDetailsState,
  useUserStateBeforeAddingByRegistration,
} from "../../states/userState";
import { useNavigation } from "@react-navigation/native";
import { PageType } from "../login";

WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri();
type RegisterPayload = {
  email: string;
  username: string;
  password: string;
  password_confirmation: string;
  referral_code: string;
};

const Register = ({
  route,
}: NativeStackScreenProps<RootStackParamList, "onboarding">) => {
  const [isDarkMode] = useUtilState((state) => [state.isDarkMode]);
  const { addAccount } = useModalState();
  const [setAll, values] = useSignupState((state) => [
    state.setAll,
    {
      username: state.username,
      email: state.email,
      password: state.password,
      password_confirmation: state.password_confirmation,
      referral_code: state.referral_code,
    },
  ]);
  const { setAll: updateOldUser } = useUserStateBeforeAddingByRegistration(
    (state) => state
  );
  const oldUser = useDetailsState((state) => state);
  const { setAll: updateUser } = useDetailsState((state) => state);
  const [googleSigninLoading, setGoogleSignInLoading] = React.useState(false);
  //   const { showModal, addAccount } = route.params;
  const theme = useTheme<Theme>();
  const navigation = useNavigation<PageType>();
  const toast = useToast();

  const [request, response, promptAsync] = Google.useAuthRequest({
    // androidClientId: '168560685354-gjamvhchu5gmoep11opc06672p6at6n1.apps.googleusercontent.com',
    // iosClientId: '168560685354-ic5lpdnv8o3sk12foocoifirhfb2t8aj.apps.googleusercontent.com',
    // redirectUri: 'https://auth.expo.io/@dandolla98/diskos',
    // expoClientId: '168560685354-bh00asn9q9239stks3nhpe5bhrfmqckd.apps.googleusercontent.com',
    androidClientId:
      "304260188611-rvqd1uusvltaunvop6lolq5mh7sc4i9i.apps.googleusercontent.com",
    iosClientId:
      "304260188611-vum90d9hsr2rcol830ni6a9jrh374kc1.apps.googleusercontent.com",
    expoClientId:
      "304260188611-brt1bj0fr87p8nugabs40s6ciar4ov75.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.io/@dandolla98/diskos",
    scopes: ["profile", "email"],
  });

  const { isLoading: isSigningUp, mutate: register } = useMutation({
    mutationFn: (data: RegisterPayload) =>
      httpService.post(`/auth/register`, data),
    onError: (error: any) => {
      // alert(error.message);
      toast.show(error.message, { type: "danger", placement: "top" });
    },
    onSuccess: async (data) => {
      if (addAccount) {
        updateOldUser({ ...oldUser });
      }
      updateUser({ ...data.data.user, token: data.data.authorisation.token });
      await SecureStorage.setItemAsync("token", data.data.authorisation.token);

      navigation.navigate("verify-email");
    },
  });

  // google signup mutation
  const { isLoading, mutate } = useMutation({
    mutationFn: (data: string) =>
      httpService.post(`${URLS.GOOGLE_AUTH}/${data}`),
    onSuccess: (data) => {},
    onError: (error: any) => {
      toast.show(error.message, { type: "error" });
    },
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      // Handle successful authentication
      mutate(response.authentication?.accessToken);
    }
  }, [response]);

  const navigate = React.useCallback(
    (data: any) => {
      const obj: RegisterPayload = {
        email: data.email,
        username: data.username.toLowerCase(),
        password: data.password,
        password_confirmation: data.password_confirmation,
        referral_code: data.referral_code,
      };
      console.log(values, "ppp");
      setAll({
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      register(obj);
    },
    [values]
  );

  const signInWithGoogleAsync = async () => {
    promptAsync({ useProxy: true, projectNameForProxy: "@dandolla98/diskos" });
  };
  const { renderForm } = useForm({
    defaultValues: {
      username: values.username,
      email: values.email,
      password: values.password,
      password_confirmation: values.password_confirmation,
      referral_code: values.referral_code,
    },
    validationSchema: registerSchema,
  });
  return renderForm(
    <Box
      backgroundColor="mainBackGroundColor"
      flex={1}
      paddingHorizontal="m"
      paddingTop="xl"
      paddingBottom="l"
    >
      <Box
        width="100%"
        marginTop="l"
        alignItems="center"
        justifyContent="center"
      >
        <CustomText variant="header" textAlign="center">
          Join The Conversation With Millions Of People
        </CustomText>
      </Box>

      <Box width="100%" alignItems="center" paddingTop="s">
        <Pressable
          style={{
            borderWidth: 1,
            borderColor: theme.colors.primaryColor,
            borderRadius: 50,
            height: 52,
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: 20,
          }}
          onPress={signInWithGoogleAsync}
        >
          <Box flex={0.3}>
            <Image
              source={require("../../../assets/images/googlelogo.png")}
              contentFit="contain"
              style={{ width: 30, height: 30 }}
            />
          </Box>
          <Box flex={0.7}>
            {!isLoading && (
              <CustomText variant="header" style={{ fontSize: 16 }}>
                Continue with Google
              </CustomText>
            )}
            {isLoading && (
              <ActivityIndicator size="small" color={theme.colors.textColor} />
            )}
          </Box>
        </Pressable>
      </Box>
      <Box
        paddingVertical="m"
        width={"100%"}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box
          borderBottomWidth={2}
          style={{ borderBottomColor: theme.colors.black }}
          width={"40%"}
        ></Box>
        <CustomText>OR</CustomText>
        <Box
          borderBottomWidth={2}
          style={{ borderBottomColor: theme.colors.black }}
          width={"40%"}
        ></Box>
      </Box>
      <Box>
        <CustomTextInput
          name="username"
          placeholder="Enter your username"
          label="Username"
          removeSpecialCharater
          removeSpaces
          containerStyle={{ marginTop: 20 }}
        />
        <CustomTextInput
          name="email"
          placeholder="Enter your email address"
          label="Email"
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
        <CustomTextInput
          name="referral_code"
          placeholder="Enter your referral code"
          label="Referral Code (Optional)"
          containerStyle={{ marginVertical: 20 }}
        />
        <SubmitButton
          width={"100%"}
          label="Continue"
          onSubmit={navigate}
          isLoading={isSigningUp}
        />
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

export default Register;
