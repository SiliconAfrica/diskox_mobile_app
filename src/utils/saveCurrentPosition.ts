import AsyncStorage from "@react-native-async-storage/async-storage";
import { handlePromise } from "./handlePomise";

export const saveScreen = async (screenName, params = {}) => {
  await AsyncStorage.setItem(
    "lastScreen",
    JSON.stringify({ screenName, params })
  );
};

export const getScreen = async () => {
  const [screen, screenErr] = await handlePromise(
    AsyncStorage.getItem("lastScreen")
  );
  return JSON.parse(screen);
};
