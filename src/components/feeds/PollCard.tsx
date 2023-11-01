import { View, Text, Pressable, ActivityIndicator, Dimensions } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import CustomText from '../general/CustomText'
import { IPost } from '../../models/post'
import { Image} from 'expo-image'
import httpService, { IMAGE_BASE } from '../../utils/httpService'
import  moment from 'moment';
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'
import { Video, ResizeMode } from 'expo-av';
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { URLS } from '../../services/urls'
import { useModalState } from '../../states/modalState'
import { useUtilState } from '../../states/util'
import CommentTextbox from '../post/CommentTextbox'
import useCheckLoggedInState from '../../hooks/useCheckLoggedInState'
import useToast from '../../hooks/useToast'
import { colorizeHashtags } from '../../utils/colorizeText'
import { useDetailsState } from '../../states/userState'

const WIDTH = Dimensions.get('screen').width;

interface IProps {
    showStats: boolean;
}


const PollCard = (props: IPost& IProps) => {
    const [showAll, setShowAll] = React.useState(false);
    const [post, setPost] = React.useState<IPost>({...props})
    const { setAll } = useModalState((state) => state);
    const { isDarkMode, isLoggedIn } = useUtilState((state) => state)
    const theme = useTheme<Theme>();
    const navigation = useNavigation<any>();
    const queryClient = useQueryClient();
    const { checkloggedInState } = useCheckLoggedInState();
    const { id: myId } = useDetailsState((state) => state)
    const toast = useToast();
    const { setAll: setModalState } = useModalState((state) => state);



    const { description, created_at, id, post_images, post_videos, view_count, upvotes_count, reactions_count, replies_count, repost_count, comments_count, user: { name, profile_image, id: userId, isFollowing, username }, poll_duration, polls, has_voted_poll } = post;

    const des = colorizeHashtags(post.description);


    const getData = useQuery([`getPoll${id}`, id], () => httpService.get(`${URLS.GET_SINGLE_POST}/${id}`), {
        refetchOnMount: false,
      onError: (error: any) => {
        toast.show(error.message, { type: 'error' });
    },
      onSuccess: (data) => {
        setPost(data.data.data);
        console.log(data.data.data);
        
      }
    });

    // muatations
    const reactpost = useMutation({
        mutationFn: (data: any) => httpService.post(`${URLS.REACT_TO_POST}`, { post_id: id, type: data }),
        onError: (error: any) => {
            toast.show(error.message, { type: 'error' });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries([`getPoll${id}`, id]);
        }
    });

    const upvote = useMutation({
        mutationFn: () => httpService.post(`${URLS.UPVOTE_POST}/${id}`),
        onError: (error: any) => {
            toast.show(error.message, { type: 'error' });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries([`getPoll${id}`, id]);
        }
    });

    const downvote = useMutation({
        mutationFn: () => httpService.post(`${URLS.DOWN_VOTE_POST}/${id}`),
        onError: (error: any) => {
            toast.show(error.message, { type: 'error' });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries([`getPoll${id}`, id]);
        }
    });

    const votepoll = useMutation({
        mutationFn: (data: any) => httpService.post(`${URLS.VOTE_POLL}`, data),
        onError: (error: any) => {
          toast.show(error.message, { type: 'status' });
        },
        onSuccess: (data) => {
            if (data.data.message) {
                toast.show(data.data?.message, { type: 'success' });
                setPost(prev => ({ ...prev, has_voted_poll: 1 }));
                queryClient.invalidateQueries([`getPoll${id}`, id]);
                return;
            } else {
                queryClient.invalidateQueries([`getPoll${id}`, id]);
            }
        }
    });

    const follow = useMutation({
        mutationFn: () => httpService.post(`${URLS.FOLLOW_OR_UNFOLLOW_USER}/${userId}`),
        onError: (error: any) => {
          toast.show(error.message, { type: 'error' });
        },
        onSuccess: (data) => {
        //   queryClient.invalidateQueries([`getPost${id}`, id]);
          if (isFollowing === 1) {
            setPost({ ...post, user: { ...post.user, isFollowing: 0 }});
          } else {
            setPost({ ...post, user: { ...post.user, isFollowing: 1 }});
          }
        }
      });
    

    // functions
    const handleReaction = React.useCallback((type: 'love'|'upvote') => {
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
    }

    const handleDownVote = () => {
        const check = checkloggedInState();
        if (check) {
            downvote.mutate();
        }
    }

    const getDate = () => {
        const today = moment();
        const targetData = moment(created_at).add(poll_duration, 'days');
        const daysToGo = targetData.diff(today, 'days');
        return daysToGo;
    }

    const vote = (poll_id: number) =>  {
        const check = checkloggedInState();
        if (check) {
            if (getDate() < 1) {
                toast.show('Poll has ended you cannot vote anymore', {type: 'warning' });
                return;
            }
            const obj = {
                post_id: id,
                post_poll_id: poll_id
            }
            votepoll.mutate(obj);
        }
    }

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

    const handleFollow = () => {
        const check = checkloggedInState();
        if (check) {
          follow.mutate();
        }
      }


  return (
    <Box width='100%' backgroundColor={isDarkMode ? "secondaryBackGroundColor" : "mainBackGroundColor"
} marginBottom='s'>
 
        {/* HEADER SECTION */}
        <Box flexDirection='row' justifyContent='space-between' alignItems='center' paddingHorizontal='m' paddingTop='m'>
            <Box flexDirection='row' alignItems='center'>

                <Box flexDirection='row'>
                    <View style={{ width: 32, height: 32, borderRadius: 25, borderWidth: 2, borderColor: theme.colors.primaryColor, backgroundColor: theme.colors.secondaryBackGroundColor, overflow: 'hidden' }} >
                        <Image source={{ uri: `${IMAGE_BASE}${profile_image}`}} contentFit='contain' style={{ width: '100%', height: '100%', borderRadius: 25 }} />
                    </View>

                    <Box marginLeft="s" justifyContent="center">
                        <Box flexDirection="row" >
                            <CustomText variant="body" color="black">
                            {name?.length > 5 ? 
                                name?.substring(0, 5) + '...'  :
                                name
                            }
                            </CustomText>
                            <CustomText variant="body" color="grey">@{username}</CustomText>
                        </Box>
                        <CustomText
                            variant="xs"
                            onPress={() => navigation.navigate("post", { postId: id })}
                        >
                            {moment(created_at).fromNow()}
                        </CustomText>
                        </Box>
                </Box>

                { myId !== userId && (
              <Pressable style={{
                backgroundColor: theme.colors.fadedButtonBgColor,
                padding: 5,
                
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 20
              }}
                onPress={handleFollow}
              >
                { follow.isLoading ? (
                  <ActivityIndicator color={theme.colors.primaryColor} size={'small'} />
                ): (
                  <CustomText variant="header" fontSize={14} color="primaryColor">{ isFollowing === 1 ? 'Following':'Follow'}</CustomText>
                )}
              </Pressable>
            )}
            </Box>
            <Ionicons name='ellipsis-vertical' size={20} color={theme.colors.textColor} />
        </Box>

        {/* CONTENT SECTION */}
        <Box marginVertical='m' paddingHorizontal='m'>

        <Box paddingHorizontal="m">
        <CustomText variant="body">
          {showAll
            ? des
            : des?.length > 100
            ? des?.substring(0, 100) + "..."
            : des}{" "}
          {des?.length > 100 && (
            <CustomText
              variant="body"
              color="primaryColor"
              onPress={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "Show Less" : "Read More"}
            </CustomText>
          )}{" "}
        </CustomText>
        </Box>

        {(post.post_images?.length > 0 || post.post_videos?.length > 0) && (
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
                      height: '100%',
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
                  bottom={40}
                  right={10}
                  style={{
                    backgroundColor: '#0000006f'
                  }}
                >
                  <CustomText variant="subheader" style={{ color: 'white'}} >
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
            {polls?.length > 0 && (
                <Box flexDirection='row' justifyContent='space-between' marginTop='m' maxHeight={300} width={'100%'}>

                    <ScrollView  showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: '100%' }}>
                    
                        {polls.map((poll, index) => (
                            <Box key={index.toString()} width='100%' height={40} position='relative' overflow='hidden' borderRadius={25} marginBottom='s'>
                                { has_voted_poll === 1 && (
                                    <Box position='absolute' width={`${poll.vote_count}%`} top={0} height='100%' zIndex={1} backgroundColor='fadedButtonBgColor' />
                                )}
                                {
                                    getDate() < 1 && (
                                        <Box position='absolute' width={`${poll.vote_count}%`} top={0} height='100%' zIndex={1} backgroundColor='fadedButtonBgColor' />
                                    )
                                }
                                <Pressable onPress={() => vote(poll.id)}  style={{ zIndex: 2, width: '100%', height: 40, borderRadius: 25, borderWidth: 0.8, borderColor: theme.colors.primaryColor, paddingHorizontal: 20, justifyContent: 'center', marginBottom: 10 }}>
                                    <CustomText variant='header' fontSize={13} color='primaryColor'>{poll.subject} ({poll.vote_count}%)</CustomText>
                                </Pressable>
                            </Box>
                        ))}
                   
                    </ScrollView>
                </Box>
              )}

              <CustomText>{getDate() > 0 ? `${getDate()} days left` : 'Final result'  } </CustomText>
        </Box>

        {/* REACTION SECTION */}

        {props.showStats && (
            <Box paddingHorizontal='m' width='100%' borderTopWidth={2} borderTopColor={isDarkMode ? 'mainBackGroundColor':'secondaryBackGroundColor'}  paddingVertical='m'>

            <Box flexDirection='row' alignItems='center'>
                <Ionicons name='eye-outline' size={25} color={theme.colors.grey} />
                <CustomText variant='xs' marginLeft='s'>{view_count}</CustomText>
            </Box>

            {/* REACTIONS */}

            <Box flexDirection='row' justifyContent='space-between' width='100%' marginTop='m'>

                {/* VOTING SECTION */}
                <Box flex={1} flexDirection='row' width='100%' alignItems='center'>
                    <Box width='45%' flexDirection='row' height={40} borderRadius={20} borderWidth={2} borderColor={isDarkMode ? 'mainBackGroundColor':'secondaryBackGroundColor'} >
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, flex: 0.7 }} onPress={handleUpVote}>
                            { upvote.isLoading && <ActivityIndicator size='small' color={theme.colors.primaryColor} /> }
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
                        <Pressable style={{ width: 15, flex: 0.2, height: '100%', borderLeftWidth: 2, borderLeftColor:  isDarkMode ? theme.colors.mainBackGroundColor : theme.colors.secondaryBackGroundColor, justifyContent: 'center', alignItems: 'center'}} onPress={handleDownVote} >
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
                            { downvote.isLoading && <ActivityIndicator size='small' color={theme.colors.primaryColor} />}
                        </Pressable>
                    </Box>

                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, }} onPress={() => handleReaction('love')}>
                        <Ionicons name='heart-outline' size={25} color={post.has_reacted.length > 0 ? theme.colors.primaryColor : theme.colors.textColor}  />
                        <CustomText variant='body'>{reactions_count}</CustomText>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate('post', { postId: id })} style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, }}>
                        <Ionicons name='chatbox-ellipses-outline' size={25} color={theme.colors.textColor} />
                        <CustomText variant='body'>{comments_count}</CustomText>
                    </Pressable>
                </Box>

                <Pressable style={{ width: 30, flexDirection: 'row', alignItems: 'center'}} onPress={handleShare} >
                        <Ionicons name='share-social-outline' size={25} color={theme.colors.textColor} />
                        <CustomText variant='body'>{repost_count}</CustomText>
                </Pressable>
            </Box>

        </Box>
        )}

        <CommentTextbox postId={post.id} />

    </Box>
  )
}

export default PollCard