import React from "react";
import { useForm, useFormContext } from "react-hook-form";
import { Pressable } from "react-native";
import { Colors, Button } from "react-native-ui-lib";
import CustomText from "../general/CustomText";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";

interface IProps {
  onSubmit: (data: any) => void;
  label: string;
  isLoading?: boolean;
  width?: number | string;
}

export const SubmitButton = ({
  onSubmit,
  label,
  isLoading,
  width = "100%",
}: IProps) => {
  const {
    handleSubmit,
    formState: { isDirty, isValid, isSubmitting },
  } = useFormContext();
  const theme = useTheme<Theme>();

  //disabled={!isDirty || !isValid  ? true: false}

  return (
    <>
      <Pressable
        onPress={handleSubmit(onSubmit)}
        style={{
          width,
          height: 52,
          backgroundColor: theme.colors.primaryColor,
          opacity: !isDirty || !isValid ? 0.6 : 1,
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CustomText
          variant="header"
          style={{
            fontSize: 16,
            color: "#FFFFFF",
          }}
        >
          {isLoading ? "submitting..." : label}
        </CustomText>
      </Pressable>
    </>
  );
};
