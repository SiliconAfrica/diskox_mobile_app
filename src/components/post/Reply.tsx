import {
  View,
  Text,
  ActivityIndicator,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  TextInput,
  TextInputKeyPressEventData,
} from "react-native";
import React from "react";
import { IComment, IReply } from "../../models/comments";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useQueryClient, useQuery, useMutation } from "react-query";
import { URLS } from "../../services/urls";
import { useUtilState } from "../../states/util";
import httpService, { IMAGE_BASE } from "../../utils/httpService";
import Box from "../general/Box";
import CustomText from "../general/CustomText";
import { Theme } from "../../theme";
import { useTheme } from "@shopify/restyle";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import mime from "mime";
import { useDetailsState } from "../../states/userState";
import EditReplyBox from "./EditReplyBox";
import Emojipicker from "../general/emojipicker";

const Reply = ({
  comment: reply,
  isReply: ISREPLY = false,
}: {
  comment: IReply;
  isReply?: boolean;
}) => {
  const [showAll, setShowAll] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [showEmoji, setShowEmoji] = React.useState(false);
  // const [reply, setReply] = React.useState<IReply>(comment);
  const [images, setImages] = React.useState<
    Array<ImagePicker.ImagePickerAsset>
  >([]);
  const [showComments, setShowComment] = React.useState(false);
  const [showEditReply, setShowEditReply] = React.useState(false);
  const [editedReply, setEditedReply] = React.useState("");
  // const [isReply, setIsReply] = React.useState(false);
  const [isReply, setIsReply] = React.useState(ISREPLY);
  const [comments, setComments] = React.useState<Array<IComment>>([]);
  const [commentsVisible, setCommentsVisible] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const [text, setText] = React.useState("");

  const navigation = useNavigation<any>();
  const { isDarkMode } = useUtilState((state) => state);
  const { id } = useDetailsState((state) => state);
  const queryClient = useQueryClient();
  const TextinputtRef = React.useRef<TextInput>();

  const theme = useTheme<Theme>();
  const { isLoggedIn } = useUtilState((state) => state);
  const { profile_image: profilePic } = useDetailsState((state) => state);

  // const GetSingleReply = useQuery(
  //   [`getSingleReply-${comment.id}`, comment.id],
  //   () => httpService.get(`${URLS.GET_SINGLE_REPLY}/${comment.id}`),
  //   {
  //     onError: () => {},
  //     onSuccess: (data) => {
  //       if (data?.data) {
  //         setReply({...reply, ...data?.data?.data});
  //       }
  //     },
  //   }
  // );

  // //query
  // const { isLoading } = useQuery(
  //   [`getReplyReplies-${comment.id}`, comment.id],
  //   () => httpService.get(`${URLS.GET_REPLIES}/${comment.id}`),
  //   {
  //     enabled: isReply,
  //     onError: () => {},
  //     onSuccess: (data) => {
  //       if (data?.data) {
  //         setComments(data?.data?.data?.data || []);
  //       }
  //     },
  //   }
  // );

  const { mutate, isLoading: mutationLoading } = useMutation({
    mutationFn: (data: FormData) =>
      httpService.post(`${URLS.CREATE_REPLY}`, data),
    onSuccess: () => {
      alert("coment created successfully");
      queryClient.invalidateQueries([`getReplies-${reply.comment_id}`]);
      setImages([]);
      setText("");
    },
    onError: (error: any) => {
      alert("An error occured while rying to create the comment");
    },
  });

  const reacttocomment = useMutation({
    mutationFn: (data: FormData) =>
      httpService.post(`${URLS.REACT_TO_REPLY}`, data),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([`getReplies-${reply.comment_id}`]);
    },
  });

  const upvote = useMutation({
    mutationFn: () => httpService.post(`${URLS.UPVOTE_REPLY}/${reply.id}`),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([`getReplies-${reply.comment_id}`]);
    },
  });

  const downvote = useMutation({
    mutationFn: () => httpService.post(`${URLS.DOWNVOTE_REPLY}/${reply.id}`),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([`getReplies-${reply.comment_id}`]);
    },
  });
  const deletereply = useMutation({
    mutationFn: () => httpService.post(`${URLS.DELETE_REPLY}/${reply.id}`),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([`getReplies-${reply.comment_id}`]);
      setShowMenu(false);
    },
  });

  const handleReaction = () => {
    const formData = new FormData();
    formData.append("reply_id", reply.id.toString());
    formData.append("type", "like");

    reacttocomment.mutate(formData);
  };

  const handleTextChange = React.useCallback((coment: string) => {
    // do regex to gext mentioned users
    setText(coment);
  }, []);

  const handleEnterKeyPressed = React.useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (e.nativeEvent.key === "enter") {
        // handleSubmit();
      }
    },
    []
  );

  const toggleEditComment = () => {
    setShowEditReply((prev) => !prev);
    setShowMenu(false);
    setShowEmoji(false);
  };

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
    formData.append("comment_id", reply.comment_id.toString() as any),
      formData.append("reply", text);
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
  }, [reply.comment_id, mutationLoading, text, images]);

  return (
    <>
      {showEditReply ? (
        <>
          <EditReplyBox
            reply={reply}
            toggleEditing={toggleEditComment}
            showEmoji={showEmoji}
            setShowEmoji={setShowEmoji}
            editedReply={editedReply}
            setEditedReply={setEditedReply}
          />
          {showEmoji && (
            <Box
              width="100%"
              height={130}
              position="absolute"
              top={100}
              left={0}
              zIndex={10}
            >
              <Emojipicker
                onSelected={(emoji) =>
                  setEditedReply((prev) => prev + " " + emoji)
                }
              />
            </Box>
          )}
        </>
      ) : (
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
            zIndex={10}
          >
            <Box flexDirection="row">
              <Box flexDirection="row">
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 17,
                    borderWidth: 2,
                    borderColor: theme.colors.primaryColor,
                    backgroundColor: theme.colors.secondaryBackGroundColor,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={{
                      uri: `${IMAGE_BASE}${reply?.user?.profile_image}`,
                    }}
                    contentFit="contain"
                    style={{ width: "100%", height: "100%", borderRadius: 25 }}
                  />
                </View>

                <Box marginLeft="s" justifyContent="center">
                  <Box flexDirection="row">
                    <CustomText variant="body" color="black">
                      {reply?.user.name}{" "}
                    </CustomText>
                    <CustomText variant="body" color="grey">
                      @{reply?.user?.username}
                    </CustomText>
                  </Box>
                  <CustomText
                    variant="xs"
                    onPress={() =>
                      navigation.navigate("post", { postId: reply.post_id })
                    }
                  >
                    {moment(reply?.created_at).fromNow()}
                  </CustomText>
                </Box>
              </Box>
            </Box>
            <Box position="relative">
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
                    isDarkMode
                      ? "mainBackGroundColor"
                      : "secondaryBackGroundColor"
                  }
                  right={0}
                  top={20}
                  zIndex={20}
                >
                  {/* MENU SECTION */}
                  {id === reply?.user.id && (
                    <>
                      <Box
                        flex={1}
                        justifyContent="center"
                        paddingHorizontal="m"
                        borderBottomWidth={1}
                        borderBottomColor={"primaryColor"}
                      >
                        <Box
                          flexDirection="row"
                          width={"100%"}
                          alignItems="center"
                        >
                          <Feather
                            name="edit-2"
                            size={20}
                            color={theme.colors.textColor}
                          />
                          <CustomText
                            marginLeft="s"
                            onPress={toggleEditComment}
                          >
                            Edit reply
                          </CustomText>
                        </Box>
                      </Box>

                      <Box
                        flex={1}
                        justifyContent="center"
                        paddingHorizontal="m"
                        borderBottomColor={"primaryColor"}
                      >
                        <Box
                          flexDirection="row"
                          width={"100%"}
                          alignItems="center"
                        >
                          <Feather
                            name="trash-2"
                            size={20}
                            color={theme.colors.textColor}
                          />
                          <CustomText
                            marginLeft="s"
                            onPress={() => deletereply.mutate()}
                          >
                            Delete reply
                          </CustomText>
                        </Box>
                      </Box>
                    </>
                  )}
                  {id !== reply?.user.id && (
                    <>
                      <Box
                        flex={1}
                        justifyContent="center"
                        paddingHorizontal="m"
                        borderBottomWidth={1}
                        borderBottomColor={"primaryColor"}
                      >
                        <Box
                          flexDirection="row"
                          width={"100%"}
                          alignItems="center"
                        >
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
              <CustomText color="primaryColor">
                @{reply?.user?.username}
              </CustomText>
              {showAll
                ? reply?.reply
                : reply?.reply?.length > 100
                ? reply.reply?.substring(0, 100) + "..."
                : reply.reply}{" "}
              {reply.reply?.length > 100 && (
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
            {reply?.post_images?.length > 0 && (
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
                  {reply?.post_images.length > 0 && (
                    <>
                      {reply?.post_images.length === 1 &&
                        reply?.post_images.map((image, index) => (
                          <Image
                            key={index.toString()}
                            source={{
                              uri: `${IMAGE_BASE}/${image.image_path}`,
                            }}
                            contentFit="cover"
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 5,
                              marginRight: 10,
                            }}
                          />
                        ))}
                      {reply?.post_images.length > 1 &&
                        reply?.post_images.map((image, i) => (
                          <Image
                            key={i.toString()}
                            source={{
                              uri: `${IMAGE_BASE}/${image.image_path}`,
                            }}
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
                    isDarkMode
                      ? "mainBackGroundColor"
                      : "secondaryBackGroundColor"
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
                        {reply.has_upvoted === 0 && (
                          <Image
                            source={require("../../../assets/images/arrows/up.png")}
                            style={{ width: 20, height: 20 }}
                            contentFit="cover"
                          />
                        )}
                        {reply.has_upvoted === 1 && (
                          <Image
                            source={require("../../../assets/images/arrows/upfilled.png")}
                            style={{ width: 20, height: 20 }}
                            contentFit="cover"
                          />
                        )}

                        <CustomText variant="xs">
                          {reply?.upvotes_count} Upvote
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
                      <>
                        {reply.has_downvoted === 0 && (
                          <Image
                            source={require("../../../assets/images/arrows/down.png")}
                            style={{ width: 20, height: 20 }}
                            contentFit="cover"
                          />
                        )}
                        {reply.has_downvoted === 1 && (
                          <Image
                            source={require("../../../assets/images/arrows/downfilled.png")}
                            style={{ width: 20, height: 20 }}
                            contentFit="cover"
                          />
                        )}
                      </>
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
                onPress={handleReaction}
              >
                <Ionicons
                  name="heart-outline"
                  size={20}
                  color={
                    reply.has_reacted.length > 0
                      ? theme.colors.primaryColor
                      : theme.colors.textColor
                  }
                />
                <CustomText variant="body">{reply.reactions_count}</CustomText>
              </Pressable>

              {/* <Pressable
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
          </Pressable> */}
            </Box>
          </Box>

          {/* VIEW BUTTON */}

          {/* {!isLoading && comments.length > 0 && (
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
      )} */}

          {/* COMMENT BOX */}

          {commentsVisible && (
            <>
              <Box
                width="100%"
                height={70}
                marginTop="m"
                backgroundColor={
                  isDarkMode
                    ? "mainBackGroundColor"
                    : "secondaryBackGroundColor"
                }
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                paddingHorizontal="s"
                borderBottomWidth={1}
                borderBottomColor="secondaryBackGroundColor"
              >
                {isLoggedIn && (
                  <Box
                    width={32}
                    height={32}
                    borderRadius={17}
                    overflow="hidden"
                  >
                    <Image
                      source={{ uri: `${IMAGE_BASE}${profilePic}` }}
                      contentFit="cover"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 17,
                      }}
                    />
                  </Box>
                )}
                {!isLoggedIn && (
                  <Ionicons
                    name="person"
                    size={30}
                    color={theme.colors.textColor}
                  />
                )}

                <Box
                  flex={0.9}
                  alignItems="center"
                  borderRadius={10}
                  backgroundColor={
                    isDarkMode
                      ? "secondaryBackGroundColor"
                      : "mainBackGroundColor"
                  }
                  height={44}
                  flexDirection="row"
                  paddingHorizontal="s"
                  borderWidth={focused ? 1 : 0}
                  borderColor={"primaryColor"}
                >
                  <TextInput
                    ref={TextinputtRef}
                    value={text}
                    onChangeText={handleTextChange}
                    onKeyPress={handleEnterKeyPressed}
                    onFocus={() => {
                      setFocused(true);
                      setShowComment(true);
                    }}
                    onBlur={() => setFocused(false)}
                    placeholder={`Reply to @${reply.user.username}`}
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
                      showEmoji
                        ? theme.colors.primaryColor
                        : theme.colors.textColor
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

              {/* {isReply && commentsVisible && (
            <Box paddingLeft="m">
              {!isLoading &&
                comments.length > 0 &&
                comments.map((item, index) => (
                  <Reply comment={item} key={index.toString()} isReply />
                ))}
            </Box>
          )} */}
            </>
          )}
        </Box>
      )}
    </>
  );
};

export default Reply;
