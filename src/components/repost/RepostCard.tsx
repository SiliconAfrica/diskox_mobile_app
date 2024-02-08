import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import { ArchiveAdd, ArchiveMinus, ArchiveTick, Eye, Heart, Message,  } from 'iconsax-react-native'
import { Feather, Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import CustomButton from '../general/CustomButton'
import CustomText from '../general/CustomText'
import { colorizeHashtags } from '../../utils/colorizeText'
import CustomVideoplayer from '../general/CustomVideoplayer'
import { Image } from 'expo-image'
import { IPost } from '../../models/post'
import useToast from '../../hooks/useToast'
import { useModalState } from '../../states/modalState'
import { useUtilState } from '../../states/util'
import { useNavigation } from '@react-navigation/native'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import useCheckLoggedInState from '../../hooks/useCheckLoggedInState'
import { useDetailsState } from '../../states/userState'
import { URLS } from '../../services/urls'
import httpService, { IMAGE_BASE } from '../../utils/httpService'
import moment from 'moment'
import { TouchableOpacity } from 'react-native-gesture-handler'


const RepostCard = ({
    post: activePost,
}: {
    post?: IPost,
}) => {
    // React state
    const [showMore, setShowMore] = React.useState(false);
    const [showComment, setShowComment] = React.useState(false);
    const [showAll, setShowAll] = React.useState(false);
    const [post, setPost] = React.useState<IPost>({ ...activePost });
    const [images, setImages] = React.useState(activePost.post_images.map((item) => item.image_path));
    const [showMoreTitle, setShowMoreTitle]= React.useState(false);

    const toast = useToast();
   

    const { setAll } = useModalState((state) => state);
    const { isDarkMode } = useUtilState((state) => state);
    const navigation = useNavigation<any>();
    const queryClient = useQueryClient();
    const { setAll: setModalState } = useModalState((state) => state);
    const { checkloggedInState } = useCheckLoggedInState();
    const { id: myId } = useDetailsState((state) => state)
    const theme = useTheme<Theme>();
    const des = colorizeHashtags(post.description);


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
        tags,
        community_id,
        user: { name, profile_image, id: userId, username, isFollowing },
      } = post;


      // Queries
      const getData = useQuery(
        [`getPost${id}`, id],
        () => httpService.get(`${URLS.GET_SINGLE_POST}/${id}`),
        {
          refetchOnMount: true,
          onError: (error: any) => {
            toast.show(error.message, { type: "error" });
          },
          onSuccess: (data) => {
            const p: IPost = data.data.data;
            setPost(data.data.data);
          },
        }
      );

      // muatations
        const reactpost = useMutation({
            mutationFn: (data: any) =>
            httpService.post(`${URLS.REACT_TO_POST}`, { post_id: id, type: data }),
            onError: (error: any) => {
            toast.show(error.message, { type: 'error' });
            },
            onSuccess: (data) => {
            queryClient.invalidateQueries([`getPost${id}`]);
            },
        });

        const follow = useMutation({
            mutationFn: () => httpService.post(`${URLS.FOLLOW_OR_UNFOLLOW_USER}/${userId}`),
            onError: (error: any) => {
              toast.show(error.message, { type: 'error' });
            },
            onSuccess: (data) => {
              // queryClient.invalidateQueries([`getPost${id}`]);
              if (isFollowing === 1) {
                setPost({ ...post, user: { ...post.user, isFollowing: 0 }});
              } else {
                setPost({ ...post, user: { ...post.user, isFollowing: 1 }});
              }
            }
          });

          const upvote = useMutation({
            mutationFn: () => httpService.post(`${URLS.UPVOTE_POST}/${id}`),
            onError: (error: any) => {
              toast.show(error.message, { type: 'error' });
            },
            onSuccess: (data) => {
              queryClient.invalidateQueries([`getPost${id}`]);
            },
          });
        
          const downvote = useMutation({
            mutationFn: () => httpService.post(`${URLS.DOWN_VOTE_POST}/${id}`),
            onError: (error: any) => {
              toast.show(error.message, { type: 'error' });
            },
            onSuccess: (data) => {
              queryClient.invalidateQueries([`getPost${id}`]);
            },
          });

          const { mutate, isLoading } = useMutation({
            mutationFn: () => httpService.post(`${URLS.BOOKMARK_POST}/${post.id}`),
            onSuccess: (data) => {
              toast.show(data.data.message, { type: 'success' });
              setPost({ ...post, is_bookmarked: post.is_bookmarked === 1 ?0:1 })
              //setAll({ activePost: { ...activePost, is_bookmarked: activePost.is_bookmarked === 1 ?0:1 } });
            },
            onError: (error: any) => {
              toast.show(error.message, { type: 'error' });
        
            },
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
                    queryClient.invalidateQueries([`getPost${id}`]);
                    return;
                } else {
                  queryClient.invalidateQueries([`getPost${id}`]);
                }
            }
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
              setAll({ postId: id, showShare: true, activePost: post });
            }
          }, [id]);
        
          const handleUpVote = () => {
            const check = checkloggedInState();
            if (check) {
              upvote.mutate();
            }
          };
        
          const handleNavigate = () => {
            const check = checkloggedInState();
            if (check) {
              navigation.navigate("profile", { userId })
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

          const getDate = () => {
            const today = moment();
            const targetData = moment(created_at).add(post.poll_duration, 'days');
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

        const handleBookmark = () =>  {
          const check = checkloggedInState();
          if (check) {
              if (!isLoading) {
                mutate();
              }
          }
      }
        
          const handleFollow = () => {
            const check = checkloggedInState();
            if (check) {
              follow.mutate();
            }
          }

  return (
    <Box width="100%"  marginBottom='s' bg='transparent2' borderWidth={1} borderColor='borderColor' borderRadius={12}>

        {/* HEADER SECTION */}
        <Box flexDirection='row' alignItems='flex-start' width='100%'  justifyContent='space-between' paddingHorizontal='s' paddingVertical='m'>
            
           <Box flexDirection='row' flex={0.8} width='100%'>
                 {/* IMAGE BOX */}
                <Pressable
                  onPress={() => handleNavigate()}
                >
                  <Box width={32} height={32} borderRadius={17} borderWidth={1} borderColor='primaryColor' overflow='hidden'>
                      <Image source={{ uri: `${IMAGE_BASE}/${profile_image}` }} contentFit='cover' style={{
                          width: '100%',
                          height: '100%'
                      }} />
                  </Box>
                </Pressable>

                {/* DETAILS BOX */}
                <Box width={'100%'}  marginLeft='s' overflow='hidden'>
                    <Box width={'100%'} flexWrap='wrap' flexDirection='row' alignItems='center'>
                        <CustomText marginRight='s' variant='xs' >{name} @{username}
                          {community_id === null && tags.length===1 && (
                            <>
                              tagged  <CustomText variant='subheader' fontSize={14}>{tags[0].user.name } </CustomText>
                            </>
                          )}
                          {community_id === null && tags.length > 1 && (
                            <>
                             <CustomText variant='xs'> tagged </CustomText> <CustomText variant='subheader' fontSize={14}>{tags[0].user.username} and {tags.length - 1} others</CustomText>
                            </>
                          )}
                          { community_id !== null && (
                            <>
                              <CustomText variant='xs'> Posted in </CustomText>
                              <CustomText variant='subheader' fontSize={14}> {post?.community?.name}</CustomText>
                            </>
                          )}
                        </CustomText>
                          { myId !== userId && (
                              <CustomButton title={post.user.isFollowing === 1 ? 'Following' : 'Follow'} isLoading={follow.isLoading} height={22} width={65} spinnerColor={theme.colors.textColor} onPress={handleFollow} color={theme.colors.mainBackGroundColor} textColor={theme.colors.textColor} />
                          )}
                    </Box>
                    <CustomText variant='xs' marginTop='s'>{moment(created_at).fromNow()}</CustomText>
                </Box>
           </Box>

        </Box>

        {/* TEXTBOX */}
        <Box paddingHorizontal='s' flexDirection='row' width={'100%'} flexWrap='wrap' marginBottom='m'>
          {post.post_type === 'question' && (
            <>
              { showMoreTitle ? <CustomText variant='header' fontSize={16}>{post.title}</CustomText> : post.title?.length > 150 ? <CustomText variant='header' fontSize={16}>{`${post.title?.slice(0, 150)}...`}</CustomText> :  <CustomText variant='header' fontSize={16}>{post.title}</CustomText> }
              { post.title?.length > 150 && <CustomText style={{ width: '100%'}} onPress={() => setShowMoreTitle(!showMoreTitle)} color={showMoreTitle ? 'lightGrey':'primaryColor'}>{ showMoreTitle ? 'Read less':'Read more'}</CustomText>}
            </>
          )}
          {post.title !== null && (
            <Box height={10} width='100%'/>
          )}
            { showMore ? colorizeHashtags(post?.description ?? '') : post?.description?.length > 150 ? colorizeHashtags(`${post?.description?.slice(0, 150)}...`) : colorizeHashtags(post?.description) }
           { post?.description?.length > 150 &&  <CustomText style={{ width: '100%'}} onPress={() => setShowMore(!showMore)} color={showMore ? 'lightGrey':'primaryColor'}>{ showMore ? 'Read less':'Read more'}</CustomText> }
        </Box>

        {/* MEDIA BOX */}

        {/* VIDEO BOX */}
        {
            post.post_videos.length > 0 && (
                <CustomVideoplayer uri={`${IMAGE_BASE}${post?.post_videos[0].video_path}`} poster={`${IMAGE_BASE}${post?.post_videos[0].video_thumbnail}`} />
            )
        }

        {/* IMAGE BOX */}
       {post_images.length > 0 && (
         <Box width='100%' height={300} flexDirection='row' position='relative' marginBottom='l'>
         { post.post_images.length === 1 && (
             <Pressable style={{ width: '100%', height: '100%'}} onPress={() => {
              setAll({ activeImages: images, imageViewer: true })
             }}>
              <Image source={{ uri: `${IMAGE_BASE}${post?.post_images[0].image_path}`}} style={{ width: '100%', height: '100%' }} contentFit='cover' />
             </Pressable>
         )}
         {
            post.post_images.length === 2 && (
            <Box flexDirection='row' width='100%' height={'100%'}>
                {
                post_images.map((image, index) => (
                        <Pressable key={index.toString()} style={{ width: '50%', height: '100%' }} 
                          onPress={() => {
                            setAll({ activeImages: images, imageViewer: true })
                          }}
                        >
                          <Image source={{ uri: `${IMAGE_BASE}${image.image_path}` }} key={index} contentFit='cover' style={{ width: '100%', height: '100%'}} />
                        </Pressable>
                    ))
                }
            </Box>
            )
         }
         {
             post.post_images.length === 3  && (
                 <>
                     <Pressable style={{ flex: 0.6, height: '100%' }} 
                      onPress={() => {
                        setAll({ activeImages: images, imageViewer: true })
                      }}                     
                     >
                       <Image source={{ uri: `${IMAGE_BASE}${post?.post_images[0].image_path}` }} contentFit='cover' style={{ flex: 1, height: '100%'}} />
                     </Pressable>
                     { post.post_images.length === 3 && (
                         <Box width={'30%'} height={'100%'} flex={0.4}>
                             { post.post_images.slice(1, post_images.length).map((image, index) => (
                                 <Pressable key={index} style={{ width: '100%', height: '50%'}} 
                                  onPress={() => {
                                    setAll({ activeImages: images, imageViewer: true })
                                  }} 
                                 >
                                  <Image source={{ uri: `${IMAGE_BASE}${image.image_path}` }}  contentFit='cover' style={{ width: '100%', height: '100%'}} />
                                 </Pressable>
                             ))}
                         </Box>
                     )}
                 </>
             )
         }
         {
             post.post_images.length > 3  && (
                 <>
                     <Pressable style={{ flex: 0.6, height: '100%' }} 
                      onPress={() => {
                        setAll({ activeImages: images, imageViewer: true })
                      }}                     
                     >
                       <Image source={{ uri: `${IMAGE_BASE}${post?.post_images[0].image_path}` }} contentFit='cover' style={{ flex: 1, height: '100%'}} />
                     </Pressable>
                     { post.post_images.length >= 3 && (
                         <Box width={'30%'} height={'100%'} flex={0.4}>
                             { post.post_images.slice(1, post_images.length > 3 ? 3:2).map((image, index) => (
                                 <Pressable key={index} style={{ width: '100%', height: '50%'}} 
                                    onPress={() => {
                                      setAll({ activeImages: images, imageViewer: true })
                                    }} 
                                    >
                                    <Image source={{ uri: `${IMAGE_BASE}${image.image_path}` }}  contentFit='cover' style={{ width: '100%', height: '100%'}} />
                                </Pressable>
                             ))}
                         </Box>
                     )}
                 </>
             )
         }
         {
             post_images.length > 3 && (
                 <Box width={60} height={60} position='absolute' bottom={10} right={10} borderRadius={10} justifyContent='center' alignItems='center' style={{ backgroundColor: '#0000006f'}}>
                     <CustomText variant='header' fontSize={18} style={{ color: 'white' }}>+{post_images.slice(3).length} </CustomText>
                 </Box>
             )
         }
        </Box>
       )}

      <Box paddingHorizontal='s' marginBottom='m'>

         {/* Poll SECTION */}
         {post.polls?.length > 0 && (
                <Box flexDirection='row' justifyContent='space-between' marginTop='m' maxHeight={300} width={'100%'}>

                    <ScrollView  showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: '100%' }}>
                    
                        {post.polls.map((poll, index) => (
                            <Box key={index.toString()} width='100%' height={40} position='relative' overflow='hidden' borderRadius={25} marginBottom='s'>
                                { post.has_voted_poll === 1 && (
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

             { post.polls?.length > 0 && (
                <CustomText>{getDate() > 0 ? `${getDate()} days left` : 'Final result'  } </CustomText>
             )}

      </Box>

    </Box>
  )
}

export default RepostCard