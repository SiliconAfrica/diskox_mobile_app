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
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import SecureStorage from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import { useMutation } from "react-query";
import httpService from "../../utils/httpService";
import { URLS } from "../../services/urls";

WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri();

const Onboarding = ({
  route,
}: NativeStackScreenProps<RootStackParamList, "onboarding">) => {
  const [isDarkMode] = useUtilState((state) => [state.isDarkMode]);
  const [setAll] = useModalState((state) => [state.setAll]);
  const [googleSigninLoading, setGoogleSignInLoading] = React.useState(false);
  const { showModal, addAccount } = route.params;
  const theme = useTheme<Theme>();
  const toast = useToast();

  const [request, response, promptAsync] = Google.useAuthRequest({
    // androidClientId: '168560685354-gjamvhchu5gmoep11opc06672p6at6n1.apps.googleusercontent.com',
    // iosClientId: '168560685354-ic5lpdnv8o3sk12foocoifirhfb2t8aj.apps.googleusercontent.com',
    // redirectUri: 'https://auth.expo.io/@dandolla98/diskos',
    // expoClientId: '168560685354-bh00asn9q9239stks3nhpe5bhrfmqckd.apps.googleusercontent.com',
    androidClientId: '304260188611-rvqd1uusvltaunvop6lolq5mh7sc4i9i.apps.googleusercontent.com',
    iosClientId: '304260188611-vum90d9hsr2rcol830ni6a9jrh374kc1.apps.googleusercontent.com',
    expoClientId: '304260188611-brt1bj0fr87p8nugabs40s6ciar4ov75.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@dandolla98/diskos',
    scopes: ['profile', 'email'],
  });

  // mutation
  const { isLoading, mutate } = useMutation({
    mutationFn: (data: string) => httpService.post(`${URLS.GOOGLE_AUTH}/${data}`),
    onSuccess: (data) => {
    },
    onError: (error: any) => {
      toast.show(error.message,{ type: 'error' })
    }
  })

  React.useEffect(() => {
    if (response?.type === 'success') {
      // Handle successful authentication
      mutate(response.authentication?.accessToken);
    }
  }, [response]);

  // const getDetails = async (token: string) => {
  //   mutate(token);
  // }


  React.useEffect(() => {
    if (showModal === 1) {
      setAll({ showLogin: true, addAccount: addAccount || false });
    }
    if (showModal === 2) {
      setAll({ showSignup: true, addAccount: addAccount || false });
    }
  }, [showModal]);

  const signInWithGoogleAsync = async () => {
    promptAsync({ useProxy: true, projectNameForProxy: '@dandolla98/diskos' });
  };
  return (
    <Box
      backgroundColor="mainBackGroundColor"
      flex={1}
      paddingHorizontal="m"
      paddingTop="xl"
      paddingBottom="l"
    >
      <Box
        width="100%"
        height="40%"
        alignItems="center"
        justifyContent="center"
      >
        <Image
          transition={1000}
          source={
            isDarkMode
              ? require("../../../assets/images/logo.png")
              : require("../../../assets/images/logoB.png")
          }
          contentFit="contain"
          style={{ width: 120, height: 120 }}
        />
        <CustomText variant="header" textAlign="center">
          Join The Conversation With Millions Of People
        </CustomText>

        <CustomText variant="body" textAlign="center" marginTop="m">
          The best place to connect, interact and grow with people around the
          world
        </CustomText>
      </Box>

      <Box width="100%" height="40%" alignItems="center" paddingTop="xl">
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
            { !isLoading && (
              <CustomText variant="header" style={{ fontSize: 16 }}>
                Continue with Google
              </CustomText>
            )}
            {
              isLoading && (
                <ActivityIndicator size='small' color={theme.colors.textColor} />
              )
            }
          </Box>
        </Pressable>

        <Pressable
          onPress={() =>
            setAll({
              showSignup: true,
              addAccount: addAccount || false,
            })
          }
          style={{
            backgroundColor: theme.colors.primaryColor,
            borderRadius: 50,
            height: 52,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <CustomText variant="header" fontSize={16} style={{ color: 'white'}}>Signup</CustomText>
        </Pressable>

        <Pressable
          onPress={() =>
            setAll({
              showLogin: true,
              addAccount: addAccount || false,
            })
          }
          style={{
            backgroundColor: "#D0F1D9",
            borderRadius: 50,
            height:32,
            width: "30%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <CustomText
            variant="header"
            style={{ fontSize: 16, color: '#34A853' }}
            color="primaryColor"
          >
            Login
          </CustomText>
        </Pressable>
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

export default Onboarding;
