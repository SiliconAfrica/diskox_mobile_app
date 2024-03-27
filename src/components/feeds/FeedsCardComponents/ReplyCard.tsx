import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React from "react";
import Box from "../../general/Box";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../../theme";
import CustomText from "../../general/CustomText";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { Heart, Message } from "iconsax-react-native";
import CommentTextBox from "./CommentTextBox";
import { ImagePickerAsset } from "expo-image-picker";
import { IReply } from "../../../models/comments";
import httpService, { IMAGE_BASE } from "../../../utils/httpService";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { URLS } from "../../../services/urls";
import useToast from "../../../hooks/useToast";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import ImageBox from "./ImageBox";
import mime from "mime";
import EmojiSelector from "react-native-emoji-selector";
import { useDetailsState } from "../../../states/userState";
import { useModalState } from "../../../states/modalState";
import {PaginatedResponse} from "../../../models/PaginatedResponse";
import {CUSTOM_STATUS_CODE} from "../../../enums/CustomCodes";
import {TouchableOpacity} from "react-native-gesture-handler";
import {useCommentMentionState} from "../commentState";

const ReplyCard = ({ comment: activeComment, showReply = true }: { comment: IReply, showReply?: boolean }) => {
  const [reply, setReply] = React.useState(false);
  const [text, setText] = React.useState("");
  const [comment, setComment] = React.useState(activeComment);
  const [images, setImages] = React.useState<ImagePickerAsset[]>([]);
  const [showMenu, setShowMenu] = React.useState(false);
  const [editingMode, setEditingMode] = React.useState(false);
  const [removedImages, setRemovedImages] = React.useState<string[]>([]);
  const [editedImage, setEditedImage] = React.useState<ImagePickerAsset[]>([]);
  const [editImage, setEditImage] = React.useState<string[]>([]);
  const [editComment, setEditComment] = React.useState("");
  const [newImage, setNewImage] = React.useState<ImagePickerAsset[]>([]);
  const [replies, setReplies] = React.useState<IReply[]>([]);

  const { users, selectedUsers, reset } = useCommentMentionState(
      (state) => state
  );

  const { setAll } = useModalState((state) => state);

  const getReplies = useQuery(
      [`getReplies-${activeComment.id}`, comment.id],
      () => httpService.get(`${URLS.GET_REPLIES}/${comment.id}`),
      {
        onSuccess: (data) => {
          const item: PaginatedResponse<IReply> = data.data;
          if (item.code === CUSTOM_STATUS_CODE.SUCCESS) {
            setReplies(item.data.data);
          }
        },
      }
  );

  const toast = useToast();
  const queryClient = useQueryClient();
  const { id } = useDetailsState((state) => state);

  // get reply
  const getReply = useQuery(
    [`getSingleReply-${comment.id}`, comment.id],
    () => httpService.get(`${URLS.GET_SINGLE_REPLY}/${comment.id}`),
    {
      onSuccess: (data) => {
        if (data.data?.data?.reply) {
          setComment({ ...comment, reply: data.data?.data.reply });
        }
      },
      onError: (error) => {},
    }
  );

  //mutations

  const upvote = useMutation({
    mutationFn: () => httpService.post(`${URLS.UPVOTE_COMMENT}/${comment.id}`),
    onError: (error: any) => {
      toast.show(error?.message, { type: "error" });
    },
    onSuccess: (data) => {
      const obj: IReply =
        comment.has_downvoted === 1
          ? {
              ...comment,
              has_upvoted: comment.has_upvoted === 0 ? 1 : 0,
              upvotes_count:
                comment.has_upvoted === 1
                  ? comment.upvotes_count - 1
                  : comment.upvotes_count + 1,
              has_downvoted: 0,
            }
          : {
              ...comment,
              has_upvoted: comment.has_upvoted === 0 ? 1 : 0,
              upvotes_count:
                comment.has_upvoted === 1
                  ? comment.upvotes_count - 1
                  : comment.upvotes_count + 1,
            };
      setComment(obj);
      queryClient.invalidateQueries([`getComments-${comment.post_id}`]);
    },
  });

  const downvote = useMutation({
    mutationFn: () =>
      httpService.post(`${URLS.DOWNVOTE_COMMENT}/${comment.id}`),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: (data) => {
      const obj: IReply =
        comment.has_upvoted === 1
          ? {
              ...comment,
              has_downvoted: comment.has_downvoted === 0 ? 1 : 0,
              has_upvoted: 0,
            }
          : {
              ...comment,
              has_downvoted: comment.has_downvoted === 0 ? 1 : 0,
            };
      setComment(obj);
      queryClient.invalidateQueries([`getComments-${comment.post_id}`]);
    },
  });

  const reacttocomment = useMutation({
    mutationFn: (data: FormData) =>
      httpService.post(`${URLS.REACT_TO_REPLY}`, data),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: (data) => {
      const obj: IReply = {
        ...comment,
        has_reacted: comment.has_reacted.length > 0 ? [] : [1],
      };
      setComment(obj);
      queryClient.invalidateQueries([`getReplies-${comment.comment_id}`]);
    },
  });
  const deleteReply = useMutation({
    mutationFn: () =>
      httpService.post(`${URLS.DELETE_REPLY}/${comment.id}`, {}),
    onError: (error: any) => {
      toast.show("Something went wrong while updating your comment", {
        type: "error",
      });
    },
    onSuccess: (data) => {
      toast.show("Comment deleted successfully", { type: "success" });
      queryClient.invalidateQueries([
        `getReplies-${comment.comment_id}`,
        comment.comment_id,
      ]);
      queryClient.invalidateQueries([`getSingleReply-${comment.id}`]);
      setShowMenu(false);
    },
  });

  const updateComment = useMutation({
    mutationFn: (data: FormData) =>
      httpService.post(`${URLS.UPDATED_REPLY}/${comment.id}`, data),
    onError: (error: any) => {},
    onSuccess: (data) => {
      toast.show("Comment updated successfully", { type: "success" });
      queryClient.invalidateQueries([`getReplies-${comment.comment_id}`]);
      queryClient.invalidateQueries([`getSingleReply-${comment.id}`]);
      setText(editComment);
      if (removedImages.length > 0) {
        setNewImage(editedImage);
      }
      setEditingMode(false);
      setShowMenu(false);
    },
  });

  const createReply = useMutation({
    mutationFn: (data: FormData) =>
      httpService.post(`${URLS.CREATE_REPLY}`, data),
    onError: (error: any) => {
      toast.show(
        "Something went wrong when trying to create your reply, try again",
        { type: "error" }
      );
    },
    onSuccess: (data) => {
      toast.show("Comment updated successfully", { type: "success" });
      queryClient.invalidateQueries([`getReplies-${comment.comment_id}`]);
      setText(editComment);
      if (removedImages.length > 0) {
        setNewImage(editedImage);
      }
      setEditingMode(false);
      setShowMenu(false);
    },
  });


  const handleSubmit = React.useCallback(() => {
    if (createReply.isLoading) return;
    const formData = new FormData();
    formData.append("comment_id", comment.id as any);
    const newText = text.replace(/@\[([^\]]*)\]\(\)/g, "@$1");
    formData.append("comment", newText);
    formData.append("reply", newText);
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

    const regex = /@\[\w+/g;
    const mentionss = text.match(regex) || [];
    const userIds: number[] = [];
    mentionss.forEach((item) => {
      const newItem = item.replace("[", "");

      const user = selectedUsers.map((user) => {
        if (
            user.name.toLowerCase().includes(newItem.toLowerCase().substring(1))
        ) {
          userIds.push(user.id);
          return user.id;
        }
      });
    });
    formData.append("mentioned_users[]", userIds as any);
    createReply.mutate(formData);
  }, [text, comment, createReply]);

  const handleReaction = () => {
    const formData = new FormData();
    formData.append("reply_id", comment.id.toString());
    formData.append("type", "like");

    reacttocomment.mutate(formData);
  };

  const handleImagePicked = (image: ImagePickerAsset) => {
    if (images.length > 0) {
      toast.show("Cannot pick more than one image", {
        type: "warning",
        placement: "top",
        style: { marginTop: 30 },
      });
      return;
    } else {
      setImages((prevImages) => [...prevImages, image]);
    }
  };

  const handleEditImagePicked = (image: ImagePickerAsset) => {
    if (editedImage.length > 0) {
      toast.show("Cannot pick more than one image", {
        type: "warning",
        placement: "top",
        style: { marginTop: 30 },
      });
      return;
    } else {
      setEditedImage((prevImages) => [image]);
    }
  };

  const theme = useTheme<Theme>();

  const removeImage = (index: number) => {
    const newImages = images.filter((item, i) => i !== index);
    setImages(newImages);
  };

  // for images that are already with the coment
  const removeEditImage = (index: number) => {
    const newImages = editImage.filter((item, i) => i === index);
    setRemovedImages([...newImages]);
  };

  const removeEditedImage = (index: number) => {
    const newImages = editedImage.filter((item, i) => i !== index);
    setEditedImage([...newImages]);
  };

  const editMode = () => {
    if (editingMode) {
      setEditingMode(false);
    } else {
      setEditComment(activeComment.reply);
      setEditImage(activeComment.post_images.map((item) => item.image_path));
      setEditingMode(true);
    }
  };

  const handleEditComment = () => {
    if (updateComment.isLoading) {
      return;
    }
    const formData = new FormData();

    formData.append("reply", editComment);
    formData.append("comment_id", comment.comment_id.toString());
    if (editedImage.length > 0) {
      formData.append("reply_images[]", {
        name: editedImage[0].fileName,
        type: mime.getType(editedImage[0].uri),
        uri: editedImage[0].uri,
      } as any);
    }
    if (removeEditImage.length > 0) {
      formData.append("removed_images[]", removeEditImage[0]);
    }

    updateComment.mutate(formData);
  };

  const handleReport = () => {
    setAll({ activeReply_id: activeComment.id, showReportReply: true });
  };

  return (
    <Box
      width="100%"
      borderBottomWidth={0.5}
      borderBottomColor="grey"
      marginBottom="m"
      // height={150}
    >
      {!editingMode && (
        <>
          {/* HEADER AND USER DETAILS SECTION */}
          <Box flexDirection="row" justifyContent="space-between">
            <Box flexDirection="row">
              <Box
                width={32}
                height={32}
                borderRadius={17}
                borderWidth={1}
                borderColor="primaryColor"
                overflow="hidden"
              >
                <Image
                  source={{
                    uri: `${IMAGE_BASE}${comment.user?.profile_image}`,
                  }}
                  contentFit="cover"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Box>
              <Box flexDirection="row">
                <CustomText variant="subheader" fontSize={15} marginLeft="s">
                  {comment.user.name === null
                    ? comment.user.name
                    : `@${comment.user.username}`}
                </CustomText>
                <CustomText variant="xs" color="lightGrey" marginLeft="s">
                  {moment(comment.created_at).startOf("hour").fromNow()}
                </CustomText>
              </Box>
            </Box>

            <Menu>
              <MenuTrigger>
                <Feather
                  name="more-vertical"
                  size={25}
                  color={theme.colors.textColor}
                />
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    backgroundColor: theme.colors.secondaryBackGroundColor,
                    padding: 5,
                    width: 120,
                  },
                }}
              >
                {id === activeComment.user.id && (
                  <MenuOption onSelect={() => editMode()}>
                    <CustomText variant="subheader" fontSize={14}>
                      Edit Post
                    </CustomText>
                  </MenuOption>
                )}

                {id === activeComment.user.id && (
                  <MenuOption onSelect={() => deleteReply.mutate()}>
                    {!deleteReply.isLoading && (
                      <CustomText variant="subheader" fontSize={14}>
                        Delete Post
                      </CustomText>
                    )}
                    {deleteReply.isLoading && (
                      <ActivityIndicator
                        color={theme.colors.textColor}
                        size={"small"}
                      />
                    )}
                  </MenuOption>
                )}

                {id !== activeComment.user.id && (
                  <MenuOption>
                    <CustomText
                      onPress={() => handleReport()}
                      variant="subheader"
                      fontSize={14}
                    >
                      Report
                    </CustomText>
                  </MenuOption>
                )}
              </MenuOptions>
            </Menu>
          </Box>

          <Box width={"100%"} paddingLeft="m" paddingBottom="s">
            {/* TEXT AND IMAGE SECTION */}
            <Box width={"100%"} paddingHorizontal="m">
              <CustomText variant="body" color="grey" fontSize={16}>
                {comment.reply}
              </CustomText>
            </Box>

            {/* generate random image of a dog */}
            {newImage.length < 1 && comment.post_images.length > 0 && (
              <Box width={"100%"} height={80} borderRadius={10}>
                <ScrollView
                  horizontal
                  contentContainerStyle={{ alignItems: "center" }}
                >
                  {comment.post_images.map((item, index) => (
                    <Image
                      key={index.toString()}
                      source={{ uri: `${IMAGE_BASE}${item.image_path}` }}
                      contentFit="cover"
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 10,
                        marginRight: 10,
                      }}
                    />
                  ))}
                </ScrollView>
              </Box>
            )}

            {newImage.length > 0 && (
              <Box width={"100%"} height={80} borderRadius={10}>
                <ScrollView
                  horizontal
                  contentContainerStyle={{ alignItems: "center" }}
                >
                  {newImage.map((item, index) => (
                    <Image
                      key={index.toString()}
                      source={{ uri: item.uri }}
                      contentFit="cover"
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 10,
                        marginRight: 10,
                      }}
                    />
                  ))}
                </ScrollView>
              </Box>
            )}

            {/* REACTION */}
            <Box width={"100%"} height={60} flexDirection="row" marginTop="m" borderBottomWidth={0.5} borderBottomColor={'lightGrey'}>
              {/* MAIN REACTION BOX */}
              <Box
                width={"40%"}
                height={32}
                flexDirection="row"
                borderRadius={20}
                borderWidth={0.5}
                borderColor="borderColor"
              >
                {/* UPVOTE */}
                <Pressable
                  style={{
                    width: "70%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    borderRightWidth: 0.5,
                    borderRightColor: theme.colors.lightGrey,
                  }}
                  onPress={() => upvote.mutate()}
                >
                  {upvote.isLoading && (
                    <ActivityIndicator
                      size={"small"}
                      color={theme.colors.primaryColor}
                    />
                  )}
                  {!upvote.isLoading && (
                    <>
                      <Image
                        source={
                          comment.has_upvoted === 0
                            ? require("../../../../assets/images/arrows/up.png")
                            : require("../../../../assets/images/arrows/upfilled.png")
                        }
                        contentFit="cover"
                        style={{ width: 20, height: 20 }}
                      />
                      <CustomText
                        variant="xs"
                        fontSize={12}
                        marginLeft="s"
                        color={
                          comment.has_upvoted === 0 ? "grey" : "primaryColor"
                        }
                      >
                        {comment.upvotes_count > 1 && comment.upvotes_count}{" "}
                        Upvote
                      </CustomText>
                    </>
                  )}
                </Pressable>

                {/* DOWNVOTE */}
                <Pressable
                  style={{
                    width: "30%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => downvote.mutate()}
                >
                  {downvote.isLoading && (
                    <ActivityIndicator
                      size={"small"}
                      color={theme.colors.primaryColor}
                    />
                  )}
                  {!downvote.isLoading && (
                    <Image
                      source={
                        comment.has_downvoted === 0
                          ? require("../../../../assets/images/arrows/down.png")
                          : require("../../../../assets/images/arrows/downfilled.png")
                      }
                      contentFit="cover"
                      style={{ width: 20, height: 20 }}
                    />
                  )}
                </Pressable>
              </Box>

              {/* REACTION LIKE, COMMENT AND SHARE SECTIOON */}
              <Box
                flex={1}
                width={"100%"}
                height={32}
                paddingLeft="m"
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                 <TouchableOpacity
                     onPress={() => handleReaction()}
                 >
                   <Heart
                       size={20}
                       color={
                         comment.has_reacted.length > 0
                             ? theme.colors.primaryColor
                             : theme.colors.lightGrey
                       }
                       variant={
                         comment.has_reacted.length > 0 ? "Bold" : "Outline"
                       }
                   />
                 </TouchableOpacity >
                  {comment.reactions_count > 0 && (
                    <TouchableOpacity
                        style={{ marginLeft: 8 }}
                        onPress={() => {
                      if (comment.reactions_count > 0) {
                        setAll({ reactionType: 'REPLY', reactionId: comment.id, showReactedUsers: true })
                    }}}>
                      <CustomText variant="body">
                        {comment.reactions_count}
                      </CustomText>
                    </TouchableOpacity>
                  )}
                </View>

                {showReply && <CustomText onPress={() => setReply(prev => !prev)} variant='body' marginLeft='m' color={reply ? 'primaryColor' : 'grey'}>Reply</CustomText>}
              </Box>
            </Box>

            {reply && (
              <Box width="100%" minHeight={50} maxHeight={400} marginTop={'m'}>
                <Box width={"100%"} maxHeight={300}>
                  {getReplies.isLoading && (
                      <Box
                          width={"100%"}
                          height={30}
                          justifyContent="center"
                          alignItems="center"
                      >
                        <ActivityIndicator
                            size={"small"}
                            color={theme.colors.primaryColor}
                        />
                      </Box>
                  )}
                  {!getReplies.isLoading && replies.length < 1 && (
                      <Box
                          width={"100%"}
                          height={30}
                          justifyContent="center"
                          alignItems="center"
                      >
                        <CustomText variant="subheader" fontSize={16}>
                          No replies
                        </CustomText>
                      </Box>
                  )}
                  {!getReplies.isLoading && replies.length > 0 && (
                      <ScrollView>
                        {replies.map((item, index) => (
                            <ReplyCard comment={item} key={index.toString()} showReply={false} />
                        ))}
                      </ScrollView>
                  )}
                </Box>
                {/* REPLY SECTIONS */}
                <Box flex={1}></Box>
                {images.length > 0 && (
                  <Box width="100%" height={90}>
                    <ScrollView
                      style={{ width: "100%" }}
                      contentContainerStyle={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      horizontal
                    >
                      {images.map((item, index) => (
                        <ImageBox
                          key={index.toString()}
                          type="LOCAL"
                          payload={item}
                          index={index}
                          onRemove={removeImage}
                        />
                      ))}
                    </ScrollView>
                  </Box>
                )}
                <CommentTextBox
                  buttonText="Reply"
                  onImagePicked={handleImagePicked}
                  onTextChange={(e) => setText(e)}
                  text={text}
                  isReply
                  username={comment.user.username}
                  onSubmit={handleSubmit}
                  isLoading={createReply.isLoading}
                />
              </Box>
            )}
          </Box>
        </>
      )}

      {/* IF EDITING MODE IS TRUE */}
      {editingMode && (
        <Box width="100%">
          {editImage.length > 0 && (
            <Box width="100%" height={90}>
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
                horizontal
              >
                {editImage.length > 0 &&
                  editImage.map((item, index) => (
                    <ImageBox
                      key={index.toString()}
                      type="FROM_URL"
                      uri={item}
                      index={index}
                      onRemove={removeEditImage}
                    />
                  ))}
              </ScrollView>
            </Box>
          )}

          {editedImage.length > 0 && (
            <Box width="100%" height={90}>
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
                horizontal
              >
                {editedImage.length > 0 &&
                  editedImage.map((item, index) => (
                    <ImageBox
                      key={index.toString()}
                      type="LOCAL"
                      payload={item}
                      index={index}
                      onRemove={removeEditedImage}
                    />
                  ))}
              </ScrollView>
            </Box>
          )}

          <CommentTextBox
            buttonText="Submit"
            isLoading={updateComment.isLoading}
            onImagePicked={handleEditImagePicked}
            onTextChange={(e) => setEditComment(e)}
            text={editComment}
            onSubmit={handleEditComment}
          />

          <Box
            width="100%"
            height={40}
            justifyContent="center"
            alignItems="flex-end"
          >
            <CustomText
              variant="subheader"
              fontSize={16}
              onPress={() => editMode()}
            >
              Cancel
            </CustomText>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ReplyCard;
