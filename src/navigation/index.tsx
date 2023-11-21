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
import { MenuProvider } from 'react-native-popup-menu';
// import Pusher from 'pusher-js/react-native';
import Echo from 'laravel-echo';
import { BASE_URL } from "../utils/httpService";
// import { PusherEvent } from "pusher-js/types/src/core/connection/protocol/message-types";
// import { PusherEvent } from "pusher-js/types/src/core/connection/protocol/message-types";
// import {
//   Pusher,
//   PusherMember,
//   PusherChannel,
//   PusherEvent,
// } from '@pusher/pusher-websocket-react-native';


const PUSHER_APP_KEY='f5d4f2be017648807ffe';
const PUSHER_APP_ID='1120726';
const PUSHER_APP_SECRET='2207fb8dfdd934e3f761';

const pusherConfig = {
  appId: PUSHER_APP_ID,
  key: PUSHER_APP_KEY,
  secret: PUSHER_APP_SECRET,
  cluster: 'ap2',
  encrypted: true, // optional, depending on your requirements
};

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
    (async function(){
      // const pusher = Pusher.getInstance();
      // await pusher.init({
      //   apiKey: PUSHER_APP_KEY,
      //   cluster: pusherConfig.cluster,
      //   onError: (error) => {
      //     console.log(error)
      //   },
      //   onConnectionStateChange: (curr, prev) => {
      //     console.log(curr);
      //     console.log(prev);
      //   }
      // });

    // await pusher.connect();
    //   await pusher.subscribe({
    //     channelName: "test.event", 
    //     onEvent: (event: PusherEvent) => {
    //       console.log(`Event received: ${event}`);
    //     }
    //   });
    
      // let echo = new Echo({
      //   broadcaster: 'pusher',
      //   client: pusher,
      //   host: 'https://test404.diskox.com',
      //   endpoint: 'https://test404.diskox.com/api/broadcasting/auth',
      // });

            
      // const ee = echo.channel('test.event').listen('test-event', (e: any) => {
      //   console.log(e);
      // });

      // console.log(ee);

    })()
    // let PusherClient = new Pusher(PUSHER_APP_KEY, {
    //   cluster: pusherConfig.cluster,
      
    //   // wsHost: 'test404.diskox.com/',
    //   // authEndpoint: 'https://test404.diskox.com/api/broadcasting/auth',
    //   // enabledTransports: ['ws', 'wss'],
    //   forceTLS: false,
    // });

    // const channel = PusherClient.subscribe('test.event');
 
    // PusherClient.bind('subscription.error', (data: any) => {
    //     console.log(data);
    // })

    // channel.bind('subscription.succeeded', () => {
    //   console.log('Successfully subscribed to channel');
    //   console.log('Subscribed:', channel.subscribed); // This should be true
    // });

    //   let echo = new Echo({
    //     broadcaster: 'pusher',
    //     client: PusherClient,
    //     host: 'https://test404.diskox.com',
    //     endpoint: 'https://test404.diskox.com/api/broadcasting/auth',
    //   });
      
    //   const ee = echo.channel('test.event').listen('test-event', (e: any) => {
    //     console.log(e);
    //   });
      
  }, [])


  React.useEffect(() => {
  
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
            <MenuProvider>
              <ToastProvider
                placement="top"
                style={{
                  marginTop: 60
                }}
                duration={5000}
                animationType="slide-in"
                textStyle={{ fontFamily: "RedRegular", fontSize: 16 }}
                swipeEnabled
                successColor={theme.colors.primaryColor}
                dangerColor="red"
                warningColor='grey'
              >
                <MainNavigation />
                {renderModal()}
                {/* IMAGES VIEWER MODAL */}
                {imageViewer && <ImagesViewer /> }
              </ToastProvider>
            </MenuProvider>
          </NavigationContainer>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default Navigation;
