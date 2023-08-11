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
import * as SecureStorage from 'expo-secure-store';
import { useDetailsState } from '../states/userState';
import * as SplashScreen from 'expo-splash-screen';



const queryClient = new QueryClient();
const Navigation = () => {
  const { renderModal } = renderModals();
  const [isDarkMode, setAll] = useUtilState((state) => [state.isDarkMode, state.setAll]);
  const { setAll: setDetails } = useDetailsState((state) => state)

  React.useEffect(() => {
    (async function() {
      const data = await SecureStorage.getItemAsync('user');
      const isDark = await SecureStorage.getItemAsync("darkMode");
      console.log(`this is the dark mode ${isDark}`);
      console.log(typeof isDark)

      const obj: { isDarkMode: boolean } = JSON.parse(isDark);

      if (isDark === null) {
        setAll({ isDarkMode: false });
      } else {
        setAll({ isDarkMode:  obj.isDarkMode });
      }
      

      if (data !== null) {
        const details = JSON.parse(data);
        setDetails({ ...details });
        setAll({ isLoggedIn: true });
      } else {
        setAll({ isLoggedIn: false });
      }
      await SplashScreen.hideAsync();
    })()
  }, [])
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