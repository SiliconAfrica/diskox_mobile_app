import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { AntDesign } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import * as SecureStorage from "expo-secure-store";
import * as AuthSession from "expo-auth-session";
import { useMutation, useQueryClient } from "react-query";
import httpService, { FRONTEND_BASE_URL } from "../../utils/httpService";
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
import { handlePromise } from "../../utils/handlePomise";
import { useMultipleAccounts } from "../../states/multipleAccountStates";

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
  const { addAccountFn, switchAccount } = useMultipleAccounts();
  const userData = useDetailsState((state) => state);
  const { setAll: updateDetails, username } = useDetailsState((state) => state);
  const queryClient = useQueryClient();
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

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
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

  const loginSuccessFn = async (data, proceedToSetup) => {
    if (addAccount && data.data.user.username) {
      addAccountFn(userData, data.data.user); //this adds old user account to accounts arr

      switchAccount(
        data.data.user.username,
        data.data.authorisation.token,
        updateDetails,
        queryClient
      );
    } else if (!addAccount && data.data.user.username) {
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
    if (proceedToSetup === true) {
      navigation.navigate("set-up", {
        showUsername: true,
        userId: data.data.user.id,
      });
      return true;
    } else if (proceedToSetup !== true && data.data?.user?.email_verified_at) {
      navigation.navigate("home");
      return true;
    } else if (proceedToSetup !== true && !data.data?.user?.email_verified_at) {
      toast.show("Please verify your email", { type: "danger" });
      navigation.navigate("verify-email");
      return true;
    }
  };

  // google signup mutation
  const { isLoading, mutate } = useMutation({
    mutationFn: (data: string) =>
      httpService.post(`${URLS.GOOGLE_AUTH}/${data}`),
    onSuccess: (data) => {
      if (!data.data.user.username) {
        loginSuccessFn(data, true);
      } else {
        loginSuccessFn(data, false);
      }
    },
    onError: (error: any) => {
      toast.show(error.message, { type: "danger" });
    },
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      // Handle successful authentication
      mutate(response.params?.id_token);
    }
  }, [response]);

  const navigate = React.useCallback(
    (data: any) => {
      const obj: RegisterPayload = {
        email: data.email.toLowerCase(),
        username: data.username.toLowerCase(),
        password: data.password,
        password_confirmation: data.password_confirmation,
        referral_code: data.referral_code.toLowerCase(),
      };
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
      paddingTop="xl"
      paddingBottom="l"
    >
      <ScrollView>
        <Box paddingHorizontal="m">
          <AntDesign
            name="arrowleft"
            size={30}
            color={theme.colors.textColor}
            onPress={navigation.goBack}
            style={{ paddingTop: 30 }}
          />
          <Box
            width="100%"
            marginTop="s"
            alignItems="center"
            justifyContent="center"
            paddingTop="s"
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
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.textColor}
                  />
                )}
              </Box>
            </Pressable>
          </Box>
          <Box
            paddingVertical="l"
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
              containerStyle={{ marginTop: 5 }}
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
            <Box width="100%" paddingVertical="m" justifyContent="center">
              <CustomText variant="xs" textAlign="center">
                By continuing, you agree to Diskos{" "}
                <CustomText
                  variant="xs"
                  color="textBlue"
                  onPress={() =>
                    Linking.openURL(`${FRONTEND_BASE_URL}terms-and-conditions`)
                  }
                >
                  Terms and Conditions
                </CustomText>{" "}
                and acknowledge that you’ve read our{" "}
                <CustomText
                  variant="xs"
                  color="textBlue"
                  onPress={() =>
                    Linking.openURL(`${FRONTEND_BASE_URL}privacy-policy`)
                  }
                >
                  Privacy Policy
                </CustomText>
                .
              </CustomText>
            </Box>
            <SubmitButton
              width={"100%"}
              label="Continue"
              onSubmit={navigate}
              isLoading={isSigningUp}
            />
            <Box width="100%" paddingVertical="m" justifyContent="center">
              <CustomText variant="body" textAlign="center">
                Already a member?{" "}
                <CustomText
                  variant="body"
                  color="textBlue"
                  onPress={() => navigation.navigate("sign-in")}
                >
                  Login
                </CustomText>
              </CustomText>
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
};

export default Register;
