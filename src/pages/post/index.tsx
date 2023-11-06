import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React from "react";
import Box from "../../components/general/Box";
import Searchbar from "../../components/Searchbar";
import { useUtilState } from "../../states/util";
import CustomText from "../../components/general/CustomText";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/MainNavigation";
import httpService, { IMAGE_BASE } from "../../utils/httpService";
import { URLS } from "../../services/urls";
import SettingsHeader from "../../components/settings/Header";
import moment from "moment";
import { Ionicons, Feather, FontAwesome5 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { IPost } from "../../models/post";
import { Theme } from "../../theme";
import { useTheme } from "@shopify/restyle";
import { ScrollView } from "react-native-gesture-handler";
import { Video, ResizeMode } from "expo-av";
import CommentTextbox from "../../components/post/CommentTextbox";
import SingleCommentTextbox from "../../components/post/SinglePostCommentPage";
import { useModalState } from "../../states/modalState";
import useCheckLoggedInState from "../../hooks/useCheckLoggedInState";

const Post = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "post">) => {
  const { postId } = route.params;
  const theme = useTheme<Theme>();
  const { isLoggedIn } = useUtilState((state) => state);
  const { setAll: setModalState } = useModalState((state) => state);
  const [post, setPost] = React.useState<IPost | null>(null);
  const videoRef = React.useRef<Video>(null);
  const [comment, setComment] = React.useState("");
  const queryClient = useQueryClient();
  const { checkloggedInState } = useCheckLoggedInState();

  const { isLoading } = useQuery(
    ["getPostById", postId],
    () => httpService.get(`${URLS.GET_SINGLE_POST}/${postId}`),
    {
      onError: (error: any) => {
        alert(error.message);
      },
      onSuccess: (data) => {
        setPost(data.data.data);
      },
    }
  );

  const postComment = useMutation({
    mutationFn: (data: any) => httpService.post(`${URLS.POST_COMMENT}`, data),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: (data) => {
      alert("Comment posted");
      setComment("");
      queryClient.invalidateQueries([`getPost${postId}`]);
    },
  });

  const votepoll = useMutation({
    mutationFn: (data: any) => httpService.post(`${URLS.VOTE_POLL}`, data),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: (data) => {
      if (data.data.message) {
        alert(data.data.message);
        setPost((prev) => ({ ...prev, has_voted_poll: 1 }));
        return;
      }
      queryClient.invalidateQueries(["getPostById", postId]);
    },
  });

  // functions
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleComment = React.useCallback(() => {
    if (comment.length < 1) {
      alert("Please enter a comment");
      return;
    }
    postComment.mutate({
      post_id: postId,
      comment,
    });
  }, [comment]);

  const openGallery = () => {
    const allVideoAndImage = [...post.post_images, ...post.post_videos];
    let theData = allVideoAndImage.map((item) => ({
      type: item.type,
      uri: `${IMAGE_BASE}${item.image_path || item.video_path}`,
    }));
    setModalState({
      showImageVideoSlider: true,
      imageVideoSliderData: [...theData],
    });
  };

  const getDate = () => {
    const today = moment();
    const targetData = moment(post?.created_at).add(
      post?.poll_duration,
      "days"
    );
    const daysToGo = targetData.diff(today, "days");
    return daysToGo;
  };

  const vote = (poll_id: number) => {
    const check = checkloggedInState();
    if (check) {
      const obj = {
        post_id: post.id,
        post_poll_id: poll_id,
      };
      votepoll.mutate(obj);
    }
  };

  if (isLoading) {
    return (
      <Box
        backgroundColor="mainBackGroundColor"
        flex={1}
        justifyContent="center"
        alignItems="center"
      >
        <ActivityIndicator color={theme.colors.primaryColor} size="large" />
      </Box>
    );
  }
  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <SettingsHeader
        title="Post"
        showSave={false}
        handleArrowPressed={handleBackPress}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 10000 }}>
        <Box flex={1}>
          {/* HEADER SECTION */}
          <Box
            flexDirection="row"
            height={100}
            justifyContent="space-between"
            alignItems="center"
            paddingHorizontal="m"
          >
            <Box flexDirection="row">
              <Box flexDirection="row">
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    borderWidth: 2,
                    borderColor: theme.colors.primaryColor,
                    backgroundColor: theme.colors.secondaryBackGroundColor,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={{ uri: `${IMAGE_BASE}${post?.user.profile_image}` }}
                    contentFit="contain"
                    style={{ width: "100%", height: "100%", borderRadius: 25 }}
                  />
                </View>

                <Box marginLeft="s" justifyContent="center">
                  <Box flexDirection="row">
                    <CustomText variant="body" color="black">
                      @{post?.user.username}{" "}
                    </CustomText>
                    <CustomText variant="body" color="grey"></CustomText>
                  </Box>
                  <CustomText variant="xs">
                    {moment(post?.created_at).fromNow()}
                  </CustomText>
                </Box>
              </Box>
            </Box>
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={theme.colors.textColor}
            />
          </Box>

          {/* CONTENT SECTION */}
          <ScrollView
            contentContainerStyle={{
              marginVertical: 20,
              flex: 1,
            }}
          >
            <Box paddingHorizontal="m">
              <CustomText variant="body" textAlign="left">
                {post?.description}
              </CustomText>
            </Box>

            {/* IMAGE OR VIDEO SECTION */}
            {(post?.post_images?.length > 0 ||
              post?.post_videos?.length > 0) && (
              <Pressable
                onPress={openGallery}
                style={{ marginTop: 8, height: 300, width: "100%" }}
              >
                {post.post_images.length > 0 && post.post_videos.length > 0 ? (
                  <Box
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {post.post_images.length > 0 ? (
                      <Image
                        source={{
                          uri: `${IMAGE_BASE}${post.post_images[0].image_path}`,
                        }}
                        contentFit="cover"
                        style={{
                          position: "relative",
                          width: "100%",
                          height: undefined,
                          paddingTop: "83%",
                        }}
                      />
                    ) : (
                      <>
                        <Video
                          source={{
                            uri: `${IMAGE_BASE}${post.post_videos[0].video_path}`,
                          }}
                          posterSource={{
                            uri: `${IMAGE_BASE}${post.post_videos[0].video_thumbnail}`,
                          }}
                          usePoster
                          resizeMode={ResizeMode.COVER}
                          useNativeControls
                          isLooping={false}
                          videoStyle={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 15,
                            backgroundColor: "grey",
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 0,
                            backgroundColor: "grey",
                          }}
                        />
                        <Box
                          style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FontAwesome5
                            name="play"
                            size={50}
                            color={theme.colors.whitesmoke}
                          />
                        </Box>
                      </>
                    )}

                    <Box
                      backgroundColor="mainBackGroundColor"
                      position="absolute"
                      width={80}
                      height={80}
                      alignItems="center"
                      justifyContent="center"
                      bottom={0}
                      right={0}
                    >
                      <CustomText variant="subheader">
                        {post.post_images.length + post.post_videos.length - 1}+
                      </CustomText>
                    </Box>
                  </Box>
                ) : (
                  <></>
                )}
              </Pressable>
            )}

            {/* Poll SECTION */}
            {post?.polls?.length > 0 && (
              <Box
                flexDirection="row"
                justifyContent="space-between"
                marginTop="m"
                paddingHorizontal="m"
                maxHeight={300}
                width={"100%"}
              >
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ width: "100%" }}
                >
                  {post?.polls.map((poll, index) => (
                    <Box
                      key={index.toString()}
                      width="100%"
                      height={45}
                      position="relative"
                      overflow="hidden"
                      borderRadius={25}
                      marginBottom="s"
                    >
                      {post?.has_voted_poll === 1 && (
                        <Box
                          position="absolute"
                          width={`${poll.vote_count}%`}
                          top={0}
                          height="100%"
                          zIndex={1}
                          backgroundColor="fadedButtonBgColor"
                        />
                      )}
                      <Pressable
                        onPress={() => vote(poll.id)}
                        style={{
                          zIndex: 2,
                          width: "100%",
                          height: 45,
                          borderRadius: 25,
                          borderWidth: 1,
                          borderColor: theme.colors.primaryColor,
                          paddingHorizontal: 20,
                          justifyContent: "center",
                          marginBottom: 10,
                        }}
                      >
                        <CustomText variant="body" color="primaryColor">
                          {poll.subject} ({poll.vote_count}%)
                        </CustomText>
                      </Pressable>
                    </Box>
                  ))}
                </ScrollView>
              </Box>
            )}

            {post?.polls?.length > 0 && (
              <CustomText marginLeft="m">
                {getDate() > 0 ? `${getDate()} days left` : "Final result"}{" "}
              </CustomText>
            )}
          </ScrollView>
        </Box>

        {/* COMMENT SECTIONS */}
        <SingleCommentTextbox postId={postId} />
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#ECF9EF",
    flexDirection: "row",
    paddingHorizontal: 5,
    borderRadius: 10,
    height: 45,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Post;
