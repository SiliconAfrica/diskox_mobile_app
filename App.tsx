import 'react-native-reanimated'
import 'react-native-gesture-handler'
import { useCallback } from 'react'
import Navigation from './src/navigation';
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
    'Red': require('./assets/fonts/RedHat.ttf'),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
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

