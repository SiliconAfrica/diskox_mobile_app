import * as Clipboard from "expo-clipboard";

export const copyToClipboard = async (text: string) => {
  await Clipboard.setStringAsync(text);
  const copied = await Clipboard.getStringAsync();
  if (copied === text) {
    return copied;
  }
  return "";
};
