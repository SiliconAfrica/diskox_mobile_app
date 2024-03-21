import AsyncStorage from "@react-native-async-storage/async-storage";
import { handlePromise } from "./handlePomise";

export const saveScreen = async (screenName) => {
  await AsyncStorage.setItem("lastScreen", screenName);
};

export const getScreen = async (screenName) => {
  const [screen, screenErr] = await handlePromise(
    AsyncStorage.getItem("lastScreen")
  );
  return screen;
};
