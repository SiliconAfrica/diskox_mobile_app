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

const InviteModeratorModal = () => {
  const queryClient = useQueryClient();
  const { setAll, showInviteModerator } = useModalState((state) => state);
  const {
    communityUserToTakeActionOn,
    id: communityId,
    single_moderator_permissions,
  } = useCommunityDetailsState((state) => state);
  const ref = useRef<BottomSheetModal>();
  const theme = useTheme<Theme>();
  const toast = useToast();
  const [access, setAccess] = useState({
    manageUsers: false,
    manageContent: false,
    manageRules: false,
    everything: false,
  });
  const onClose = React.useCallback(() => {
    setAll({ showInviteModerator: false });
  }, []);
  const { mutate, isLoading } = useMutation({
    mutationKey: `invite-moderator-${communityUserToTakeActionOn.id}`,
    mutationFn: (data: FormData) =>
      httpService.post(
        `${URLS.ASSIGN_COMMUNITY_ROLE}/${communityId}/${communityUserToTakeActionOn.id}`,
        data
      ),
    onSuccess: (res) => {
      if (res.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
        toast.show(res.data?.message || "Invitation sent", { type: "success" });
        queryClient.invalidateQueries(["getModerators", communityId]);
        onClose();
        return;
      }
      toast.show(res.data?.message || "An error occured", { type: "danger" });
    },
    onError: (e: any) => {
      toast.show(e?.message || "An error occured", { type: "danger" });
    },
  });

  const send_invite = useCallback(() => {
    const form = new FormData();
    if (access.manageContent) {
      form.append("permissions[]", "contents");
    }
    if (access.manageRules) {
      form.append("permissions[]", "rules");
    }
    if (access.manageUsers) {
      form.append("permissions[]", "users");
    }
    mutate(form);
  }, [access]);
  useEffect(() => {
    setAccess((prev) => ({
      ...prev,
      manageContent: single_moderator_permissions.content,
      manageRules: single_moderator_permissions.rules,
      manageUsers: single_moderator_permissions.users,
    }));
  }, [single_moderator_permissions]);

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.present();
    }
  }, []);

  return (
    <ModalWrapper
      onClose={onClose}
      shouldScrroll
      snapPoints={["50%"]}
      ref={ref}
    >
      <Box
        width={"100%"}
        backgroundColor="mainBackGroundColor"
        paddingHorizontal="m"
        alignItems="center"
      >
        <CustomText
          textAlign="center"
          style={{
            width: "50%",
            backgroundColor: theme.colors.primaryColor,
            color: theme.colors.white,
          }}
          paddingHorizontal="s"
          paddingVertical="s"
          marginBottom="m"
        >
          {communityUserToTakeActionOn.username}
        </CustomText>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          marginBottom="s"
        >
          <Box width={"10%"} marginTop="s">
            <Checkbox
              value={access.everything}
              onValueChange={() =>
                setAccess((prev) => ({
                  ...prev,
                  manageUsers: !prev.everything,
                  manageContent: !prev.everything,
                  manageRules: !prev.everything,
                  everything: !prev.everything,
                }))
              }
              color={
                access.everything
                  ? theme.colors.primaryColor
                  : theme.colors.textColor
              }
            />
          </Box>
          <Box width={"85%"}>
            <CustomText variant="subheader">Everything</CustomText>
            <CustomText>
              Full access including the ability to manage moderator access and
              permissions.
            </CustomText>
          </Box>
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          marginBottom="s"
        >
          <Box width={"10%"} marginTop="s">
            <Checkbox
              value={access.manageUsers}
              onValueChange={() =>
                setAccess((prev) => ({
                  ...prev,
                  manageUsers: !prev.manageUsers,
                }))
              }
              color={
                access.manageUsers
                  ? theme.colors.primaryColor
                  : theme.colors.textColor
              }
            />
          </Box>
          <Box width={"85%"}>
            <CustomText variant="subheader">Manage Users</CustomText>
            <CustomText>
              Access moderator notes, ban and suspend users, accept member
              invites.
            </CustomText>
          </Box>
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          marginBottom="s"
        >
          <Box width={"10%"} marginTop="s">
            <Checkbox
              value={access.manageContent}
              onValueChange={() =>
                setAccess((prev) => ({
                  ...prev,
                  manageContent: !prev.manageContent,
                }))
              }
              color={
                access.manageContent
                  ? theme.colors.primaryColor
                  : theme.colors.textColor
              }
            />
          </Box>
          <Box width={"85%"}>
            <CustomText variant="subheader">Manage Content</CustomText>
            <CustomText>
              Full access including the ability to manage moderator access and
              permissions.
            </CustomText>
          </Box>
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          marginBottom="m"
        >
          <Box width={"10%"} marginTop="s">
            <Checkbox
              value={access.manageRules}
              onValueChange={() =>
                setAccess((prev) => ({
                  ...prev,
                  manageRules: !prev.manageRules,
                }))
              }
              color={
                access.manageRules
                  ? theme.colors.primaryColor
                  : theme.colors.textColor
              }
            />
          </Box>
          <Box width={"85%"}>
            <CustomText variant="subheader">Manage Rules</CustomText>
            <CustomText>
              Full access including the ability to manage moderator access and
              permissions.
            </CustomText>
          </Box>
        </Box>
        <CustomButton
          title="Invite"
          width={"50%"}
          height={40}
          color={theme.colors.primaryColor}
          textColor="white"
          onPress={send_invite}
          isLoading={isLoading}
        />
      </Box>
    </ModalWrapper>
  );
};

export default InviteModeratorModal;
