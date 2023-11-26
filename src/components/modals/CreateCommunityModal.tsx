import { View, Text, TextInput, Pressable } from "react-native";
import React from "react";
import ReactNavtieModalWrapper from "../ReactNavtieModalWrapper";
import Box from "../general/Box";
import CustomText from "../general/CustomText";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import useForm from "../../hooks/useForm";
import { createCommunityValidation } from "../../services/validations";
import { CustomTextInput } from "../form/CustomInput";
import { CustomTextarea } from "../form/CustomTextarea";
import PrimaryButton from "../general/PrimaryButton";
import { SubmitButton } from "../form/SubmittButton";
import { useMutation } from "react-query";
import httpService from "../../utils/httpService";
import { CUSTOM_STATUS_CODE } from "../../enums/CustomCodes";
import { URLS } from "../../services/urls";
import useToast from "../../hooks/useToast";

interface IProps {
  isVisisble: boolean;
  onClose: () => void;
}

const CreateCommunityModal = ({ isVisisble, onClose }: IProps) => {
  const [description, setDescription] = React.useState("");
  const [showDropdown, setShowDropDown] = React.useState(false);
  const [type, setType] = React.useState("PUBLIC");
  const toast = useToast();
  const cTypes = ["PUBLIC", "PRIVATE"];
  const theme = useTheme<Theme>();
  const { renderForm } = useForm({
    defaultValues: {
      name: "",
      username: "",
      description: "",
    },
    validationSchema: createCommunityValidation,
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: FormData) =>
      httpService.post(`${URLS.CREATE_COMMUNITY}`, data),
    onSuccess: (data) => {
      if (data?.data?.code === CUSTOM_STATUS_CODE.INTERNAL_SERVER_ERROR) {
        toast.show(data?.data?.message, { type: "error" });
      }
      if (data?.data?.code === CUSTOM_STATUS_CODE.SUCCESS) {
        toast.show(data?.data?.message, { type: "success" });
      }
    },
    onError: (error: any) => {
      toast.show(error.message, { type: "error", swipeEnabled: true });
    },
  });

  const handleChange = React.useCallback(() => {
    const obj = {
      PUBLIC: "Anyone can view, post and comment",
      PRIVATE: "Not anyone can view, post and comment",
    };
    return obj[type];
  }, [type]);

  const handleSubmit = React.useCallback(
    (data: { name: string; username: string; description: string }) => {
      const obj = { ...data, type: type.toLowerCase() };
      const formData = new FormData();
      formData.append("topics", obj.name);
      Object.keys(obj).forEach((key) => {
        formData.append(key, obj[key]);
      });
      mutate(formData);
    },
    [type]
  );
  return renderForm(
    <ReactNavtieModalWrapper isVisible={isVisisble} height={"69%"}>
      <Box flex={1}>
        {/* HEADER */}
        <Box
          borderBottomColor="secondaryBackGroundColor"
          borderBottomWidth={2}
          paddingHorizontal="m"
          paddingVertical="s"
          width={"100%"}
          flexDirection="row"
          justifyContent="space-between"
          height={60}
          alignItems="center"
        >
          <CustomText variant="subheader" fontSize={20}>
            Create community
          </CustomText>
          <Feather
            name="x"
            size={25}
            onPress={() => onClose()}
            color={theme.colors.black}
          />
        </Box>

        <Box
          flex={1}
          zIndex={4}
          paddingHorizontal="m"
          paddingVertical="s"
          marginBottom="m"
          position="relative"
        >
          <CustomTextInput name="name" removeSpecialCharater required placeholder="Community title" />
          <Box height={20} />
          <CustomTextInput
          removeSpecialCharater
            name="username"
            required
            placeholder="Community Username"
          />
          <Box height={20} />
          <CustomTextarea
            removeSpecialCharater
            name="description"
            required
            placeholder="Description"
          />
          <Box height={20} />
          <CustomText>Community type</CustomText>
          <Box
            marginTop="s"
            paddingHorizontal="s"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            width={"100%"}
            height={50}
            borderRadius={10}
            borderWidth={2}
            borderColor="secondaryBackGroundColor"
          >
            <Pressable
              onPress={() => setShowDropDown(true)}
              style={{
                width: "70%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Feather
                name="users"
                size={20}
                color={theme.colors.primaryColor}
              />
              <CustomText
                variant="header"
                fontSize={16}
                color={"primaryColor"}
                marginHorizontal="s"
              >
                {type}
              </CustomText>
              <CustomText
                variant="body"
                fontSize={14}
                marginHorizontal="s"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ width: "80%", flexWrap: "nowrap" }}
              >
                {handleChange()}
              </CustomText>
            </Pressable>
            <Feather
              name={showDropdown ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.colors.textColor}
            />
          </Box>
          {showDropdown && (
            <Box
              position="absolute"
              zIndex={5}
              backgroundColor="secondaryBackGroundColor"
              left={15}
              bottom={-90}
              width="100%"
              height={100}
              borderRadius={10}
              borderWidth={2}
              borderColor="mainBackGroundColor"
            >
              {cTypes.map((item, i) => (
                <Pressable
                  key={i.toString()}
                  onPress={() => {
                    setType(item);
                    setShowDropDown(false);
                  }}
                  style={{
                    width: "100%",
                    height: 50,
                    borderBottomWidth: i === cTypes.length - 1 ? 0 : 1,
                    borderBottomColor: "lightgrey",
                    padding: 10,
                  }}
                >
                  <CustomText>{item}</CustomText>
                </Pressable>
              ))}
            </Box>
          )}
        </Box>

        <Box
          height={70}
          borderTopColor="secondaryBackGroundColor"
          borderTopWidth={2}
          paddingHorizontal="m"
          paddingVertical="s"
          width={"100%"}
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <CustomText marginRight="l" variant="subheader" fontSize={16}>
            Cancel
          </CustomText>
          {/* <PrimaryButton title='create community' onPress={() => {}} width={160}/> */}
          <SubmitButton
            label="Create community"
            onSubmit={(data) => handleSubmit(data)}
            isLoading={isLoading}
            width={160}
          />
        </Box>
      </Box>
    </ReactNavtieModalWrapper>
  );
};

export default CreateCommunityModal;
