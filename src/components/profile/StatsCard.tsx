import { View, Text, useWindowDimensions } from "react-native";
import React from "react";
import Box from "../general/Box";
import { Ionicons } from "@expo/vector-icons";
import CustomText from "../general/CustomText";
import { useUtilState } from "../../states/util";

interface IProps {
  mainColor: string;
  iconBg: string;
  iconName:
    | "stats-chart-outline"
    | "chatbox-ellipses-outline"
    | "heart-outline"
    | "arrow-up-outline"
    | "reader-outline"
    | "arrow-down-outline";
  title: string;
  amount: number;
}

const StatsCard = ({ mainColor, iconBg, iconName, title, amount }: IProps) => {
  const WIDTH = useWindowDimensions().width;
  const { isDarkMode } = useUtilState((state) => state)
  return (
    <Box
      width={(WIDTH / 100) * 43}
      height={80}
      backgroundColor={isDarkMode ?"secondaryBackGroundColor" : 'mainBackGroundColor'}
      borderWidth={0}
      borderRadius={10}
      borderColor="secondaryBackGroundColor"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      marginBottom="m"

    >
      <Box
        width={50}
        height={50}
        borderRadius={25}
        justifyContent="center"
        alignItems="center"
        style={{ backgroundColor: iconBg }}
      >
        <Ionicons name={iconName} size={25} color={mainColor} />
      </Box>

      <Box paddingLeft="s">
        <CustomText
          style={{ color: mainColor }}
          variant="header"
          fontSize={14}
        >
          {title}
        </CustomText>
        <CustomText variant="header" fontSize={18}>
          {amount}
        </CustomText>
      </Box>
    </Box>
  );
};

export default StatsCard;
