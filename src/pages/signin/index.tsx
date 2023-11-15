import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React from "react";
import Box from "../../components/general/Box";
import { Image } from "expo-image";
import CustomText from "../../components/general/CustomText";
import { useUtilState } from "../../states/util";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { useModalState } from "../../states/modalState";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../navigation/MainNavigation";
import useToast from "../../hooks/useToast";
// google auth
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as SecureStorage from "expo-secure-store";
import * as AuthSession from "expo-auth-session";
import { useMutation, useQueryClient } from "react-query";
import httpService from "../../utils/httpService";
import { URLS } from "../../services/urls";
import { CustomTextInput } from "../../components/form/CustomInput";
import useForm from "../../hooks/useForm";
import { useSignupState } from "../signup/state";
import { AntDesign } from "@expo/vector-icons";
import {
  loginSchema,
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
import { useMultipleAccounts } from "../../states/multipleAccountStates";
import { handlePromise } from "../../utils/handlePomise";

WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri();

const SignIn = ({
  route,
}: NativeStackScreenProps<RootStackParamList, "sign-in">) => {
  const queryClient = useQueryClient();
  const [isDarkMode] = useUtilState((state) => [state.isDarkMode]);
  const { addAccount } = useModalState();
  const { switchAccount, addAccountFn } = useMultipleAccounts((state) => state);
  const [setAll] = useModalState((state) => [state.setAll]);
  const userData = useDetailsState((state) => state);
  const { setAll: updateOldUser } = useUserStateBeforeAddingByRegistration(
    (state) => state
  );
  const { setAll: updateUtil } = useUtilState((state) => state);
  const oldUser = useDetailsState((state) => state);
  const { setAll: updateDetails, username } = useDetailsState((state) => state);
  const [googleSigninLoading, setGoogleSignInLoading] = React.useState(false);
  const params = route.params;
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

  const { isLoading: isLoggingIn, mutate: login } = useMutation({
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
      if (data.data?.user?.email_verified_at) {
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

  const signInWithGoogleAsync = async () => {
    promptAsync({ useProxy: true, projectNameForProxy: "@dandolla98/diskos" });
  };
  const { renderForm } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
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
            style={{ paddingTop: 20 }}
          />
          <Box
            width="100%"
            marginTop="s"
            alignItems="center"
            justifyContent="center"
            paddingVertical="s"
          >
            <CustomText variant="header" textAlign="center">
              {params?.isAddingAccount === true
                ? "Add another account"
                : "Login to continue"}
            </CustomText>
          </Box>

          <Box width="100%" alignItems="center" paddingVertical="s">
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
            <Box width="100%" paddingVertical="m" justifyContent="center">
              <CustomText
                variant="xs"
                textAlign="left"
                onPress={() => navigation.navigate("reset-password")}
              >
                Forgot Password?{" "}
              </CustomText>
            </Box>
            <SubmitButton
              width={"100%"}
              label="Continue"
              onSubmit={(data) => login(data)}
              isLoading={isLoggingIn}
            />
            <Box width="100%" paddingVertical="m" justifyContent="center">
              <CustomText variant="xs" textAlign="center">
                New here?{" "}
                <CustomText
                  variant="xs"
                  color="textBlue"
                  onPress={() => navigation.navigate("register")}
                >
                  Sign up
                </CustomText>
              </CustomText>
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
};

export default SignIn;
