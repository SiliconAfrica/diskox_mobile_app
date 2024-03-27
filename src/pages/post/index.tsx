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
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import { Video, ResizeMode } from "expo-av";
import CommentTextbox from "../../components/post/CommentTextbox";
import SingleCommentTextbox from "../../components/post/SinglePostCommentPage";
import { useModalState } from "../../states/modalState";
import useCheckLoggedInState from "../../hooks/useCheckLoggedInState";
import CommentSection from "../../components/feeds/FeedsCardComponents/CommentSection";
import {Eye, Heart, Message} from "iconsax-react-native";
import {ArrowBigDown, ArrowBigUp} from "lucide-react-native";
import FeedCard from "../../components/feeds/FeedCard";

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
        <FeedCard post={post} showReactions={true} />
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
