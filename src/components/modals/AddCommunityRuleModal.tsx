import React, { useCallback, useEffect, useRef, useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { useModalState } from "../../states/modalState";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Box from "../general/Box";
import CustomText from "../general/CustomText";
import CustomButton from "../general/CustomButton";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { useCommunityDetailsState } from "../../pages/bottomtabs/community/states/Settings.state";
import { useMutation, useQueryClient } from "react-query";
import httpService from "../../utils/httpService";
import { URLS } from "../../services/urls";
import { CUSTOM_STATUS_CODE } from "../../enums/CustomCodes";
import useToast from "../../hooks/useToast";
import { CustomTextInputWithoutForm } from "../form/CustomInputWithoutForm";
import CustomDropdown from "../form/CustomDropdown";
import useForm from "../../hooks/useForm";
import { addCommunityRuleValidation } from "../../services/validations";
import { SubmitButton } from "../form/SubmittButton";
import { CustomTextInput } from "../form/CustomInput";
import { CustomTextarea } from "../form/CustomTextarea";

const AddCommunityRuleModal = () => {
  const queryClient = useQueryClient();
  const { setAll } = useModalState((state) => state);
  const {
    id: communityId,
    ruleToActOn,
    setAll: setCommunity,
  } = useCommunityDetailsState((state) => state);
  const ref = useRef<BottomSheetModal>();
  const theme = useTheme<Theme>();
  const toast = useToast();
  const [edit, setEdit] = useState(false);

  const onClose = React.useCallback(() => {
    setAll({ showAddCommunityRule: false });
  }, []);
  const onSuccess = (res) => {
    if (res.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
      toast.show(
        res.data?.message || edit
          ? "Rule updated successfully"
          : "Rule has been added to your community",
        {
          type: "success",
        }
      );
      queryClient.invalidateQueries([
        `getCommunityRules-${communityId}`,
        communityId,
      ]);
      onClose();
      return;
    }
    toast.show(res.data?.message || "An error occured", { type: "danger" });
  };
  const onError = (e: any) => {
    toast.show(e?.message || "An error occured", { type: "danger" });
  };
  const { mutate, isLoading } = useMutation({
    mutationKey: `add-community-rule-${communityId}`,
    mutationFn: (data: FormData) =>
      httpService.post(`${URLS.ADD_COMMUNITY_RULE}/${communityId}`, data),
    onSuccess,
    onError,
  });
  const { mutate: updateRule, isLoading: isUpdating } = useMutation({
    mutationKey: `update-community-rule-${communityId}`,
    mutationFn: (data: FormData) =>
      httpService.put(
        `${URLS.UPDATE_COMMUNITY_RULE}/${communityId}/${ruleToActOn.id}`,
        data
      ),
    onSuccess,
    onError,
  });

  const add_rule = (data: any) => {
    if (data.description && data.title) {
      mutate(data);
    } else {
      toast.show("All fields are required", { type: "danger" });
    }
  };
  const update_rule = (data: any) => {
    if (data.description && data.title) {
      updateRule(data);
    } else {
      toast.show("All fields are required", { type: "danger" });
    }
  };

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.present();
    }
    return () => {
      setCommunity({ ruleToActOn: {} });
    };
  }, []);
  useEffect(() => {
    if (ruleToActOn.title || ruleToActOn.description) {
      setEdit(true);
    } else {
      setEdit(false);
    }
  }, [ruleToActOn]);
  const { renderForm } = useForm({
    defaultValues: {
      title: ruleToActOn.title,
      description: ruleToActOn.description,
    },
    validationSchema: addCommunityRuleValidation,
  });

  return renderForm(
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
        paddingTop="m"
        alignItems="center"
      >
        <CustomTextInput
          name="title"
          placeholder="Enter rule title (eg. No Nudity)"
          label="Title"
          containerStyle={{ marginTop: 5, marginBottom: 10 }}
        />
        <CustomTextarea
          name="description"
          placeholder="Enter a description of the rule"
          label="Description"
          containerStyle={{ marginVertical: 10, marginBottom: 40 }}
        />
        <SubmitButton
          label={edit ? "Update Rule" : "Add Rule"}
          width={"50%"}
          onSubmit={edit ? update_rule : add_rule}
          isLoading={edit ? isUpdating : isLoading}
        />
      </Box>
    </ModalWrapper>
  );
};

export default AddCommunityRuleModal;
