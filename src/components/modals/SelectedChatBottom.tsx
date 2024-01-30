import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { useRef } from "react";
import CustomText from "../general/CustomText";
import Box from "../general/Box";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { Image } from "expo-image";
import { IChatMessage } from "../../models/chatmessages";
import { useDetailsState } from "../../states/userState";

export default function SelectedChatBottom({
  selectedMessage,
  setSelectedMessageAction,
  unselectMessage,
}: {
  selectedMessage: Partial<IChatMessage>;
  setSelectedMessageAction: any;
  unselectMessage: () => void;
}) {
  const ref = useRef<BottomSheetModal>();
  const theme = useTheme<Theme>();
  const { id } = useDetailsState((state) => state);
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      backgroundColor="white"
      paddingVertical="l"
      paddingHorizontal="l"
      borderTopWidth={1}
      borderTopColor="secondaryBackGroundColor"
    >
      <Box width="15%" alignItems="center">
        <Entypo
          name="reply"
          size={30}
          color={theme.colors.primaryColor}
          onPress={() =>
            setSelectedMessageAction((prev) => ({ ...prev, reply: true }))
          }
        />
        <CustomText>Reply</CustomText>
      </Box>
      <Box width="15%" alignItems="center">
        <Ionicons name="copy" size={30} color={theme.colors.primaryColor} />
        <CustomText>Copy</CustomText>
      </Box>
      {selectedMessage.sender_id === id && (
        <Box width="15%" alignItems="center">
          <MaterialCommunityIcons
            name="comment-edit"
            size={30}
            color={theme.colors.primaryColor}
            onPress={() => {
              unselectMessage();
              setSelectedMessageAction((prev) => ({ ...prev, edit: true }));
            }}
          />
          <CustomText>Edit</CustomText>
        </Box>
      )}
      <Box width="15%" alignItems="center">
        <FontAwesome
          name="trash"
          size={30}
          color={theme.colors.primaryColor}
          onPress={() =>
            setSelectedMessageAction((prev) => ({ ...prev, delete: true }))
          }
        />
        <CustomText>Delete</CustomText>
      </Box>
    </Box>
  );
}
