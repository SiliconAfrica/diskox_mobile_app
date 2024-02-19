import { View, Text, Pressable } from "react-native";
import React from "react";
import { IInterest } from "../../models/Interests";
import CustomText from "../general/CustomText";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";

interface IProps {
  data: IInterest;
  isSelected: boolean;
  onPress: (id: number) => void;
}
const InterestChip = ({ data, isSelected, onPress }: IProps) => {
  const theme = useTheme<Theme>();
  return (
    <Pressable
      onPress={() => onPress(data.id)}
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        borderRadius: 20,
        height: 40,
        backgroundColor: isSelected
          ? theme.colors.primaryColor
          : theme.colors.secondaryBackGroundColor,
        borderWidth: 2,
        borderColor: isSelected
          ? theme.colors.primaryColor
          : theme.colors.mainBackGroundColor,
        margin: 10,
      }}
    >
      <CustomText
        variant="body"
        fontSize={14}
        color={isSelected ? "white" : "black"}
      >
        {data.name}
      </CustomText>
    </Pressable>
  );
};

export default InterestChip;
