import 'react-native-reanimated'
import 'react-native-gesture-handler'
import { useCallback } from 'react'
import Navigation from './src/navigation';
/**
+ * Renders the main App component.
+ *
+ * @return {JSX.Element} The Navigation component.
+ */
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { View } from 'react-native';

/**
+ * Renders the main App component.
+ *
+ * @return {JSX.Element} The Navigation component.
+ */

SplashScreen.preventAutoHideAsync();
export default function App(): JSX.Element {
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

