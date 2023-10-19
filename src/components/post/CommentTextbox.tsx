import {
  View,
  Text,
  TextInput,
  Pressable,
  Dimensions,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import React from "react";
import { Theme } from "../../theme";
import Box from "../general/Box";

import { Ionicons, Feather } from "@expo/vector-icons";
import { useUtilState } from "../../states/util";
import { useTheme } from "@shopify/restyle";
import CustomText from "../general/CustomText";
import { Image } from "expo-image";
import { IUser } from "../../models/user";
import moment from "moment";
import httpService, { IMAGE_BASE } from "../../utils/httpService";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { useDetailsState } from "../../states/userState";
import { IComment } from "../../models/comments";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { URLS } from "../../services/urls";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import Emojipicker from "../general/emojipicker";
import Reply from "./Reply";
import useToast from "../../hooks/useToast";
// import EmojiSelector from 'react-native-emoji-selector'
// import EmojiModal from 'react-native-emoji-modal';

const WIDTH = Dimensions.get("screen").width;

const CommentBox = ({ comment }: { comment: IComment }) => {
  const {
    created_at,
    post_id,
    user: { name, profile_image },
  } = comment;
  const [showAll, setShowAll] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [showEmoji, setShowEmoji] = React.useState(false);
  const [reply, setReply] = React.useState("");
  const [images, setImages] = React.useState<
    Array<ImagePicker.ImagePickerAsset>
  >([]);
  const [showComments, setShowComment] = React.useState(false);
  const [isReply, setIsReply] = React.useState(false);
  const [comments, setComments] = React.useState<Array<IComment>>([]);
  const [commentsVisible, setCommentsVisible] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);

  const navigation = useNavigation<any>();
  const { id } = useDetailsState((state) => state);
  const { isDarkMode } = useUtilState((state) => state);
  const queryClient = useQueryClient();
  const TextinputtRef = React.useRef<TextInput>();

  const theme = useTheme<Theme>();

  //query
  const { isLoading } = useQuery(
    ["getReplies", comment.id],
    () => httpService.get(`${URLS.GET_REPLIES}/${comment.id}`),
    {
      onError: () => {},
      onSuccess: (data) => {
        console.log(data.data);
        if (data?.data) {
          setComments(data?.data?.data?.data || []);
        }
      },
    }
  );

  const { mutate, isLoading: mutationLoading } = useMutation({
    mutationFn: (data: FormData) =>
      httpService.post(`${URLS.CREATE_REPLY}`, data),
    onSuccess: () => {
      alert("coment created successfully");
      queryClient.invalidateQueries(["getReplies"]);
      setImages([]);
      setReply("");
    },
    onError: (error: any) => {
      alert("An error occured while rying to create the comment");
    },
  });

  const upvote = useMutation({
    mutationFn: () => httpService.post(`${URLS.UPVOTE_COMMENT}/${comment.id}`),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([`getPost${comment.id}`]);
    },
  });

  const downvote = useMutation({
    mutationFn: () =>
      httpService.post(`${URLS.DOWNVOTE_COMMENT}/${comment.id}`),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([`getPost`]);
    },
  });

  const deletereply = useMutation({
    mutationFn: () => httpService.post(`${URLS.DELETE_REPLY}/${comment.id}`),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([`getPost`]);
      setShowMenu(false);
    },
  });

  const handleTextChange = React.useCallback((coment: string) => {
    // do regex to gext mentioned users
    setReply(coment);
  }, []);

  const handleEnterKeyPressed = React.useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (e.nativeEvent.key === "enter") {
        // handleSubmit();
      }
    },
    []
  );

  const pickImage = React.useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: false,
    });

    if (!result.canceled) {
      const arr = [...images, result.assets[0]];
      setImages(arr);
      setShowComment(true);
    }
  }, []);

  const handleSubmit = React.useCallback(() => {
    if (mutationLoading) return;
    const formData = new FormData();
    formData.append("comment_id", comment.id.toString() as any),
      formData.append("reply", reply);
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
    //formData.append('mentioned_users', [].toString())
    mutate(formData);
  }, [comment.id, mutationLoading, reply, images]);

  return (
    <Box
      width="100%"
      flexDirection="column"
      borderBottomWidth={0.4}
      borderBottomColor="primaryColor"
      zIndex={5}
    >
      {/* HEADER SECTION */}
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingTop="m"
        zIndex={7}
      >
        <Box flexDirection="row">
          <Box flexDirection="row">
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                borderWidth: 2,
                borderColor: theme.colors.primaryColor,
                backgroundColor: theme.colors.secondaryBackGroundColor,
                overflow: "hidden",
              }}
            >
              <Image
                source={{ uri: `${IMAGE_BASE}${profile_image}` }}
                contentFit="contain"
                style={{ width: "100%", height: "100%", borderRadius: 25 }}
              />
            </View>

            <Box marginLeft="s" justifyContent="center">
              <Box flexDirection="row">
                <CustomText variant="body" color="black">
                  {name}{" "}
                </CustomText>
                <CustomText variant="body" color="grey"></CustomText>
              </Box>
              <CustomText
                variant="xs"
                onPress={() => navigation.navigate("post", { postId: post_id })}
              >
                {moment(created_at).fromNow()}
              </CustomText>
            </Box>
          </Box>
        </Box>
        <Box position="relative" zIndex={10}>
          <Ionicons
            name="ellipsis-vertical"
            size={20}
            color={theme.colors.textColor}
            onPress={() => setShowMenu((prev) => !prev)}
          />
          {showMenu && (
            <Box
              width={170}
              height={90}
              position="absolute"
              borderRadius={10}
              backgroundColor={
                isDarkMode ? "mainBackGroundColor" : "secondaryBackGroundColor"
              }
              right={0}
              top={20}
              zIndex={20}
            >
              {id === comment?.user.id && (
                <>
                  <Box
                    flex={1}
                    justifyContent="center"
                    paddingHorizontal="m"
                    borderBottomWidth={1}
                    borderBottomColor={"primaryColor"}
                  >
                    <Box flexDirection="row" width={"100%"} alignItems="center">
                      <Feather
                        name="edit-2"
                        size={20}
                        color={theme.colors.textColor}
                      />
                      <CustomText marginLeft="s">Edit comment</CustomText>
                    </Box>
                  </Box>

                  <Box
                    flex={1}
                    justifyContent="center"
                    paddingHorizontal="m"
                    borderBottomColor={"primaryColor"}
                  >
                    <Box flexDirection="row" width={"100%"} alignItems="center">
                      <Feather
                        name="trash-2"
                        size={20}
                        color={theme.colors.textColor}
                      />
                      <CustomText
                        marginLeft="s"
                        onPress={() => deletereply.mutate()}
                      >
                        Delete comment
                      </CustomText>
                    </Box>
                  </Box>
                </>
              )}
              {id !== comment?.user.id && (
                <>
                  <Box
                    flex={1}
                    justifyContent="center"
                    paddingHorizontal="m"
                    borderBottomWidth={1}
                    borderBottomColor={"primaryColor"}
                  >
                    <Box flexDirection="row" width={"100%"} alignItems="center">
                      <Feather
                        name="flag"
                        size={20}
                        color={theme.colors.textColor}
                      />
                      <CustomText marginLeft="s">Report</CustomText>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* CONTENT SECTION */}
      <Box paddingHorizontal="m" marginTop="s">
        <CustomText variant="body">
          {showAll
            ? comment?.comment
            : comment?.comment?.length > 100
            ? comment.comment?.substring(0, 100) + "..."
            : comment.comment}{" "}
          {comment.comment?.length > 100 && (
            <CustomText
              variant="body"
              color="primaryColor"
              onPress={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "Show Less" : "Read More"}
            </CustomText>
          )}{" "}
        </CustomText>

        {/* IMAGE OR VIDEO SECTION */}
        {comment?.post_images?.length > 0 && (
          <Box
            flexDirection="row"
            justifyContent="space-between"
            marginTop="m"
            height={50}
            width={"100%"}
          >
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                height: "100%",
                width: "100%",
                paddingRight: 200,
                paddingTop: 5,
              }}
            >
              {comment?.post_images.length > 0 && (
                <>
                  {comment?.post_images.length === 1 &&
                    comment?.post_images.map((image, index) => (
                      <Image
                        key={index.toString()}
                        source={{ uri: `${IMAGE_BASE}/${image.image_path}` }}
                        contentFit="cover"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 5,
                          marginRight: 10,
                        }}
                      />
                    ))}
                  {comment?.post_images.length > 1 &&
                    comment?.post_images.map((image, i) => (
                      <Image
                        key={i.toString()}
                        source={{ uri: `${IMAGE_BASE}/${image.image_path}` }}
                        contentFit="cover"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 5,
                          marginRight: 10,
                        }}
                      />
                    ))}
                </>
              )}
            </ScrollView>
          </Box>
        )}
      </Box>

      {/* REACTION SECTION */}
      <Box width="100%" marginBottom="s" paddingHorizontal="m">
        {/* REACTIONS */}

        <Box flexDirection="row" width="100%" marginTop="m">
          {/* VOTING SECTION */}
          <Box flexDirection="row" alignItems="center">
            <Box
              width={130}
              flexDirection="row"
              height={40}
              borderRadius={20}
              borderWidth={1}
              borderColor={
                isDarkMode ? "mainBackGroundColor" : "secondaryBackGroundColor"
              }
            >
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 10,
                  flex: 0.7,
                }}
                onPress={() => upvote.mutate()}
              >
                {upvote.isLoading && (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.primaryColor}
                  />
                )}
                {!upvote.isLoading && (
                  <>
                    <Ionicons
                      name="arrow-up-outline"
                      size={20}
                      color={theme.colors.textColor}
                    />
                    <CustomText variant="xs">
                      {comment?.upvotes_count} Upvote
                    </CustomText>
                  </>
                )}
              </Pressable>
              <Pressable
                style={{
                  width: 15,
                  flex: 0.2,
                  height: "100%",
                  borderLeftWidth: 1,
                  borderLeftColor: isDarkMode
                    ? theme.colors.mainBackGroundColor
                    : theme.colors.secondaryBackGroundColor,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => downvote.mutate()}
              >
                {!downvote.isLoading && (
                  <Ionicons
                    name="arrow-down-outline"
                    size={20}
                    color={theme.colors.textColor}
                  />
                )}
                {downvote.isLoading && (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.primaryColor}
                  />
                )}
              </Pressable>
            </Box>
          </Box>

          <Pressable
            style={{
              width: 30,
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <Ionicons
              name="heart-outline"
              size={20}
              color={theme.colors.textColor}
            />
            <CustomText variant="body">{comment.reactions_count}</CustomText>
          </Pressable>

          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <CustomText
              variant="body"
              onPress={() => setCommentsVisible((prev) => !prev)}
            >
              {isReply ? "Close" : "Reply"}
            </CustomText>
          </Pressable>
        </Box>
      </Box>

      {/* VIEW BUTTON */}

      {!isLoading && comments.length > 0 && (
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 10,
            marginBottom: 10,
          }}
        >
          <CustomText
            variant="body"
            color="primaryColor"
            onPress={() => setCommentsVisible((prev) => !prev)}
          >
            {commentsVisible
              ? "close"
              : `View ${comments.length} ${
                  comments.length > 1 ? "replies" : "reply"
                }`}
          </CustomText>
        </Pressable>
      )}

      {/* COMMENT BOX */}

      {commentsVisible && (
        <>
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
              borderWidth={focused ? 1 : 0}
              borderColor={"primaryColor"}
            >
              <TextInput
                ref={TextinputtRef}
                value={reply}
                onChangeText={handleTextChange}
                onKeyPress={handleEnterKeyPressed}
                onFocus={() => {
                  setFocused(true);
                  setShowComment(true);
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
              <ActivityIndicator
                size="small"
                color={theme.colors.primaryColor}
              />
            )}
          </Box>

          {showEmoji && (
            <Box
              width="100%"
              height={130}
              position="absolute"
              bottom={80}
              left={60}
              zIndex={10}
            >
              <Emojipicker
                onSelected={(emoji) => setReply((prev) => prev + " " + emoji)}
              />
            </Box>
          )}

          {commentsVisible && (
            <Box paddingLeft="m">
              {!isLoading &&
                comments.length > 0 &&
                comments.map((item, index) => (
                  <Reply comment={item} key={index.toString()} />
                ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

const CommentTextbox = ({ postId }: { postId: number }) => {
  const [focused, setFocused] = React.useState(false);
  const [comments, setComments] = React.useState<Array<IComment>>([]);
  const [comment, setComment] = React.useState("");
  const { isDarkMode } = useUtilState((state) => state);
  const { profile_image, created_at, id, name } = useDetailsState(
    (state) => state
  );
  const theme = useTheme<Theme>();
  const queryClient = useQueryClient();
  const [showComments, setShowComment] = React.useState(false);
  const [showEmoji, setShowEmoji] = React.useState(false);
  const TextinputtRef = React.useRef<TextInput>();
  const toast = useToast();

  const [images, setImages] = React.useState<
    Array<ImagePicker.ImagePickerAsset>
  >([]);

  const { isLoading } = useQuery(
    ["getComments", postId],
    () => httpService.get(`${URLS.GET_COMMENTS_BY_POST_ID}/${postId}`),
    {
      onError: (error) => {
        toast.show("An eror occured while getting the comments", {
          type: "error",
        });
      },
      onSuccess: (data) => {
        setComments(data.data.data.data);
      },
    }
  );

  const { mutate, isLoading: mutationLoading } = useMutation({
    mutationFn: (data: FormData) =>
      httpService.post(`${URLS.CREATE_COMMENT}`, data),
    onSuccess: () => {
      alert("coment created successfully");
      queryClient.invalidateQueries(["getComments"]);
      setImages([]);
      setComment("");
    },
    onError: (error: any) => {
      toast.show("An error occured while rying to create the comment", {
        type: "error",
      });
    },
  });

  React.useEffect(() => {
    const keyboardEvent = Keyboard.addListener("keyboardDidShow", () => {
      setShowEmoji(false);
    });

    const keyboardClosed = Keyboard.addListener("keyboardDidHide", () => {
      if (TextinputtRef.current !== null) {
        TextinputtRef.current.blur();
      }
    });
    return () => {
      keyboardEvent.remove();
      keyboardClosed.remove();
    };
  }, []);

  const handleTextChange = React.useCallback((coment: string) => {
    // do regex to gext mentioned users
    setComment(coment);
  }, []);

  const handleEnterKeyPressed = React.useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (e.nativeEvent.key === "enter") {
        handleSubmit();
      }
    },
    []
  );

  const handleSubmit = React.useCallback(() => {
    if (mutationLoading) return;
    const formData = new FormData();
    formData.append("post_id", postId.toString() as any),
      formData.append("comment", comment);
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const name = images[i].uri.split("/").pop();
        const mimeType = mime.getType(images[i].uri);
        formData.append("comment_images[]", {
          uri: images[i].uri,
          type: mimeType,
          name,
        } as any);
      }
    }
    //formData.append('mentioned_users', [].toString())

    mutate(formData);
  }, [comment, postId, mutationLoading]);

  const pickImage = React.useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: false,
    });

    if (!result.canceled) {
      const arr = [...images, result.assets[0]];
      setImages(arr);
      setShowComment(true);
    }
  }, []);
  return (
    <Box
      width="100%"
      backgroundColor={
        isDarkMode ? "secondaryBackGroundColor" : "mainBackGroundColor"
      }
    >
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
          borderWidth={focused ? 1 : 0}
          borderColor={"primaryColor"}
        >
          <TextInput
            ref={TextinputtRef}
            value={comment}
            onChangeText={handleTextChange}
            onKeyPress={handleEnterKeyPressed}
            onFocus={() => {
              setFocused(true);
              setShowComment(true);
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
      {showEmoji && (
        <Box width="100%" height={220}>
          <Emojipicker
            onSelected={(emoji) => setComment((prev) => prev + " " + emoji)}
          />
        </Box>
      )}
      {images.length > 0 && (
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
            {images.map((item, i) => (
              <Image
                source={{ uri: item.uri }}
                contentFit="cover"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 5,
                  marginRight: 10,
                }}
              />
            ))}
          </ScrollView>
        </Box>
      )}

      {showComments && (
        <Box padding="m">
          <Box
            width="100%"
            borderBottomWidth={0.2}
            borderBottomColor="primaryColor"
            height={30}
            flexDirection="row"
            justifyContent="space-between"
          >
            <Pressable style={{ flexDirection: "row", alignItems: "center" }}>
              <CustomText variant="xs">Latest comments</CustomText>
              <Feather
                name="chevron-down"
                size={20}
                onPress={() => handleSubmit()}
                color={theme.colors.textColor}
              />
            </Pressable>

            <Feather
              name="x"
              size={25}
              color={theme.colors.textColor}
              onPress={() => setShowComment(false)}
            />
          </Box>

          {comments.length > 0 && (
            <Box maxHeight={250}>
              <ScrollView>
                {comments.length > 0 &&
                  comments.map((item, index) => (
                    <CommentBox comment={item} key={index.toString()} />
                  ))}
              </ScrollView>
            </Box>
          )}
          {comments.length < 1 && (
            <CustomText marginTop="m">No comments yet.</CustomText>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CommentTextbox;
