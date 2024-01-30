import { View, Text, Pressable } from "react-native";
import React, { useEffect } from "react";
import Box from "../general/Box";
import { IChatMessage, IPost_Image } from "../../models/chatmessages";
import { useDetailsState } from "../../states/userState";
import CustomText from "../general/CustomText";
import moment from "moment";
import { Image } from "expo-image";
import httpService, { IMAGE_BASE } from "../../utils/httpService";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "react-query";
import { URLS } from "../../services/urls";
import useToast from "../../hooks/useToast";
import DeleteMessageModal from "../modals/DeleteMessageModal";
import { useUtilState } from "../../states/util";
import { ISelectedMessageAction } from "../../pages/chat";

const REACTIONS: Array<{ name: string; icon: string }> = [
  {
    name: "thumbs-up",
    icon: "👍",
  },
  {
    name: "red_heart",
    icon: "❤️️",
  },
  {
    name: "face-joy",
    icon: "😂",
  },
  {
    name: "hushed-face",
    icon: "😯",
  },
  {
    name: "crying-face",
    icon: "😢",
  },
  {
    name: "folded-hands",
    icon: "🙏",
  },
];

const MessageBubble = ({
  created_at,
  message,
  sender_id,
  post_images,
  id: message_id,
  reactions,
  post_files,
  deleted_by,
  openModal,
  theMessage,
  unselectMessage,
  selectedMessage,
  setSelectedMessage,
  selectedMessageAction,
  setSelectedMessageAction,
}: IChatMessage & {
  openModal: (data: IPost_Image[]) => void;
  theMessage: IChatMessage;
  unselectMessage: any;
  selectedMessage: IChatMessage;
  setSelectedMessage: any;
  selectedMessageAction: ISelectedMessageAction;
  setSelectedMessageAction: any;
}) => {
  const { id } = useDetailsState((state) => state);
  const theme = useTheme<Theme>();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showDleteModal, setDeleteModal] = React.useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { isDarkMode } = useUtilState((state) => state);

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: string) =>
      httpService.post(`${URLS.REACT_TO_MESSAGE}/${message_id}`, {
        type: data,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries("getMessages");
      toast.show(`${data?.data?.message}`, { type: "success" });
    },
  });

  useEffect(() => {
    if (selectedMessageAction.delete === true) {
      setDeleteModal(true);
    }
  }, [selectedMessageAction]);

  return (
    <Pressable
      onPress={() => {
        if (selectedMessageAction.selected) {
          unselectMessage();
        }
      }}
      onLongPress={
        deleted_by !== id
          ? () => {
              setSelectedMessage({ ...theMessage });

              setSelectedMessageAction((prev) => ({
                ...prev,
                selected: !prev.selected,
              }));
            }
          : () => {}
      }
    >
      <Box
        zIndex={10}
        maxWidth="70%"
        minWidth="30%"
        marginBottom="m"
        borderTopRightRadius={10}
        borderTopLeftRadius={10}
        borderBottomLeftRadius={sender_id !== id ? 0 : 10}
        borderBottomRightRadius={sender_id === id ? 0 : 10}
        alignSelf={sender_id === id ? "flex-end" : "flex-start"}
        padding="s"
        backgroundColor={
          sender_id === id
            ? "secondaryBackGroundColor"
            : isDarkMode
            ? "fadedButtonBgColor"
            : "almostPrimaryGreen"
        }
      >
        {/* MODALS */}
        <DeleteMessageModal
          isVisisble={showDleteModal}
          onClose={() => setDeleteModal(false)}
          message_id={selectedMessage.id}
        />

        {/* {deleted_by === null && (
          <Box
            width="100%"
            alignItems="flex-end"
            alignContent="flex-end"
            marginBottom="m"
          >
            <Feather
              name={showDropdown ? "chevron-up" : "chevron-down"}
              onPress={() => setShowDropdown((prev) => !prev)}
              size={15}
              color={sender_id === id ? theme.colors.textColor : "black"}
            />
          </Box>
        )} */}

        {(deleted_by !== null && reactions !== null) ||
          (reactions !== undefined && reactions.length > 0 && (
            <Box
              zIndex={30}
              position="absolute"
              bottom={-25}
              right={0}
              width={35}
              height={35}
              paddingHorizontal="s"
              backgroundColor="secondaryBackGroundColor"
              borderRadius={20}
              elevation={5}
              justifyContent="center"
              alignContent="center"
            >
              {reactions.map((item, i) => (
                <CustomText key={i.toString()}>
                  {REACTIONS.filter((ite) => ite.name === item.type)[0]?.icon}
                </CustomText>
              ))}
            </Box>
          ))}

        {selectedMessageAction.selected &&
          selectedMessage.id === message_id && (
            <Box
              zIndex={30}
              position="absolute"
              top={30}
              left={0}
              width={200}
              height={30}
              paddingHorizontal="s"
              backgroundColor="secondaryBackGroundColor"
              borderRadius={10}
              elevation={5}
            >
              <ScrollView horizontal contentContainerStyle={{ width: "100%" }}>
                {REACTIONS.map((item, i) => (
                  <Pressable
                    onPress={() => mutate(item.name)}
                    style={{ flex: 1 }}
                    key={i.toString()}
                  >
                    <CustomText style={{ flex: 1 }}>{item.icon}</CustomText>
                  </Pressable>
                ))}
              </ScrollView>
            </Box>
          )}

        {showDropdown && (
          <Box
            zIndex={30}
            position="absolute"
            top={30}
            left={0}
            width={100}
            height={50}
            paddingHorizontal="s"
            backgroundColor="secondaryBackGroundColor"
            borderRadius={10}
            elevation={5}
          >
            <Pressable onPress={() => {}} style={{ flex: 1 }}>
              <CustomText variant="xs">React</CustomText>
            </Pressable>
            <Pressable
              onPress={() => {
                setDeleteModal(true);
              }}
              style={{ flex: 1 }}
            >
              <CustomText variant="xs">Delete</CustomText>
            </Pressable>
          </Box>
        )}

        {deleted_by === null && post_images.length > 0 && (
          <Box height={140}>
            <ScrollView horizontal>
              {post_images.length > 0 &&
                post_images.map((item, i) => (
                  <Pressable
                    onPress={() => openModal(post_images)}
                    style={{
                      width: 150,
                      maxHeight: 120,
                      overflow: "hidden",
                      borderRadius: 10,
                      marginRight: 20,
                    }}
                    key={i.toString()}
                  >
                    <Image
                      source={{ uri: `${IMAGE_BASE}${item.image_path}` }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  </Pressable>
                ))}
            </ScrollView>
          </Box>
        )}

        {deleted_by === null && post_files.length > 0 && (
          <Box maxHeight={70} marginBottom="s">
            <ScrollView horizontal>
              {post_files.length > 0 &&
                post_files.map((item, i) => (
                  <Pressable
                    style={{
                      overflow: "hidden",
                      borderRadius: 10,
                      marginRight: 20,
                      backgroundColor: theme.colors.mainBackGroundColor,
                      padding: 10,
                      flexDirection: "row",
                    }}
                    key={i.toString()}
                  >
                    <CustomText marginRight="m">{item.file_name}</CustomText>
                    <Feather
                      name="download-cloud"
                      size={25}
                      color={theme.colors.textColor}
                    />
                  </Pressable>
                ))}
            </ScrollView>
          </Box>
        )}

        {deleted_by === null && (
          <>
            <CustomText
              variant="body"
              fontSize={15}
              style={{
                color:
                  sender_id === id ? (isDarkMode ? "white" : "black") : "black",
              }}
              color={sender_id === id ? "white" : "black"}
            >
              {message}
            </CustomText>
            <Box flexDirection="row" alignItems="center" marginTop="s">
              <CustomText
                color="grey"
                textAlign={sender_id === id ? "right" : "left"}
                variant="xs"
                marginRight="s"
              >
                {moment(created_at).format("hh:mm a")}
              </CustomText>
              {sender_id === id ? (
                <Ionicons
                  name="checkmark-circle-sharp"
                  size={15}
                  color={theme.colors.primaryColor}
                />
              ) : (
                <Ionicons
                  name="checkmark-circle-outline"
                  size={15}
                  color={theme.colors.primaryColor}
                />
              )}
            </Box>
          </>
        )}

        {deleted_by !== null && (
          <>
            <CustomText
              variant="body"
              fontStyle="italic"
              style={{ fontStyle: "italic" }}
            >
              {message}
            </CustomText>
          </>
        )}
      </Box>
    </Pressable>
  );
};

export default MessageBubble;
