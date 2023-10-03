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

const WIDTH = Dimensions.get('screen').width;

interface IProps {
    showStats: boolean;
}


const PollCard = (props: IPost& IProps) => {
    const [showAll, setShowAll] = React.useState(false);
    const [post, setPost] = React.useState<IPost>({...props})
    const { setAll } = useModalState((state) => state);
    const { isDarkMode } = useUtilState((state) => state)
    const theme = useTheme<Theme>();
    const navigation = useNavigation<any>();
    const queryClient = useQueryClient();

    const { description, created_at, id, post_images, post_videos, view_count, upvotes_count, reactions_count, replies_count, repost_count, comments_count, user: { name, profile_image }, poll_duration, polls, has_voted_poll } = post;

    const getData = useQuery([`getPolls${id}`, id], () => httpService.get(`${URLS.GET_SINGLE_POST}/${id}`), {
        refetchOnMount: false,
      onError: (error: any) => {
        alert(error.message);
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
          alert(error.message);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries([`getPolls${id}`]);
        }
    });

    const upvote = useMutation({
        mutationFn: () => httpService.post(`${URLS.UPVOTE_POST}/${id}`),
        onError: (error: any) => {
          alert(error.message);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries([`getPolls${id}`]);
        }
    });

    const downvote = useMutation({
        mutationFn: () => httpService.post(`${URLS.DOWN_VOTE_POST}/${id}`),
        onError: (error: any) => {
          alert(error.message);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries([`getPolls${id}`]);
        }
    });

    const votepoll = useMutation({
        mutationFn: (data: any) => httpService.post(`${URLS.VOTE_POLL}`, data),
        onError: (error: any) => {
          alert(error.message);
        },
        onSuccess: (data) => {
            console.log(data.data);
            if (data.data.message) {
                alert(data.data.message);
                setPost(prev => ({ ...prev, has_voted_poll: 1 }));
                return;
            }
            queryClient.invalidateQueries([`getPolls${id}`]);
        }
    });
    

    // functions
    const handleReaction = React.useCallback((type: 'love'|'upvote') => {
        reactpost.mutate(type);
    }, []);

    const handleShare = React.useCallback(() => {
        setAll({ postId: id, showShare: true });
    }, [id])

    const getDate = () => {
        const today = moment();
        const targetData = moment(created_at).add(poll_duration, 'days');
        const daysToGo = targetData.diff(today, 'days');
        return daysToGo;
    }

    const vote = (poll_id: number) =>  {
        const obj = {
            post_id: id,
            post_poll_id: poll_id
        }

        votepoll.mutate(obj);
    }

  return (
    <Box width='100%' backgroundColor='secondaryBackGroundColor' marginBottom='s' padding='m'>
 
        {/* HEADER SECTION */}
        <Box flexDirection='row' justifyContent='space-between' alignItems='center'>
            <Box flexDirection='row'>
                <Box flexDirection='row'>
                    <View style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: theme.colors.primaryColor, backgroundColor: theme.colors.secondaryBackGroundColor, overflow: 'hidden' }} >
                        <Image source={{ uri: `${IMAGE_BASE}${profile_image}`}} contentFit='contain' style={{ width: '100%', height: '100%', borderRadius: 25 }} />
                    </View>

                    <Box marginLeft='s' justifyContent='center'>
                        <Box flexDirection='row'>
                            <CustomText variant='body' color='black'>{name} </CustomText>
                            <CustomText variant='body' color='grey'></CustomText>
                        </Box>
                        <CustomText variant='xs' onPress={() => navigation.navigate('post', { postId: id })}>{moment(created_at).fromNow()}</CustomText>
                    </Box>
                </Box>
            </Box>
            <Ionicons name='ellipsis-vertical' size={20} color={theme.colors.textColor} />
        </Box>

        {/* CONTENT SECTION */}
        <Box marginVertical='m'>

            <CustomText variant='body'>{showAll ? description : description?.length > 100 ? description?.substring(0, 100) + '...' : description}  { description?.length > 100 && (
                <CustomText variant='body' color='primaryColor' onPress={() => setShowAll(prev => !prev)} >{showAll ? 'Show Less' : 'Read More'}</CustomText>
            )} </CustomText>

            {/* Poll SECTION */}
            {polls?.length > 0 && (
                <Box flexDirection='row' justifyContent='space-between' marginTop='m' maxHeight={300} width={'100%'}>

                    <ScrollView  showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: '100%' }}>
                    
                        {polls.map((poll, index) => (
                            <Box key={index.toString()} width='100%' height={45} position='relative' overflow='hidden' borderRadius={25} marginBottom='s'>
                                { has_voted_poll === 1 && (
                                    <Box position='absolute' width={`${poll.vote_count}%`} top={0} height='100%' zIndex={1} backgroundColor='fadedButtonBgColor' />
                                )}
                                <Pressable onPress={() => vote(poll.id)}  style={{ zIndex: 2, width: '100%', height: 45, borderRadius: 25, borderWidth: 1, borderColor: theme.colors.primaryColor, paddingHorizontal: 20, justifyContent: 'center', marginBottom: 10 }}>
                                    <CustomText variant='body' color='primaryColor'>{poll.subject} ({poll.vote_count}%)</CustomText>
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
            <Box width='100%' borderTopWidth={2} borderTopColor={isDarkMode ? 'mainBackGroundColor':'secondaryBackGroundColor'}  paddingVertical='m'>

            <Box flexDirection='row' alignItems='center'>
                <Ionicons name='eye-outline' size={25} color={theme.colors.grey} />
                <CustomText variant='xs' marginLeft='s'>{view_count}</CustomText>
            </Box>

            {/* REACTIONS */}

            <Box flexDirection='row' justifyContent='space-between' width='100%' marginTop='m'>

                {/* VOTING SECTION */}
                <Box flex={1} flexDirection='row' width='100%' alignItems='center'>
                    <Box width='45%' flexDirection='row' height={40} borderRadius={20} borderWidth={2} borderColor={isDarkMode ? 'mainBackGroundColor':'secondaryBackGroundColor'} >
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, flex: 0.7 }} onPress={() => upvote.mutate()}>
                            { upvote.isLoading && <ActivityIndicator size='small' color={theme.colors.primaryColor} /> }
                            { !upvote.isLoading && <>
                                <Ionicons name='arrow-up' size={20} color={theme.colors.textColor} />
                                <CustomText variant='xs'>{upvotes_count} Upvote</CustomText>
                            </>}
                        </Pressable>
                        <Pressable style={{ width: 15, flex: 0.2, height: '100%', borderLeftWidth: 2, borderLeftColor:  isDarkMode ? theme.colors.mainBackGroundColor : theme.colors.secondaryBackGroundColor, justifyContent: 'center', alignItems: 'center'}} onPress={() => downvote.mutate()} >
                            { !downvote.isLoading && <Ionicons name='arrow-down-outline' size={20} color={theme.colors.textColor} /> }
                            { downvote.isLoading && <ActivityIndicator size='small' color={theme.colors.primaryColor} />}
                        </Pressable>
                    </Box>

                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, }} onPress={() => handleReaction('love')}>
                        <Ionicons name='heart-outline' size={25} color={theme.colors.textColor}  />
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

    </Box>
  )
}

export default PollCard