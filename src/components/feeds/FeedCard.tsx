import { ActivityIndicator, Pressable, View } from 'react-native'
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
import CommentSection from './FeedsCardComponents/CommentSection'
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

const Text = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur alias Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur alias Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur alias Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur alias #onelove #lovejesus'

// generrate 5 random images in an array
const images = [
    'https://picsum.photos/id/237/200/300',
    'https://picsum.photos/id/238/200/300',
    'https://picsum.photos/id/239/200/300',
    'https://picsum.photos/id/240/200/300',
    'https://picsum.photos/id/241/200/300',
    'https://picsum.photos/id/242/200/300',
]

const FeedCard = ({
    post: activePost
}: {
    post?: IPost,
    showReactions?: boolean,
}) => {
    // React state
    const [showMore, setShowMore] = React.useState(false);
    const [showComment, setShowComment] = React.useState(false);
    const [showAll, setShowAll] = React.useState(false);
    const [post, setPost] = React.useState<IPost>({ ...activePost });
    const [images, setImages] = React.useState(activePost.post_images.map((item) => item.image_path));

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
              alert(error.message);
            },
            onSuccess: (data) => {
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
        
          const handleFollow = () => {
            const check = checkloggedInState();
            if (check) {
              follow.mutate();
            }
          }

  return (
    <Box width="100%"  marginBottom='s' bg='mainBackGroundColor'>

        {/* HEADER SECTION */}
        <Box flexDirection='row' alignItems='flex-start' width='100%'  justifyContent='space-between' paddingHorizontal='s' paddingVertical='m'>
            
           <Box flexDirection='row' flex={0.8} width='100%'>
                 {/* IMAGE BOX */}
                <Box width={32} height={32} borderRadius={17} borderWidth={1} borderColor='primaryColor' overflow='hidden'>
                    <Image source={{ uri: `${IMAGE_BASE}/${profile_image}` }} contentFit='cover' style={{
                        width: '100%',
                        height: '100%'
                    }} />
                </Box>

                {/* DETAILS BOX */}
                <Box width={'100%'}  marginLeft='s' overflow='hidden'>
                    <Box width={'100%'} flexWrap='wrap' flexDirection='row'>
                        <CustomText marginBottom='s' variant='xs' style={{ width: '100%', flexWrap: 'wrap' }}>{name} @{username}</CustomText>
                        { myId !== userId && (
                            <CustomButton title={post.user.isFollowing === 1 ? 'Following' : 'Follow'} isLoading={follow.isLoading} height={26} width={80} onPress={handleFollow} color={theme.colors.fadedButtonBgColor} textColor={theme.colors.primaryColor} />
                        )}
                    </Box>
                    <CustomText variant='xs' marginTop='s'>{moment(created_at).fromNow()}</CustomText>
                </Box>
           </Box>

           <Box flexDirection='row'>
            { myId !== userId && (
               <>
                { post.is_bookmarked === 1 &&  <ArchiveMinus size={25} color={theme.colors.primaryColor} onPress={() => mutate()} /> }
                { post.is_bookmarked === 0 &&  <ArchiveAdd size={25} color={theme.colors.textColor} onPress={() => mutate()} /> }
               </>
            )}
            <Feather name='more-vertical' size={30} color={theme.colors.textColor} style={{ marginLeft: 10 }} onPress={() => setAll({ activePost: post, showPostAction : true })} />
           </Box>
        </Box>

        {/* TEXTBOX */}
        <Box paddingHorizontal='s' flexDirection='row' width={'100%'} flexWrap='wrap' marginBottom='m'>
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

        {/* REACTIOONS */}

        <Box width='100%' paddingHorizontal='m'>
            <Box width={'100%'} borderTopWidth={0.5} borderTopColor='lightGrey'>

                {/* VIEW SECTION */}
                <Box flexDirection='row' alignItems='center' marginVertical='m'>
                    <Eye size={20} color={theme.colors.lightGrey} variant='Outline' />
                    <CustomText color='lightGrey' variant='body' marginLeft='s'>{post.view_count} Views</CustomText>
                </Box>

                {/* REACTION SECTION */}
                <Box width={'100%'} height={60} flexDirection='row'>
                    {/* MAIN REACTION BOX */}
                    <Box width={'40%'} height={32} flexDirection='row' borderRadius={20} borderWidth={0.5} borderColor='lightGrey'>

                        {/* UPVOTE */}
                        <Pressable style={{
                            width: '70%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            borderRightWidth: 0.5,
                            borderRightColor: theme.colors.lightGrey,
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
                                    <CustomText variant='xs' fontSize={12} marginLeft='s' color={post.has_upvoted !== 0 ? 'primaryColor':'textColor'}>{post.upvotes_count > 0 && post.upvotes_count} UPVOTE</CustomText>
                                </>
                            )}
                        </Pressable>

                        {/* DOWNVOTE */}
                        <Pressable style={{
                            width: '30%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
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

                    {/* REACTION LIKE, COMMENT AND SHARE SECTIOON */}
                    <Box flex={1} width={'100%'} height={32} paddingLeft='m' flexDirection='row' justifyContent='space-between' alignItems='center'>
                        <Box flexDirection='row'>

                        <Pressable
                                style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginHorizontal: 10,
                                }}
                                onPress={() => handleReaction("love")}
                            >
                                {/* <Ionicons
                                name="heart-outline"
                                size={20}
                                color={
                                    post.has_reacted.length > 0
                                    ? theme.colors.primaryColor
                                    : theme.colors.textColor
                                }
                                /> */}
                                <Heart size={20}  color={
                                    post.has_reacted.length > 0
                                    ? theme.colors.primaryColor
                                    : theme.colors.textColor
                                } variant={post.has_reacted.length > 0 ? 'Bold' : 'Outline'} />
                                <CustomText variant="body">{reactions_count > 0 && reactions_count}</CustomText>
                            </Pressable>
              
                            <Pressable
                                onPress={() => setShowComment(prev => !prev)}
                                style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginHorizontal: 10,
                                }}
                            >
                                <Message size={20} color={showComment ? theme.colors.primaryColor : theme.colors.textColor} />
                                <CustomText variant="body">{post.comments_count > 0 && post.comments_count}</CustomText>
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
                            <CustomText variant="body">{post.repost_count > 0 && post.repost_count}</CustomText>
                        </Pressable>

                    </Box>

                </Box>

            </Box>
        </Box>

        {/* COMMENT SECTION */}
       { showComment &&  <CommentSection postId={post.id} /> }

    </Box>
  )
}

export default FeedCard