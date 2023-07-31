import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './MainNavigation';
import { QueryClientProvider, QueryClient } from 'react-query'
import { ThemeProvider } from '@shopify/restyle';
import theme, { darkTheme } from '../theme';
import { useUtilState } from '../states/util';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import renderModals from '../hooks/renderModals';

const queryClient = new QueryClient();
const Navigation = () => {
  const { renderModal } = renderModals();
  const [isDarkMode] = useUtilState((state) => [state.isDarkMode])
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={isDarkMode ? darkTheme : theme}>
        <NavigationContainer>
          <StatusBar animated backgroundColor='transparent' barStyle={isDarkMode ? 'light-content' : 'dark-content'} translucent  />
          <MainNavigation />
          {renderModal()}
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
    </GestureHandlerRootView>
  )
}

export default Navigation