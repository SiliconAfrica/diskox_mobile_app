import { useState, useRef, useCallback, useEffect } from "react";
import {
  Text,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";
import { useTheme } from "@shopify/restyle";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { IComment, IReply } from "../../models/comments";
import Box from "../general/Box";
import { useUtilState } from "../../states/util";
import { Theme } from "../../theme";
import CustomText from "../general/CustomText";
import httpService, { IMAGE_BASE } from "../../utils/httpService";
import { URLS } from "../../services/urls";
import useToast from "../../hooks/useToast";
import { useMutation, useQueryClient } from "react-query";
import mime from "mime";
import { Image } from "expo-image";

const EditReplyBox = ({
  reply,
  // edit,
  toggleEditing,
  showEmoji,
  setShowEmoji,
  editedReply,
  setEditedReply,
}: {
  reply: IReply;
  toggleEditing: () => void;
  showEmoji: boolean;
  setShowEmoji: any;
  editedReply: string;
  setEditedReply: any;
}) => {
  const theme = useTheme<Theme>();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isDarkMode } = useUtilState((state) => state);
  const TextinputtRef = useRef<TextInput>();
  const [focused, setFocused] = useState(false);
  //   const [showEmoji, setShowEmoji] = useState(false);
  const [images, setImages] = useState<Array<ImagePicker.ImagePickerAsset>>([]);
  const [prevImages, setPrevImages] = useState<Array<any>>([]);
  const [removedImages, setRemovedImages] = useState<Array<any>>([]);

  const handleTextChange = useCallback((coment: string) => {
    // do regex to gext mentioned users
    setEditedReply(coment);
  }, []);

  const handleEnterKeyPressed = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (e.nativeEvent.key === "enter") {
        // handleSubmit();
      }
    },
    []
  );

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: false,
    });

    if (!result.canceled) {
      const arr = [...images, result.assets[0]];
      setImages(arr);
      //   setShowComment(true);
    }
  }, []);
  const removeOldImage = (imgId) => {
    const filterPrevImages = prevImages.filter((img) => {
      return img.id !== imgId;
    });
    const theRemovedImages = prevImages.filter((img) => {
      return img.id === imgId;
    });
    setRemovedImages([...removedImages, theRemovedImages[0].id]);
    setPrevImages([...filterPrevImages]);
  };

  const removeSelectedImage = (imgUri) => {
    const filterImages = images.filter((img) => {
      return img.uri !== imgUri;
    });
    setImages([...filterImages]);
  };
  useEffect(() => {
    setEditedReply(reply.reply);
    setPrevImages([...reply.post_images]);
  }, []);

  const { mutate, isLoading: mutationLoading } = useMutation({
    mutationFn: (data: FormData) =>
      httpService.post(`${URLS.UPDATED_REPLY}/${reply.id}`, data),
    onSuccess: () => {
      toast.show("Reply updated successfully", { type: "success" });
      toggleEditing();
      queryClient.invalidateQueries(["getReplies"]);
      setImages([]);
      setEditedReply("");
    },
    onError: (error: any) => {
      toast.show(error.message, { type: "error" });
      toast.show("An error occured while trying to edit the reply", {
        type: "error",
      });
    },
  });

  const handleSubmit = useCallback(() => {
    if (mutationLoading) return;
    const formData = new FormData();
    formData.append("comment_id", reply.comment_id.toString() as any),
      formData.append("reply", editedReply);
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const name = images[i].uri.split("/").pop();
        const mimeType = mime.getType(images[i].uri);
        formData.append("reply_images[]", {
          uri: images[i].uri,
          type: mimeType,
          name,
        } as any);
      }
    }
    if (removedImages.length > 0) {
      for (let i = 0; i < removedImages.length; i++) {
        formData.append("removed_images[]", removedImages[i] as any);
      }
    }
    //formData.append('mentioned_users', [].toString())
    mutate(formData);
  }, [
    reply.id,
    mutationLoading,
    editedReply,
    images,
    prevImages,
    removedImages,
  ]);

  return (
    <Box justifyContent="center" marginVertical="m">
      <Box
        width="100%"
        height={70}
        marginTop="m"
        backgroundColor={
          isDarkMode ? "mainBackGroundColor" : "secondaryBackGroundColor"
        }
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="s"
        borderBottomWidth={1}
        borderBottomColor="secondaryBackGroundColor"
        position="relative"
        zIndex={5}
      >
        <Ionicons name="person" size={30} color={theme.colors.textColor} />
        <Box
          flex={0.9}
          alignItems="center"
          borderRadius={10}
          backgroundColor={
            isDarkMode ? "secondaryBackGroundColor" : "mainBackGroundColor"
          }
          height={50}
          flexDirection="row"
          paddingHorizontal="s"
          borderWidth={focused ? 1 : 0.5}
          borderColor={focused ? "primaryColor" : "black"}
        >
          <TextInput
            ref={TextinputtRef}
            value={editedReply}
            onChangeText={handleTextChange}
            onKeyPress={handleEnterKeyPressed}
            onFocus={() => {
              setFocused(true);
              // setShowComment(true);
            }}
            onBlur={() => setFocused(false)}
            placeholder="Leave a comment"
            placeholderTextColor={theme.colors.textColor}
            style={{
              flex: 1,
              fontFamily: "RedRegular",
              fontSize: 16,
              color: theme.colors.textColor,
            }}
          />

          <Feather
            name={"smile"}
            size={25}
            color={
              showEmoji ? theme.colors.primaryColor : theme.colors.textColor
            }
            style={{ marginRight: 10 }}
            onPress={() => setShowEmoji((prev) => !prev)}
          />
          <Feather
            name="image"
            size={25}
            color={theme.colors.textColor}
            onPress={pickImage}
          />
        </Box>
        {!mutationLoading && (
          <Feather
            name="send"
            size={25}
            onPress={() => handleSubmit()}
            color={theme.colors.textColor}
          />
        )}
        {mutationLoading && (
          <ActivityIndicator size="small" color={theme.colors.primaryColor} />
        )}
      </Box>
      {(prevImages.length > 0 || images.length > 0) && (
        <Box
          width="100%"
          height={60}
          backgroundColor={
            isDarkMode ? "mainBackGroundColor" : "secondaryBackGroundColor"
          }
          paddingHorizontal="xl"
        >
          <ScrollView
            horizontal
            style={{ flex: 1 }}
            contentContainerStyle={{ width: "80%", height: "100%" }}
          >
            {images.length > 0 &&
              images.map((item, i) => (
                <Pressable
                  key={i}
                  onPress={() => removeSelectedImage(item.uri)}
                >
                  <MaterialCommunityIcons
                    style={{
                      position: "absolute",
                      left: 15,
                      top: 15,
                      zIndex: 2,
                    }}
                    name="delete"
                    size={20}
                    color={theme.colors.white}
                  />
                  <Image
                    source={{
                      uri: item.uri,
                    }}
                    contentFit="cover"
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 5,
                      marginRight: 10,
                    }}
                  />
                </Pressable>
              ))}
            {prevImages.length > 0 &&
              prevImages.map((item, i) => (
                <Pressable key={i} onPress={() => removeOldImage(item.id)}>
                  <MaterialCommunityIcons
                    style={{
                      position: "absolute",
                      left: 15,
                      top: 15,
                      zIndex: 2,
                    }}
                    name="delete"
                    size={20}
                    color={theme.colors.white}
                  />
                  <Image
                    source={{
                      uri: `${IMAGE_BASE}${item.image_path}`,
                    }}
                    contentFit="cover"
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 5,
                      marginRight: 10,
                    }}
                  />
                </Pressable>
              ))}
          </ScrollView>
        </Box>
      )}
      <CustomText
        marginVertical="s"
        color="primaryColor"
        onPress={toggleEditing}
      >
        Cancel Editing
      </CustomText>
    </Box>
  );
};

export default EditReplyBox;
