import { Dropdown } from "react-native-element-dropdown";
import Box from "../general/Box";
import {
  StyleProp,
  StyleSheetProperties,
  View,
  Text,
  ViewStyle,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { StyleSheet } from "react-native";
import CustomText from "../general/CustomText";

interface IDropdown {
  label: string | undefined;
  placeholder: string | undefined;
  options: any[];
  onChange: any;
  labelField: string | undefined;
  valueField: string | undefined;
  style: StyleProp<ViewStyle> | undefined;
  selectedTextStyle: StyleProp<ViewStyle> | undefined;
  placeholderStyle: StyleProp<ViewStyle> | undefined;
  value: any | undefined;
  search: boolean;
}

export default function CustomDropdown({
  value,
  label,
  style,
  selectedTextStyle,
  placeholderStyle,
  placeholder = "Select",
  options,
  onChange,
  labelField = "label",
  valueField = "value",
  search,
}: IDropdown) {
  const theme = useTheme<Theme>();

  const renderItem = (item) => {
    return (
      <Box paddingHorizontal="m" paddingVertical="m">
        <CustomText variant="body">{item[labelField]}</CustomText>
      </Box>
    );
  };

  return (
    <Box marginTop="s">
      <CustomText variant="body">{label}</CustomText>
      <Box
        width="100%"
        paddingVertical="s"
        paddingHorizontal="s"
        borderWidth={2}
        borderRadius={10}
        marginTop="s"
        borderColor="secondaryBackGroundColor"
      >
        <Dropdown
          placeholder={placeholder}
          style={[styles.input, style]}
          placeholderStyle={[styles.placeholderStyle, placeholderStyle]}
          selectedTextStyle={selectedTextStyle}
          search={search}
          maxHeight={300}
          labelField={labelField}
          valueField={valueField}
          onChange={onChange}
          data={options || [{ label: "No input", value: "" }]}
          renderItem={renderItem}
          renderRightIcon={() => (
            <Feather
              name="chevron-down"
              size={20}
              color={theme.colors.textColor}
            />
          )}
          value={value}
        />
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 14,
    lineHeight: 14,
    width: "100%",
    paddingHorizontal: "2.5%",
  },
  placeholderStyle: {
    fontSize: 14,
    lineHeight: 15,
  },
});
