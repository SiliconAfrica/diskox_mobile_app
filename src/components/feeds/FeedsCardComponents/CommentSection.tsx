import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import React from "react";
import Box from "../../general/Box";
import { FlatList, TextInput } from "react-native-gesture-handler";
import CustomButton from "../../general/CustomButton";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../../theme";
import { Ionicons } from "@expo/vector-icons";
import {
  ImagePickerAsset,
  launchImageLibraryAsync,
  MediaTypeOptions,
  UIImagePickerPresentationStyle,
} from "expo-image-picker";
import { Image } from "expo-image";
import ImageBox from "./ImageBox";
import CommentTextBox from "./CommentTextBox";
import CommentCard from "./CommentCard";
import { useMutation, useQuery, useQueryClient } from "react-query";
import httpService from "../../../utils/httpService";
import { URLS } from "../../../services/urls";
import useToast from "../../../hooks/useToast";
import { IComment } from "../../../models/comments";
import CustomText from "../../general/CustomText";
import useCheckLoggedInState from "../../../hooks/useCheckLoggedInState";
import mime from "mime";
import { PaginatedResponse } from "../../../models/PaginatedResponse";
import { CUSTOM_STATUS_CODE } from "../../../enums/CustomCodes";
import _ from "lodash";
import { useCommentMentionState } from "../commentState";

const CommentSection = ({ postId }: { postId?: number }) => {
  const theme = useTheme<Theme>();
  const [images, setImages] = React.useState<ImagePickerAsset[]>([]);
  const [text, setText] = React.useState("");
  const [comments, setComments] = React.useState<Array<IComment>>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [ids, setIds] = React.useState<number[]>([]);
  const [perPage, setPerPage] = React.useState(0);
  const [noMore, setNoMore] = React.useState(false);

  const toast = useToast();
  const queryClient = useQueryClient();
  const { checkloggedInState } = useCheckLoggedInState();
  const { users, selectedUsers, reset } = useCommentMentionState(
    (state) => state
  );

  //queries

  const paginationMutation = useMutation({
    mutationFn: (data: string) =>
      httpService.get(`${URLS.GET_COMMENTS_BY_POST_ID}/${postId}`, {
        params: {
          page: currentPage,
        },
      }),
    onSuccess: (data) => {
      const item: PaginatedResponse<IComment> = data.data;
      if (item.code === CUSTOM_STATUS_CODE.SUCCESS) {
        if (comments.length > 0) {
          if (item.data?.data.length !== 0) {
            const uniqArr = _.uniqBy<IComment>(
              [...comments, ...item.data.data],
              "id"
            );
            setComments(uniqArr);
          } else {
            setNoMore(true);
          }
        }
      }
    },
  });

  const { isLoading } = useQuery(
    [`getPostComments-${postId}`, postId],
    () =>
      httpService.get(`${URLS.GET_COMMENTS_BY_POST_ID}/${postId}`, {
        params: {
          page: 1,
        },
      }),
    {
      onError: (error) => {
        toast.show("An eror occured while getting the comments", {
          type: "error",
        });
      },
      onSuccess: (data) => {
        const item: PaginatedResponse<IComment> = data.data;
        if (item.code === CUSTOM_STATUS_CODE.SUCCESS) {
          if (comments.length > 0) {
            if (item.data?.data.length !== 0) {
              const uniqArr = _.uniqBy<IComment>(
                [...item.data.data, ...comments],
                "id"
              );
              setComments([...uniqArr]);
            } else {
              setNoMore(true);
              //toast.show(data.data?.message, { type: 'success'});
            }
          } else {
            setComments(item.data.data);
            setTotal(item.data.total);
            setPerPage(item.data.per_page);
          }
        }
        // setComments(data.data.data.data);
      },
    }
  );

  const { mutate, isLoading: mutationLoading } = useMutation({
    mutationFn: (data: FormData) =>
      httpService.post(`${URLS.CREATE_COMMENT}`, data),
    onSuccess: () => {
      toast.show("Comment created successfully", { type: "success" });
      queryClient.invalidateQueries([`getPostComments-${postId}`]);
      queryClient.invalidateQueries([`getPost${postId}`]);
      setImages([]);
      setText("");
      reset();
    },
    onError: (error: any) => {
      toast.show("An error occured while rying to create the comment", {
        type: "error",
      });
    },
  });

  const handleTextChange = React.useCallback(
    (coment: string) => {
      // do regex to gext mentioned users
      const check = checkloggedInState();
      if (check) {
        setText(coment);
      }
    },
    [checkloggedInState]
  );

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
    formData.append("post_id", postId.toString() as any);
    const newText = text.replace(/@\[([^\]]*)\]\(\)/g, "@$1");
    formData.append("comment", newText);
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

          //formData.append('mentioned_users', user.id.toString())
          return user.id;
        }
      });
    });

    formData.append("mentioned_users[]", userIds as any);
    mutate(formData);
  }, [text, postId, mutationLoading]);

  const handleImagePicked = (image: ImagePickerAsset) => {
    if (images.length > 0) {
      return;
    } else {
      setImages((prevImages) => [...prevImages, image]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((item, i) => i !== index);
    setImages(newImages);
  };

  const onEndReached = React.useCallback(async () => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage - 1, total - 1);
    if (
      currentPage < endIndex &&
      comments.length > 0 &&
      noMore === false &&
      !isLoading
    ) {
      // markasViewed.mutate({ posts_id: ids });
      setCurrentPage((prev) => prev + 1);
      paginationMutation.mutate(currentPage.toString());
    }
  }, [currentPage, ids, perPage, total, noMore, isLoading]);

  return (
    <Box
      width="100%"
      minHeight={50}
      bg="mainBackGroundColor"
      position="relative"
    >
      <Box
        flex={1}
        maxHeight={600}
        paddingTop="s"
        borderTopWidth={0}
        marginHorizontal="m"
      >
        <FlatList
          // extraData={comments}
          ListEmptyComponent={() => (
            <>
              {!isLoading ||
                (!paginationMutation.isLoading && (
                  <Box
                    width={"100%"}
                    height={32}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <CustomText variant="subheader" fontSize={14}>
                      No comment. Be the first to comment on this post
                    </CustomText>
                  </Box>
                ))}
            </>
          )}
          ListFooterComponent={() => (
            <>
              {paginationMutation.isLoading && comments.length < 1 && (
                <Box
                  width={"100%"}
                  height={"100%"}
                  justifyContent="center"
                  alignItems="center"
                >
                  <ActivityIndicator
                    size={"large"}
                    color={theme.colors.primaryColor}
                  />
                </Box>
              )}
            </>
          )}
          onEndReachedThreshold={0.5}
          data={comments}
          // keyExtractor={(_, index) => index.toString()}
          keyExtractor={(_, index) => _.id.toString()}
          onEndReached={onEndReached}
          renderItem={({ item }) => <CommentCard comment={item} />}
        />
      </Box>

      <Box
        width="100%"
        minHeight={90}
        bg="mainBackGroundColor"
        overflow="visible"
        elevation={4}
        borderTopWidth={0.5}
        borderTopColor="borderColor"
        paddingVertical="s"
        paddingHorizontal="m"
      >
        {images.length > 0 && (
          <Box width="100%" height={90}>
            <ScrollView
              style={{ width: "100%", flex: 1 }}
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
          onSubmit={() => handleSubmit()}
          isLoading={mutationLoading}
          text={text}
          onTextChange={(e) => handleTextChange(e)}
          onImagePicked={handleImagePicked}
        />
      </Box>
    </Box>
  );
};

export default CommentSection;
