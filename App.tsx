import React from 'react';
import 'react-native-reanimated'
import 'react-native-gesture-handler'
import { useCallback, useEffect, useState, useRef } from 'react'
import Navigation from './src/navigation';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native'
// import Echo from 'laravel-echo';
/**
+ * Renders the main App component.
+ *
+ * @return {JSX.Element} The Navigation component.
+ */
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { View } from 'react-native';
import pusher from './src/utils/pusher';
/**
+ * Renders the main App component.
+ *
+ * @return {JSX.Element} The Navigation component.
+ */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token.data;
}



SplashScreen.preventAutoHideAsync();
export default function App(): JSX.Element {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [sent, setSent] = React.useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();


  const [fontsLoaded] = useFonts({
    'RedBold': require('./assets/fonts/RedHatDisplayBold.ttf'),
    'RedMedium': require('./assets/fonts/RedHatDisplayMedium.ttf'),
    'RedRegular': require('./assets/fonts/RedHatDisplayRegular.ttf'),
    'RedLight': require('./assets/fonts/RedHatDisplayLight.ttf'),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // React.useEffect(() => {
  //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  //   Notifications.addNotificationReceivedListener(notification => {
  //     setNotification(notification.request ? true:false);
  //   });

  //   Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log(response);
  //   });

  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  // React.useEffect(() => {
  //   (async function() {
  //     if (!sent) {
  //       await sendPushNotification(expoPushToken);
  //       setSent(true);
  //     }
  //   })()
  // }, [sent])



  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Navigation />
    </View>
  );
}

