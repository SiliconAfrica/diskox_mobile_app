import { View, Text, ActivityIndicator, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import React from 'react'
import Box from '../../../components/general/Box'
import CustomText from '../../../components/general/CustomText'
import StatsCard from '../../../components/profile/StatsCard'
import { IPost } from '../../../models/post'
import { useQuery } from 'react-query'
import httpService from '../../../utils/httpService'
import { URLS } from '../../../services/urls'
import PostCard from '../../../components/feeds/PostCard'
import { ScrollView } from 'react-native-gesture-handler'
import FeedCard from '../../../components/feeds/FeedCard'
import { PaginatedResponse } from '../../../models/PaginatedResponse'
import { uniqBy } from 'lodash'
import { CUSTOM_STATUS_CODE } from '../../../enums/CustomCodes'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../theme'
import { useUtilState } from '../../../states/util'

interface IProps {
    id: number;
}

const UserPosts = ({ id }: IProps) => {
    const [posts, setPosts] = React.useState<IPost[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const [nomore, setNomore] = React.useState(false);

    const theme = useTheme<Theme>();
    const { isDarkMode }= useUtilState((state) => state);

    const getPosts = useQuery(['getProfileUpvotePosts', id, currentPage], () => httpService.get(`${URLS.GET_PROFILE_UPVOTES}/${id}`, {
        params: {
            page: currentPage,
        }
    }), {
        onError: (error: any) => {
            alert(error.message);
        },
        onSuccess: (data) => {
            const item: PaginatedResponse<IPost> = data.data;

            if (item.code === CUSTOM_STATUS_CODE.SUCCESS) {
                if (posts.length > 0) {
                    setPosts(uniqBy([...posts, ...item.data.data], 'id'));
                    setTotal(item.data.total);
                } else {
                    setPosts(uniqBy(item.data.data, 'id'));
                    setTotal(item.data.total);
                    setNomore(item.data.data.length < item.data.total ? false : true);
                }
                
            } else {
                
            }
        },
    });

    // NativeSyntheticEvent<NativeScrollEvent>
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 20;
    
        if (
          layoutMeasurement.height + contentOffset.y >=
          contentSize.height - paddingToBottom
        ) {
          // Load more data when user reaches the end
          if (!getPosts.isLoading && posts.length < total) {
            setCurrentPage(currentPage + 1);
          }
        }
      };
  return (
    <Box flex={1} bg={isDarkMode ?"mainBackGroundColor":'secondaryBackGroundColor'}>

       <ScrollView onScroll={handleScroll} scrollEventThrottle={16} contentContainerStyle={{ paddingBottom: 50 }} >

       {
           !getPosts.isLoading && posts.length < 1 && (
               <Box justifyContent='center' alignItems='center' height={50} paddingTop='l'>
                <CustomText variant='subheader' fontSize={18} color='primaryColor'>No Upvotes</CustomText>
               </Box>
           )
       }

        {
            posts.length > 0 && (
                <>
                    { posts.map(post => (
                        <FeedCard key={post.id} post={post} showReactions />
                    ))}
                </>
             )
        }

        {getPosts.isLoading && (
          <Box justifyContent="center" alignItems="center" height={20} paddingTop='m'>
            <ActivityIndicator size="small" color={theme.colors.primaryColor} />
          </Box>
        )}

        {/* {
           posts.length  === total && (
            <Box justifyContent='center' alignItems='center' height={20} >
                <CustomText variant="subheader" fontSize={16}>Thats all for now!</CustomText>
            </Box>
           )
       } */}

       </ScrollView>
    </Box>
  )
}

export default UserPosts