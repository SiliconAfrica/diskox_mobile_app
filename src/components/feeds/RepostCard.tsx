import { Pressable } from "react-native";
import React from "react";
import { IPost } from "../../models/post";
import Box from "../general/Box";
import CustomText from "../general/CustomText";
import { colorizeHashtags } from "../../utils/colorizeText";
import CustomVideoplayer from "../general/CustomVideoplayer";
import { IMAGE_BASE } from "../../utils/httpService";
import { Image } from "expo-image";
import { useModalState } from "../../states/modalState";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import CustomButton from "../general/CustomButton";
import { useDetailsState } from "../../states/userState";
import { useUtilState } from "../../states/util";
import { ArchiveAdd, User } from "iconsax-react-native";
import { Feather } from "@expo/vector-icons";

interface IProps {
  post: IPost;
  vote: (id: number) => void;
  handleNavigate: () => void;
  showReactions: boolean;
  handleBookmark: () => void;
  handleFollow: () => void;
  followLoading: boolean;
}

const RepostFeedCard = ({
  post,
  vote,
  handleNavigate,
  showReactions,
  handleBookmark,
  handleFollow,
  followLoading,
}: IProps) => {
  const [showMoreTitle, setShowMoreTitle] = React.useState(false);
  const [showMore, setShowMore] = React.useState(false);
  const [images, setImages] = React.useState(
    post.post_images.map((item) => item.image_path),
  );

  const { profile_image, username, name, id: userId } = post.user;

  // global states
  const { setAll } = useModalState((state) => state);
  const { id: myId } = useDetailsState((state) => state);
  const { isDarkMode } = useUtilState((state) => state);
  const theme = useTheme<Theme>();

  // functions
  const getDate = () => {
    const today = moment();
    const targetData = moment(post.created_at).add(post.poll_duration, "days");
    const daysToGo = targetData.diff(today, "days");
    return daysToGo;
  };

  return (
    <Box
      width={"100%"}
      height={"auto"}
      padding="m"
      borderRadius={10}
      borderWidth={1}
      borderColor="borderColor"
      marginBottom="m"
    >
      {/* HEADER SECTION */}
      <Box
        flexDirection="row"
        alignItems="flex-start"
        width="100%"
        justifyContent="space-between"
        paddingHorizontal="s"
        paddingVertical="m"
      >
        <Box flexDirection="row" flex={0.8} width="100%">
          {/* IMAGE BOX */}
          <Pressable onPress={() => handleNavigate()}>
            {profile_image !== null && (
              <Box
                width={32}
                height={32}
                borderRadius={17}
                borderWidth={1}
                borderColor="primaryColor"
                overflow="hidden"
              >
                <Image
                  source={{ uri: `${IMAGE_BASE}/${profile_image}` }}
                  contentFit="cover"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Box>
            )}
            {profile_image === null && (
              <Box
                width={32}
                height={32}
                borderRadius={17}
                borderWidth={1}
                justifyContent="center"
                alignItems="center"
                borderColor="primaryColor"
                overflow="hidden"
              >
                <User variant="Bold" size={15} color={theme.colors.textColor} />
              </Box>
            )}
          </Pressable>

          {/* DETAILS BOX */}
          <Box width={"100%"} marginLeft="s" overflow="hidden">
            <Box
              width={"100%"}
              flexWrap="wrap"
              flexDirection="row"
              alignItems="center"
            >
              <CustomText marginRight="s" variant="subheader" fontSize={14}>
                {name} @{username}
                {post.community_id === null && post.tags.length === 1 && (
                  <>
                    tagged{" "}
                    <CustomText variant="subheader" fontSize={14}>
                      {post.tags[0].user.name}{" "}
                    </CustomText>
                  </>
                )}
                {post.community_id === null && post.tags.length > 1 && (
                  <>
                    <CustomText variant="xs"> tagged </CustomText>{" "}
                    <CustomText variant="subheader" fontSize={14}>
                      {post.tags[0].user.username} and {post.tags.length - 1}{" "}
                      others
                    </CustomText>
                  </>
                )}
                {post.community_id !== null && (
                  <>
                    <CustomText variant="xs"> Posted in </CustomText>
                    <CustomText variant="subheader" fontSize={14}>
                      {" "}
                      {post?.community?.name}
                    </CustomText>
                  </>
                )}
              </CustomText>
              {myId !== userId && (
                <CustomButton
                  title={post.user.isFollowing === 1 ? "Following" : "Follow"}
                  isLoading={followLoading}
                  height={22}
                  width={65}
                  spinnerColor={theme.colors.textColor}
                  onPress={handleFollow}
                  color={isDarkMode ? "black" : theme.colors.fadedButtonBgColor}
                  textColor={isDarkMode ? "white" : theme.colors.primaryColor}
                  variant="subheader"
                />
              )}
            </Box>
            <CustomText variant="body" fontSize={12} color="lightGrey">
              {moment(post.created_at).fromNow()}
            </CustomText>
          </Box>
        </Box>
      </Box>

      {/* POST SECTION */}

      <Box
        paddingHorizontal="s"
        flexDirection="row"
        width={"100%"}
        flexWrap="wrap"
        marginBottom="m"
      >
        {post?.post_type === "question" && (
          <>
            {showMoreTitle ? (
              <CustomText variant="header" fontSize={16}>
                {post.title}
              </CustomText>
            ) : post.title?.length > 150 ? (
              <CustomText
                variant="header"
                fontSize={16}
              >{`${post.title?.slice(0, 150)}...`}</CustomText>
            ) : (
              <CustomText variant="header" fontSize={16}>
                {post.title}
              </CustomText>
            )}
            {post.title?.length > 150 && (
              <CustomText
                style={{ width: "100%" }}
                onPress={() => setShowMoreTitle(!showMoreTitle)}
                color={showMoreTitle ? "lightGrey" : "primaryColor"}
              >
                {showMoreTitle ? "Read less" : "Read more"}
              </CustomText>
            )}
          </>
        )}
        {post?.description !== null && <Box height={10} width="100%" />}
        {showMore
          ? colorizeHashtags(post?.description ?? "")
          : post?.description?.length > 150
            ? colorizeHashtags(`${post?.description?.slice(0, 150)}...`)
            : colorizeHashtags(post?.description)}
        {post?.description?.length > 150 && (
          <CustomText
            style={{ width: "100%" }}
            onPress={() => setShowMore(!showMore)}
            color={showMore ? "lightGrey" : "primaryColor"}
          >
            {showMore ? "Read less" : "Read more"}
          </CustomText>
        )}
      </Box>

      {/* VIDEO BOX */}
      {post?.post_videos?.length > 0 && (
        <CustomVideoplayer
          uri={`${IMAGE_BASE}${post?.post_videos[0].video_path}`}
          poster={`${IMAGE_BASE}${post?.post_videos[0].video_thumbnail}`}
        />
      )}

      {/* IMAGE BOX */}
      {post.post_images?.length > 0 && (
        <Box
          width="100%"
          height={300}
          flexDirection="row"
          position="relative"
          marginBottom="l"
        >
          {post.post_images.length === 1 && (
            <Pressable
              style={{ width: "100%", height: "100%" }}
              onPress={() => {
                setAll({ activeImages: images, imageViewer: true });
              }}
            >
              <Image
                source={{
                  uri: `${IMAGE_BASE}${post?.post_images[0].image_path}`,
                }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            </Pressable>
          )}
          {post.post_images.length === 2 && (
            <Box flexDirection="row" width="100%" height={"100%"}>
              {post.post_images.map((image, index) => (
                <Pressable
                  key={index.toString()}
                  style={{ width: "50%", height: "100%" }}
                  onPress={() => {
                    setAll({ activeImages: images, imageViewer: true });
                  }}
                >
                  <Image
                    source={{ uri: `${IMAGE_BASE}${image.image_path}` }}
                    key={index}
                    contentFit="cover"
                    style={{ width: "100%", height: "100%" }}
                  />
                </Pressable>
              ))}
            </Box>
          )}
          {post.post_images.length === 3 && (
            <>
              <Pressable
                style={{ flex: 0.6, height: "100%" }}
                onPress={() => {
                  setAll({ activeImages: images, imageViewer: true });
                }}
              >
                <Image
                  source={{
                    uri: `${IMAGE_BASE}${post?.post_images[0].image_path}`,
                  }}
                  contentFit="cover"
                  style={{ flex: 1, height: "100%" }}
                />
              </Pressable>
              {post.post_images.length === 3 && (
                <Box width={"30%"} height={"100%"} flex={0.4}>
                  {post.post_images
                    .slice(1, post.post_images.length)
                    .map((image, index) => (
                      <Pressable
                        key={index}
                        style={{ width: "100%", height: "50%" }}
                        onPress={() => {
                          setAll({ activeImages: images, imageViewer: true });
                        }}
                      >
                        <Image
                          source={{ uri: `${IMAGE_BASE}${image.image_path}` }}
                          contentFit="cover"
                          style={{ width: "100%", height: "100%" }}
                        />
                      </Pressable>
                    ))}
                </Box>
              )}
            </>
          )}
          {post.post_images.length > 3 && (
            <>
              <Pressable
                style={{ flex: 0.6, height: "100%" }}
                onPress={() => {
                  setAll({ activeImages: images, imageViewer: true });
                }}
              >
                <Image
                  source={{
                    uri: `${IMAGE_BASE}${post?.post_images[0].image_path}`,
                  }}
                  contentFit="cover"
                  style={{ flex: 1, height: "100%" }}
                />
              </Pressable>
              {post.post_images.length >= 3 && (
                <Box width={"30%"} height={"100%"} flex={0.4}>
                  {post.post_images
                    .slice(1, post.post_images.length > 3 ? 3 : 2)
                    .map((image, index) => (
                      <Pressable
                        key={index}
                        style={{ width: "100%", height: "50%" }}
                        onPress={() => {
                          setAll({ activeImages: images, imageViewer: true });
                        }}
                      >
                        <Image
                          source={{ uri: `${IMAGE_BASE}${image.image_path}` }}
                          contentFit="cover"
                          style={{ width: "100%", height: "100%" }}
                        />
                      </Pressable>
                    ))}
                </Box>
              )}
            </>
          )}
          {post.post_images.length > 3 && (
            <Box
              width={60}
              height={60}
              position="absolute"
              bottom={10}
              right={10}
              borderRadius={10}
              justifyContent="center"
              alignItems="center"
              style={{ backgroundColor: "#0000006f" }}
            >
              <CustomText
                variant="header"
                fontSize={18}
                style={{ color: "white" }}
              >
                +{post.post_images.slice(3).length}{" "}
              </CustomText>
            </Box>
          )}
        </Box>
      )}

      {/* POLL SECTION */}

      <Box paddingHorizontal="s" marginBottom="m">
        {/* Poll SECTION */}
        {post.polls?.length > 0 && (
          <Box
            flexDirection="row"
            justifyContent="space-between"
            marginTop="m"
            maxHeight={300}
            width={"100%"}
          >
            <ScrollView
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ width: "100%" }}
            >
              {post.polls.map((poll, index) => (
                <Box
                  key={index.toString()}
                  width="100%"
                  height={40}
                  position="relative"
                  overflow="hidden"
                  borderRadius={25}
                  marginBottom="s"
                >
                  {post.has_voted_poll === 1 && (
                    <Box
                      position="absolute"
                      width={`${poll.vote_count}%`}
                      top={0}
                      height="100%"
                      zIndex={1}
                      backgroundColor="fadedButtonBgColor"
                    />
                  )}
                  {getDate() < 1 && (
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
                      height: 40,
                      borderRadius: 25,
                      borderWidth: 0.8,
                      borderColor: theme.colors.primaryColor,
                      paddingHorizontal: 20,
                      justifyContent: "center",
                      marginBottom: 10,
                    }}
                  >
                    <CustomText
                      variant="header"
                      fontSize={13}
                      color="primaryColor"
                    >
                      {poll.subject} ({poll.vote_count}%)
                    </CustomText>
                  </Pressable>
                </Box>
              ))}
            </ScrollView>
          </Box>
        )}

        {post.polls?.length > 0 && (
          <CustomText>
            {getDate() > 0 ? `${getDate()} days left` : "Final result"}{" "}
          </CustomText>
        )}
      </Box>
    </Box>
  );
};

export default RepostFeedCard;
