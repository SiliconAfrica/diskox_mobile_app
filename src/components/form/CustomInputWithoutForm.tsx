import {
  TextInputProps,
  TextInput,
  StyleSheet,
  Alert,
  ViewStyle,
} from "react-native";
import React from "react";
import { Colors, TextField } from "react-native-ui-lib";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import Box from "../general/Box";
import CustomText from "../general/CustomText";
import { Ionicons } from "@expo/vector-icons";

interface IProps {
  onChangeText: any;
  required?: boolean;
  name: string;
  placeholder: string;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
  label?: string;
  showLabel?: boolean;
  removeSpecialCharater?: boolean;
  removeSpaces?: boolean;
  value: string;
}

export const CustomTextInputWithoutForm = (props: IProps & TextInputProps) => {
  const [focused, setFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(true);
  const theme = useTheme<Theme>();
  return (
    <Box style={{ ...props.containerStyle }}>
      <Box flexDirection="row">
        <CustomText variant="xs" fontFamily="RedRegular" marginBottom="s">
          {props.label || props.placeholder}
        </CustomText>
        {props.required && <CustomText style={{ color: "red" }}>*</CustomText>}
      </Box>
      <Box
        style={[
          Style.parent,
          {
            borderColor: theme.colors.primaryColor,
          },
        ]}
      >
        <Box
          style={{
            flex: 1,
            justifyContent: "center",
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}
        >
          {/* {focused && <Text variant='xs'>{props.placeholder || props.name}</Text>} */}
          <TextInput
            {...props}
            placeholderTextColor={theme.colors.textColor}
            cursorColor={theme.colors.textColor}
            placeholder={!focused ? props.placeholder || props.name : ""}
            value={props.value}
            onChangeText={props.onChangeText}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            secureTextEntry={props.isPassword ? showPassword : false}
            style={{
              color: theme.colors.textColor,
              fontFamily: "RedRegular",
            }}
          />
        </Box>
        {props.isPassword && (
          <Ionicons
            onPress={() => setShowPassword((prev) => !prev)}
            name={showPassword ? "eye" : "eye-off"}
            size={25}
            color={theme.colors.textColor}
          />
        )}
      </Box>
    </Box>
  );
};

const Style = StyleSheet.create({
  parent: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  textInput: {
    width: "100%",
    marginBottom: 10,
  },
});

// export CustomTextInput
