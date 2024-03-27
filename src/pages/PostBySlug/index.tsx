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
import { useUtilState } from "../../states/util";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/MainNavigation";
import httpService, { IMAGE_BASE } from "../../utils/httpService";
import { URLS } from "../../services/urls";
import SettingsHeader from "../../components/settings/Header";
import moment from "moment";
import { IPost } from "../../models/post";
import { Theme } from "../../theme";
import { useTheme } from "@shopify/restyle";
import { Video } from "expo-av";
import { useModalState } from "../../states/modalState";
import useCheckLoggedInState from "../../hooks/useCheckLoggedInState";
import FeedCard from "../../components/feeds/FeedCard";

const PostBySlug = ({
                  route,
                  navigation,
              }: NativeStackScreenProps<RootStackParamList, "slug-post">) => {
    const { slug } = route.params;
    const theme = useTheme<Theme>();
    const { isLoggedIn } = useUtilState((state) => state);
    const { setAll: setModalState } = useModalState((state) => state);
    const [post, setPost] = React.useState<IPost | null>(null);
    const videoRef = React.useRef<Video>(null);
    const [comment, setComment] = React.useState("");
    const queryClient = useQueryClient();
    const { checkloggedInState } = useCheckLoggedInState();

    const { isLoading } = useQuery(
        ["getPostById", slug],
        () => httpService.get(`${URLS.GET_POST_BY_SLUG}/${slug}`),
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
            queryClient.invalidateQueries([`getPost${post?.id}`]);
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
            queryClient.invalidateQueries(["getPostById", post?.id]);
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
            post_id: post?.id,
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
            { post &&  <FeedCard post={post} showReactions={true} /> }
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

export default PostBySlug;
