import React from 'react';
import 'react-native-reanimated'
import 'react-native-gesture-handler'
import { useCallback, useState, useRef } from 'react'
import Navigation from './src/navigation';
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


  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Navigation />
    </View>
  );
}

