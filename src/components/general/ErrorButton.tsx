import React from "react";
import { ActivityIndicator, Pressable } from "react-native";
import CustomText from "./CustomText";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";

interface IProps {
  width?: number | string;
  height?: number | string;
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  borderRadius?: number;
}

const ErrorButton = ({
  title,
  onPress,
  width = 120,
  height = 45,
  isLoading = false,
  borderRadius = (height as number) / 2 || 25,
}: IProps) => {
  const theme = useTheme<Theme>();
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: theme.colors.error,
        borderWidth: 0,
        borderColor: theme.colors.primaryColor,
        borderRadius: borderRadius,
        width,
        height,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isLoading && <ActivityIndicator color={"white"} size="small" />}
      {!isLoading && (
        <CustomText
          variant="subheader"
          color="primaryColor"
          fontSize={17}
          style={{ color: "white" }}
        >
          {title}
        </CustomText>
      )}
    </Pressable>
  );
};

export default ErrorButton;
