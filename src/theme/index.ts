import { createTheme } from '@shopify/restyle';

const COLOR_PALLET = {
    primaryColor: '#34A853',
    black: 'black',
    white: 'white',
    grey: 'grey',
    whitesmoke: 'whitesmoke',
    lightGrey: 'lightGrey',
    fadedButtonBgColor: '#F3FBF5',
}

const theme = createTheme({
    colors: {
        ...COLOR_PALLET,
        mainBackGroundColor: COLOR_PALLET.white,
        secondaryBackGroundColor: COLOR_PALLET.whitesmoke,
        headerTextColor: COLOR_PALLET.black,
        textColor: COLOR_PALLET.grey,
    },
    spacing: {
        s: 8,
        m: 16,
        l: 24,
        xl: 40,
    },
    textVariants: {
        header: {
          fontWeight: 'bold',
          fontSize: 34,
          color: 'headerTextColor',
          fontFamily: 'Red',
        },
        body: {
          fontSize: 16,
          lineHeight: 24,
          color: 'textColor',
          fontFamily: 'Red',
        },
        xs: {
          fontWeight: '600',
          fontSize: 12,
          color: 'textColor',
          fontFamily: 'Red',
        },
        defaults: {
          fontSize: 16,
          lineHeight: 24,
          color: 'textColor',
          fontFamily: 'Red',
        },
      },
});

export type Theme = typeof theme;
export default theme;

export const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    mainBackGroundColor: 'rgb(21, 21, 21)',
    secondaryBackGroundColor: 'rgb(33, 33, 33)',
    headerTextColor: COLOR_PALLET.white,
    textColor: COLOR_PALLET.whitesmoke,
  }
}