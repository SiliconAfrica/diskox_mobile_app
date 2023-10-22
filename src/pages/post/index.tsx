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
import { Ionicons, Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { IPost } from "../../models/post";
import { Theme } from "../../theme";
import { useTheme } from "@shopify/restyle";
import { ScrollView } from "react-native-gesture-handler";
import { Video, ResizeMode } from "expo-av";
import CommentTextbox from "../../components/post/CommentTextbox";
import SingleCommentTextbox from "../../components/post/SinglePostCommentPage";

const Post = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "post">) => {
  const { postId } = route.params;
  const theme = useTheme<Theme>();
  const { isLoggedIn } = useUtilState((state) => state);
  const [post, setPost] = React.useState<IPost | null>(null);
  const videoRef = React.useRef<Video>(null);
  const [comment, setComment] = React.useState("");
  const queryClient = useQueryClient();

  const { isLoading } = useQuery(
    ["getPostById", postId],
    () => httpService.get(`${URLS.GET_SINGLE_POST}/${postId}`),
    {
      onError: (error: any) => {
        alert(error.message);
      },
      onSuccess: (data) => {
        console.log(data.data.data);
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

      <ScrollView >

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
                    {post?.user.name}{" "}
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
            paddingHorizontal: 20,
            flex: 1,
          }}
        >
          <CustomText variant="body" textAlign="left">
            {post?.description}
          </CustomText>

          {/* IMAGE OR VIDEO SECTION */}
          {post?.post_images?.length > 0 ||
            (post?.post_videos?.length > 0 && (
              <Box
                flexDirection="row"
                justifyContent="space-between"
                marginTop="m"
                height={300}
                width="100%"
              >
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    height: "100%",
                    width: "100%",
                    paddingRight: 200,
                  }}
                >
                  {post.post_images.length > 0 &&
                    post.post_images.map((image, index) => (
                      <Image
                        source={{ uri: `${IMAGE_BASE}${image}` }}
                        contentFit="contain"
                        style={{
                          width: "40%",
                          height: "70%",
                          borderRadius: 15,
                          backgroundColor: "grey",
                        }}
                      />
                    ))}

                  {post.post_videos.length > 0 &&
                    post.post_videos.map((video, index) => (
                      <Video
                        key={index}
                        source={{ uri: `${IMAGE_BASE}${video.video_path}` }}
                        posterSource={{
                          uri: `${IMAGE_BASE}${video.video_thumbnail}`,
                        }}
                        usePoster
                        resizeMode={ResizeMode.COVER}
                        useNativeControls
                        isLooping={false}
                        style={{
                          width: 150,
                          height: "70%",
                          borderRadius: 15,
                          backgroundColor: "grey",
                        }}
                      />
                    ))}
                </ScrollView>
              </Box>
            ))}
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
