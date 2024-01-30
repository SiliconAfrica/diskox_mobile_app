import { createTheme } from "@shopify/restyle";

const COLOR_PALLET = {
  primaryColor: "#34A853",
  black: "black",
  white: "white",
  fadedWhite: "#FCFCFC80",
  grey: "grey",
  whitesmoke: "whitesmoke",
  almostPrimaryGreen: "#D8F3E0",
  lightGrey: "#949E97",
  fadedButtonBgColor: "#F3FBF5",
  textBlue: "#0079D3",
  twitterBlue: "#1D9BF0",
  whatsappGreen: "#25D366",
  transparent: "#000000b9",
  yellowGreen: "#A8B60C",
  error: "#FA2019",
  inputBorderColorLight: "#B8B8B8",
  whiteText: "#FCFCFC",
  transparent2: "transparent",
};

const theme = createTheme({
  colors: {
    ...COLOR_PALLET,
    mainBackGroundColor: COLOR_PALLET.white,
    secondaryBackGroundColor: COLOR_PALLET.whitesmoke,
    headerTextColor: COLOR_PALLET.black,
    textColor: COLOR_PALLET.black,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    header: {
      fontSize: 30,
      color: "headerTextColor",
      fontFamily: "RedBold",
    },
    subheader: {
      fontSize: 24,
      color: "headerTextColor",
      fontFamily: "RedMedium",
    },
    body: {
      fontSize: 16,
      color: "textColor",
      fontFamily: "RedRegular",
    },
    xs: {
      fontSize: 14,
      color: "textColor",
      fontFamily: "RedLight",
    },
    defaults: {
      fontSize: 15,
      color: "textColor",
      fontFamily: "RedRegular",
    },
  },
});

export type Theme = typeof theme;
export default theme;

export const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    mainBackGroundColor: "rgb(21, 21, 21)",
    secondaryBackGroundColor: "rgb(33, 33, 33)",
    headerTextColor: COLOR_PALLET.white,
    textColor: COLOR_PALLET.whiteText,
    black: "white",
    white: "black",
  },
};
