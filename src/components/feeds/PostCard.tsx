import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React from "react";
import Box from "../general/Box";
import { Ionicons, Feather, FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import CustomText from "../general/CustomText";
import { IPost } from "../../models/post";
import { Image } from "expo-image";
import httpService, { IMAGE_BASE } from "../../utils/httpService";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Video, ResizeMode } from "expo-av";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { URLS } from "../../services/urls";
import { useModalState } from "../../states/modalState";
import { useUtilState } from "../../states/util";
import CommentTextbox from "../post/CommentTextbox";
import useCheckLoggedInState from "../../hooks/useCheckLoggedInState";
import { useToast } from "react-native-toast-notifications";

const WIDTH = Dimensions.get("screen").width;

interface IProps {
  showStats: boolean;
}

const PostCard = (props: IPost & IProps) => {
  const toast = useToast();
  const [showAll, setShowAll] = React.useState(false);
  const [post, setPost] = React.useState<IPost>({ ...props });
  const { setAll } = useModalState((state) => state);
  const { isDarkMode } = useUtilState((state) => state);
  const theme = useTheme<Theme>();
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const { setAll: setModalState } = useModalState((state) => state);
  const { checkloggedInState } = useCheckLoggedInState();

  const {
    description,
    created_at,
    id,
    post_images,
    post_videos,
    view_count,
    upvotes_count,
    reactions_count,
    replies_count,
    repost_count,
    comments_count,
    user: { name, profile_image, id: userId },
  } = post;

  const getData = useQuery(
    [`getPost${id}`, id],
    () => httpService.get(`${URLS.GET_SINGLE_POST}/${id}`),
    {
      refetchOnMount: false,
      onError: (error: any) => {
        toast.show(error.message, { type: "error" });
      },
      onSuccess: (data) => {
        const p: IPost = data.data.data;
        if (p.has_reacted.length > 0) {
          console.log(p.has_reacted);
        }
        // p.map((item) => {
        //     if (item.has_reacted.length > 0) {
        //         console.log(item.has_reacted);
        //     }
        // })
        setPost(data.data.data);
      },
    }
  );

  // muatations
  const reactpost = useMutation({
    mutationFn: (data: any) =>
      httpService.post(`${URLS.REACT_TO_POST}`, { post_id: id, type: data }),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([`getPost${id}`]);
    },
  });

  const upvote = useMutation({
    mutationFn: () => httpService.post(`${URLS.UPVOTE_POST}/${id}`),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: (data) => {
      console.log(`The upvote : = ${post.has_upvoted}`);
      queryClient.invalidateQueries([`getPost${id}`]);
    },
  });

  const downvote = useMutation({
    mutationFn: () => httpService.post(`${URLS.DOWN_VOTE_POST}/${id}`),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([`getPost${id}`]);
    },
  });

  // functions
  const handleReaction = React.useCallback((type: "love" | "upvote") => {
    const check = checkloggedInState();
    if (check) {
      reactpost.mutate(type);
    }
  }, []);

  const handleShare = React.useCallback(() => {
    const check = checkloggedInState();
    if (check) {
      setAll({ postId: id, showShare: true });
    }
  }, [id]);

  const handleUpVote = () => {
    const check = checkloggedInState();
    if (check) {
      upvote.mutate();
    }
  };

  const handleDownVote = () => {
    const check = checkloggedInState();
    if (check) {
      downvote.mutate();
    }
  };
  const openGallery = () => {
    const allVideoAndImage = [...post_images, ...post_videos];
    let theData = allVideoAndImage.map((item) => ({
      type: item.type,
      uri: `${IMAGE_BASE}${item.image_path || item.video_path}`,
    }));
    setModalState({
      showImageVideoSlider: true,
      imageVideoSliderData: [...theData],
    });
  };
  return (
    <Box
      width="100%"
      backgroundColor={
        isDarkMode ? "secondaryBackGroundColor" : "mainBackGroundColor"
      }
      marginBottom="s"
    >
      {/* HEADER SECTION */}
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="m"
        paddingTop="m"
      >
        <Box flexDirection="row">
          <Box flexDirection="row">
            <Pressable
              onPress={() => navigation.navigate("profile", { userId })}
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
                source={{ uri: `${IMAGE_BASE}${profile_image}` }}
                contentFit="contain"
                style={{ width: "100%", height: "100%", borderRadius: 25 }}
              />
            </Pressable>

            <Box marginLeft="s" justifyContent="center">
              <Box flexDirection="row">
                <CustomText variant="body" color="black">
                  {name}{" "}
                </CustomText>
                <CustomText variant="body" color="grey"></CustomText>
              </Box>
              <CustomText
                variant="xs"
                onPress={() => navigation.navigate("post", { postId: id })}
              >
                {moment(created_at).fromNow()}
              </CustomText>
            </Box>
          </Box>
        </Box>
        <Ionicons
          name="ellipsis-vertical"
          size={20}
          color={theme.colors.textColor}
          onPress={() =>
            setModalState({ activePost: post, showPostAction: true })
          }
        />
      </Box>

      {/* CONTENT SECTION */}
      <Box marginVertical="m" paddingHorizontal="m">
        <CustomText variant="body">
          {showAll
            ? description
            : description?.length > 100
            ? description?.substring(0, 100) + "..."
            : description}{" "}
          {description?.length > 100 && (
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
        {(post_images?.length > 0 || post_videos?.length > 0) && (
          <Pressable
            onPress={openGallery}
            style={{ marginTop: 8, height: 300, width: "100%" }}
          >
            {post_images.length > 0 && post_videos.length > 0 ? (
              <Box
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "red",
                }}
              >
                {post_images.length > 0 ? (
                  <Image
                    source={{
                      uri: `${IMAGE_BASE}${post_images[0].image_path}`,
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
                        uri: `${IMAGE_BASE}${post_videos[0].video_path}`,
                      }}
                      posterSource={{
                        uri: `${IMAGE_BASE}${post_videos[0].video_thumbnail}`,
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
                  backgroundColor="grey"
                  position="absolute"
                  width={80}
                  height={80}
                  alignItems="center"
                  justifyContent="center"
                  bottom={0}
                  right={0}
                >
                  <CustomText variant="subheader" color="white">
                    {post_images.length + post_videos.length - 1}+
                  </CustomText>
                </Box>
              </Box>
            ) : (
              <></>
            )}
            {/*   old code*/}
            {/* <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                // height: "100%",
                // width: "100%",
                // paddingRight: 200,
                backgroundColor: "red",
              }}
            >
              {post_images.length > 0 && (
                <>
                  {post_images.length === 1 &&
                    post_images.map((image, index) => (
                      <Image
                        source={{ uri: `${IMAGE_BASE}${image.image_path}` }}
                        contentFit="contain"
                        key={index}
                        style={{
                          width: WIDTH,
                          height: "100%",
                          borderRadius: 0,
                        }}
                      />
                    ))}
                  {post.post_images.length > 1 &&
                    post_images.map((image, i) => (
                      <Image
                        source={{ uri: `${IMAGE_BASE}${image.image_path}` }}
                        contentFit="contain"
                        key={i}
                        style={{
                          width: WIDTH - 50,
                          height: "100%",
                          borderRadius: 15,
                        }}
                      />
                    ))}
                </>
              )}

              {post_videos.length > 0 && (
                <>
                  {post_videos.length === 1 &&
                    post_videos.map((video, index) => (
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
                        videoStyle={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 15,
                          backgroundColor: "grey",
                        }}
                        style={{
                          width: WIDTH,
                          height: "100%",
                          borderRadius: 0,
                          backgroundColor: "grey",
                        }}
                      />
                    ))}
                  {post_videos.length > 1 &&
                    post_videos.map((item, i) => (
                      <Video
                        key={i}
                        source={{ uri: `${IMAGE_BASE}${item.video_path}` }}
                        posterSource={{
                          uri: `${IMAGE_BASE}${item.video_thumbnail}`,
                        }}
                        usePoster
                        resizeMode={ResizeMode.COVER}
                        useNativeControls
                        videoStyle={{
                          width: "44%",
                          height: "70%",
                          borderRadius: 15,
                          backgroundColor: "grey",
                        }}
                        isLooping={false}
                        style={{
                          width: (WIDTH / 100) * 44,
                          height: "70%",
                          borderRadius: 15,
                          backgroundColor: "grey",
                        }}
                      />
                    ))}
                </>
              )}
            </ScrollView> */}
          </Pressable>
        )}
      </Box>

      {/* REACTION SECTION */}

      {props.showStats && (
        <Box width="100%" paddingVertical="m" paddingHorizontal="m">
          <Box
            width={"100%"}
            height={1}
            bg={isDarkMode ? "mainBackGroundColor" : "secondaryBackGroundColor"}
          />

          <Box flexDirection="row" alignItems="center">
            <Ionicons name="eye-outline" size={25} color={theme.colors.grey} />
            <CustomText variant="xs" marginLeft="s">
              {view_count}
            </CustomText>
          </Box>

          {/* REACTIONS */}

          <Box
            flexDirection="row"
            justifyContent="space-between"
            width="100%"
            marginTop="m"
          >
            {/* VOTING SECTION */}
            <Box flex={1} flexDirection="row" width="100%" alignItems="center">
              <Box
                width="45%"
                flexDirection="row"
                height={40}
                borderRadius={20}
                borderWidth={2}
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
                  onPress={handleUpVote}
                >
                  {upvote.isLoading && (
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.primaryColor}
                    />
                  )}
                  {!upvote.isLoading && (
                    <>
                      {/* <Ionicons name='arrow-up-outline' size={20} color={post.has_upvoted !== 0 ? theme.colors.primaryColor:theme.colors.textColor}  /> */}
                      {post.has_upvoted === 0 && (
                        <Image
                          source={require("../../../assets/images/arrows/up.png")}
                          contentFit="cover"
                          style={{ width: 20, height: 20 }}
                        />
                      )}
                      {post.has_upvoted !== 0 && (
                        <Image
                          source={require("../../../assets/images/arrows/upfilled.png")}
                          contentFit="cover"
                          style={{ width: 20, height: 20 }}
                        />
                      )}
                      <CustomText variant="xs">
                        {upvotes_count} Upvote
                      </CustomText>
                    </>
                  )}
                </Pressable>
                <Pressable
                  style={{
                    width: 15,
                    flex: 0.2,
                    height: "100%",
                    borderLeftWidth: 2,
                    borderLeftColor: isDarkMode
                      ? theme.colors.mainBackGroundColor
                      : theme.colors.secondaryBackGroundColor,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={handleDownVote}
                >
                  {!downvote.isLoading && (
                    <>
                      {post.has_downvoted === 0 && (
                        <Image
                          source={require("../../../assets/images/arrows/down.png")}
                          contentFit="cover"
                          style={{ width: 20, height: 20 }}
                        />
                      )}
                      {post.has_downvoted !== 0 && (
                        <Image
                          source={require("../../../assets/images/arrows/downfilled.png")}
                          contentFit="cover"
                          style={{ width: 20, height: 20 }}
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

              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 10,
                }}
                onPress={() => handleReaction("love")}
              >
                <Ionicons
                  name="heart-outline"
                  size={20}
                  color={
                    post.has_reacted.includes(id)
                      ? theme.colors.primaryColor
                      : theme.colors.textColor
                  }
                />
                <CustomText variant="body">{reactions_count}</CustomText>
              </Pressable>

              <Pressable
                onPress={() => navigation.navigate("post", { postId: id })}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 10,
                }}
              >
                <Ionicons
                  name="chatbox-ellipses-outline"
                  size={20}
                  color={theme.colors.textColor}
                />
                <CustomText variant="body">{comments_count}</CustomText>
              </Pressable>
            </Box>

            <Pressable
              style={{ width: 30, flexDirection: "row", alignItems: "center" }}
              onPress={handleShare}
            >
              <Ionicons
                name="share-social-outline"
                size={20}
                color={theme.colors.textColor}
              />
              <CustomText variant="body">{repost_count}</CustomText>
            </Pressable>
          </Box>
        </Box>
      )}

      <CommentTextbox postId={post.id} />
    </Box>
  );
};

export default PostCard;
