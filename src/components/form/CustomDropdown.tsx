import { Dropdown } from "react-native-element-dropdown";
import Box from "../general/Box";
import { StyleProp, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { StyleSheet } from "react-native";
import CustomText from "../general/CustomText";

interface IDropdown {
  label?: string;
  placeholder?: string;
  options: any[];
  onChange: any;
  labelField?: string;
  valueField?: string;
  style?: StyleProp<ViewStyle>;
  boxStyle?: StyleProp<ViewStyle>;
  selectedTextStyle?: StyleProp<ViewStyle>;
  placeholderStyle?: StyleProp<ViewStyle>;
  value?: any;
  search?: boolean;
  dropdownPosition?: "auto" | "bottom" | "top";
}

export default function CustomDropdown({
  value,
  label,
  style,
  boxStyle,
  selectedTextStyle,
  placeholderStyle,
  placeholder = "Select",
  options,
  onChange,
  labelField = "label",
  valueField = "value",
  search,
  dropdownPosition,
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
    <Box marginTop="s" style={boxStyle}>
      <CustomText variant="subheader" fontSize={16}>
        {label}
      </CustomText>
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
          dropdownPosition={dropdownPosition}
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
