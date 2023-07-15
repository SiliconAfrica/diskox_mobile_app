import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './MainNavigation';
import { QueryClientProvider, QueryClient } from 'react-query'
import { ThemeProvider } from '@shopify/restyle';
import theme, { darkTheme } from '../theme';
import { useUtilState } from '../states/util';
import { StatusBar } from 'react-native';

const queryClient = new QueryClient();
const Navigation = () => {
  const [isDarkMode] = useUtilState((state) => [state.isDarkMode])
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={isDarkMode ? darkTheme : theme}>
        <NavigationContainer>
          <StatusBar animated backgroundColor='transparent' barStyle={isDarkMode ? 'light-content' : 'dark-content'} translucent  />
          <MainNavigation />
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default Navigation