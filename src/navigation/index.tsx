import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigation from "./MainNavigation";
import { QueryClientProvider, QueryClient } from "react-query";
import { ThemeProvider } from "@shopify/restyle";
import theme, { darkTheme } from "../theme";
import { useUtilState } from "../states/util";
import { Alert, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import renderModals from "../hooks/renderModals";
import * as SecureStorage from "expo-secure-store";
import { useDetailsState } from "../states/userState";
import * as SplashScreen from "expo-splash-screen";
import { ToastProvider } from "react-native-toast-notifications";
import { useMultipleAccounts } from "../states/multipleAccountStates";
import { handlePromise } from "../utils/handlePomise";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Updates from "expo-updates";
import Box from "../components/general/Box";
import ImagesViewer from "../components/modals/ImagesViewer";
import { useModalState } from "../states/modalState";
// import pusher from "../utils/pusher";
// import { PusherEvent } from "pusher-js/types/src/core/connection/protocol/message-types";

const queryClient = new QueryClient();
const Navigation = () => {
  const { renderModal } = renderModals();
  const [isDarkMode, setAll] = useUtilState((state) => [
    state.isDarkMode,
    state.setAll,
  ]);
  const { setAll: setDetails } = useDetailsState((state) => state);
  const { initiateAccount } = useMultipleAccounts((state) => state);
  const { imageViewer } = useModalState((state) => state)

  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        Alert.alert('New Upate', 'An update is available for this app', [
          { text: 'Update', onPress: () => Updates.reloadAsync(), style: 'default', isPreferred: true },
          { text: 'Cancel', onPress: () => {}, style: 'cancel', }
        ])
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
    }
  };

  // React.useEffect(() => {
  //   pusher.subscribe({
  //     channelName: 'test.event',
  //     onEvent: (event: any) => {
  //       console.log(`this is working`);
  //       console.log(event)
  //     }
  //   })
  // }, [pusher])

  React.useEffect(() => {
    // checkForUpdates();
  
  
    (async function () {
  
    
      // const data = await SecureStorage.getItemAsync("user");
      const [data, dataErr] = await handlePromise(AsyncStorage.getItem("user"));
      const isDark = await SecureStorage.getItemAsync("darkMode");
      const [allUsersMultipleAccountsJSON, allUsersMultipleAccountsJSONErr] =
        await handlePromise(AsyncStorage.getItem("all_users"));
      const allUsersMultipleAccounts = JSON.parse(allUsersMultipleAccountsJSON);
      if (allUsersMultipleAccounts && Array.isArray(allUsersMultipleAccounts)) {
        initiateAccount(allUsersMultipleAccounts);
      }

      const obj: { isDarkMode: boolean } = JSON.parse(isDark);

      if (isDark === null) {
        setAll({ isDarkMode: false });
      } else {
        setAll({ isDarkMode: obj.isDarkMode });
      }

      if (data !== null) {
        const details = JSON.parse(data);
        setDetails({ ...details });
        setAll({ isLoggedIn: true });
      } else {
        setAll({ isLoggedIn: false });
      }
      await SplashScreen.hideAsync();
    })();

  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1, position: 'relative' }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={isDarkMode ? darkTheme : theme}>
          <NavigationContainer>
            <StatusBar
              animated
              backgroundColor="transparent"
              barStyle={isDarkMode ? "light-content" : "dark-content"}
              translucent
            />
            <ToastProvider
              placement="bottom"
              duration={5000}
              animationType="slide-in"
              textStyle={{ fontFamily: "RedRegular", fontSize: 18 }}
              swipeEnabled
              successColor={theme.colors.primaryColor}
            >
              <MainNavigation />
              {renderModal()}
              {/* IMAGES VIEWER MODAL */}
              {imageViewer && <ImagesViewer /> }
            </ToastProvider>
          </NavigationContainer>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default Navigation;
