import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import * as SecureStorage from "expo-secure-store";
import OTPTextInput from "react-native-otp-textinput";
import Box from "../../../components/general/Box";
import CustomText from "../../../components/general/CustomText";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../../theme";
import NormalButton from "../../../components/general/NormalButton";
import { useVerifyState } from "../state";
import { useMutation } from "react-query";
import httpService from "../../../utils/httpService";
import { URLS } from "../../../services/urls";
import { useSignupState } from "../../signup/state";
import {
  useDetailsState,
  useUserStateBeforeAddingByRegistration,
} from "../../../states/userState";
import { useModalState } from "../../../states/modalState";
import { useMultipleAccounts } from "../../../states/multipleAccountStates";

const Verify = () => {
  const [code, setCode] = React.useState("");
  const ref = React.useRef();
  const theme = useTheme<Theme>();
  const [setAll] = useVerifyState((state) => [state.setAll]);
  const { addAccount } = useModalState();
  const { setAll: updateDetails, username } = useDetailsState((state) => state);
  const user = useDetailsState((state) => state);
  const { email } = useSignupState((state) => state);
  const [state] = useDetailsState((state) => [state]);
  const [timer, setTimer] = React.useState(60);
  const [resending, setResending] = React.useState(false);
  const { switchAccount, addAccountFn } = useMultipleAccounts((state) => state);
  const oldUser = useUserStateBeforeAddingByRegistration((state) => state);

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: string) =>
      httpService.post(
        `${URLS.VERIFY_EMAIL}/${data}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      ),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: async (data) => {
      if (addAccount) {
        addAccountFn(oldUser, { ...user, token: undefined }); //this adds old user account to accounts arr
        switchAccount(username, state.token, updateDetails);
        //save old user token we are switching from to the local using their username
        const oldToken = await SecureStorage.getItemAsync("token");
        await SecureStorage.setItemAsync(
          `---${oldUser.username}---token`,
          oldToken
        );
        //save new user token we are switching to in local using their username
        await SecureStorage.setItemAsync(
          `---${state.username}---token`,
          state.token
        );
      }
      console.log(data.data);
      setAll({ stage: 2 });
    },
  });

  const resendCode = useMutation({
    mutationFn: (data: { email: string }) =>
      httpService.post(
        `${URLS.RESEND_OTP}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      ),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: (data) => {
      console.log(data.data);
      setResending(true);
      setTimer(59);
      handleTimer();
    },
  });

  const handleInputChange = React.useCallback(
    (code: string) => {
      if (code.length === 4) {
        // make api call
        console.log(`this is the code ${code}`);
        mutate(code);
      } else {
        setCode(code);
      }
    },
    [code]
  );

  const handleTimer = React.useCallback(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer((prev) => prev - 1);
      }
      if (timer === 0) {
        setResending(false);
        setTimer(0);
        clearInterval(interval);
      }
    }, 1000);
  }, [timer]);

  const handleCall = React.useCallback(() => {
    if (code.length < 4) {
      alert("code not complete");
      return;
    } else {
      mutate(code);
    }
  }, [code]);

  const handleResend = React.useCallback(() => {
    resendCode.mutate({ email });
  }, []);

  return (
    <Box flex={1}>
      <Box flex={0.8}>
        <CustomText variant="header" textAlign="center" marginTop="xl">
          Verification
        </CustomText>
        <CustomText variant="body" textAlign="center" marginTop="m">
          A verification code has been sent to{" "}
          <CustomText variant="body" fontFamily="RedMedium" color="black">
            {state.email}
          </CustomText>
        </CustomText>

        <OTPTextInput
          inputCount={4}
          ref={(e: any) => (ref.current = e)}
          handleTextChange={handleInputChange}
          keyboardType="phone-pad"
          tintColor={"transparent"}
          offTintColor={"transparent"}
          containerStyle={{
            marginVertical: 10,
            marginTop: 20,
          }}
          textInputStyle={{
            borderWidth: 0,
            height: 73,
            width: 73,
            borderRadius: 10,
            backgroundColor: theme.colors.secondaryBackGroundColor,
            flex: 1,
            color: theme.colors.textColor,
          }}
        />
      </Box>
      <Box flex={0.2}>
        {resending && (
          <CustomText variant="body" textAlign="center">
            Resending in{" "}
            <CustomText variant="body" color="primaryColor">
              {timer}
            </CustomText>
          </CustomText>
        )}

        {!resending && (
          <Box flexDirection="row" alignItems="center" justifyContent="center">
            <CustomText
              variant="body"
              textAlign="center"
              mr="m"
              onPress={handleResend}
            >
              Resending Code
            </CustomText>
            {resendCode.isLoading && (
              <ActivityIndicator color={theme.colors.textColor} size="small" />
            )}
          </Box>
        )}

        <NormalButton
          label="verify"
          action={handleCall}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default Verify;
