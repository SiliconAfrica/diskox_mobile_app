import { BackHandler } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { useModalState } from "../../states/modalState";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Box from "../general/Box";
import CustomText from "../general/CustomText";
import CustomButton from "../general/CustomButton";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { Checkbox } from "react-native-ui-lib";
import { useCommunityDetailsState } from "../../pages/bottomtabs/community/states/Settings.state";
import { useMutation, useQueryClient } from "react-query";
import httpService from "../../utils/httpService";
import { URLS } from "../../services/urls";
import { CUSTOM_STATUS_CODE } from "../../enums/CustomCodes";
import useToast from "../../hooks/useToast";
import { CustomTextInputWithoutForm } from "../form/CustomInputWithoutForm";
import CustomDropdown from "../form/CustomDropdown";

const SuspendMemberModal = () => {
  const queryClient = useQueryClient();
  const { setAll, showInviteModerator } = useModalState((state) => state);
  const { id: communityId, communityUserToTakeActionOn } =
    useCommunityDetailsState((state) => state);
  const ref = useRef<BottomSheetModal>();
  const theme = useTheme<Theme>();
  const toast = useToast();
  const [input, setInput] = useState({
    duration: 0,
    reason: "",
  });

  const onClose = React.useCallback(() => {
    setAll({ showSuspendMemberFromCommunity: false });
  }, []);
  const { mutate, isLoading } = useMutation({
    mutationKey: `suspend-community-member-${communityUserToTakeActionOn.id}`,
    mutationFn: (data: FormData) =>
      httpService.post(
        `${URLS.SUSPENDED_COMMUNITY_MEMBER}/${communityId}/${communityUserToTakeActionOn.id}`,
        data
      ),
    onSuccess: (res) => {
      if (res.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
        toast.show(res.data?.message || "User suspended", { type: "success" });
        queryClient.invalidateQueries([
          `getSuspendedCommunityMembers-${communityId}`,
          communityId,
        ]);
        onClose();
        return;
      }
      toast.show(res.data?.message || "An error occured", { type: "danger" });
    },
    onError: (e: any) => {
      toast.show(e?.message || "An error occured", { type: "danger" });
    },
  });

  const suspend_member = useCallback(() => {
    const form = new FormData();
    if (input.duration && input.reason) {
      form.append("duration", input.duration.toString());
      form.append("reason", input.reason);
      mutate(form);
    } else {
      toast.show("All fields are required", { type: "danger" });
    }
  }, [input]);

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.present();
    }
  }, []);

  return (
    <ModalWrapper
      onClose={onClose}
      shouldScrroll
      snapPoints={["45%"]}
      ref={ref}
    >
      <Box
        width={"100%"}
        backgroundColor="mainBackGroundColor"
        paddingHorizontal="m"
        paddingTop="m"
        alignItems="center"
      >
        <CustomText
          textAlign="center"
          style={{
            width: "50%",
            backgroundColor: theme.colors.primaryColor,
            color: theme.colors.white,
            borderRadius: 50,
          }}
          paddingHorizontal="s"
          paddingVertical="s"
          marginBottom="m"
        >
          {communityUserToTakeActionOn.username}
        </CustomText>
        <CustomTextInputWithoutForm
          label="How long do you want to suspend this user?"
          name="duration"
          placeholder="0"
          required
          keyboardType="number-pad"
          onChangeText={(val) => {
            setInput((prev) => ({ ...prev, duration: Number(val) }));
          }}
          value={input.duration > 0 ? input.duration.toString() : ""}
        />
        <CustomDropdown
          boxStyle={{ width: "100%", marginBottom: 20 }}
          label="What is your reason for suspending this user?"
          options={[
            { label: "Spam", value: "Spam" },
            { label: "Harrasment", value: "Harrasment" },
            { label: "Threatening", value: "Threatening" },
            { label: "Hate", value: "Hate" },
            { label: "Self-harm or suicide", value: "Self-harm or suicide" },
            { label: "Fraud or Scam", value: "Fraud or Scam" },
            { label: "Misinformation", value: "Misinformation" },
            { label: "Other", value: "Other" },
          ]}
          labelField="value"
          valueField="value"
          onChange={(data) =>
            setInput((prev) => ({ ...prev, reason: data.value }))
          }
          value={input.reason}
        />
        <CustomButton
          title="Suspend"
          width={"50%"}
          height={40}
          color={theme.colors.primaryColor}
          textColor="white"
          onPress={suspend_member}
          isLoading={isLoading}
        />
      </Box>
    </ModalWrapper>
  );
};

export default SuspendMemberModal;
