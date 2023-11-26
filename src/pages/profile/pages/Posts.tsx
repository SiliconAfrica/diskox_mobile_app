import { View, Text, ActivityIndicator } from 'react-native'
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

interface IProps {
    id: number;
}

const UserPosts = ({ id }: IProps) => {
    const [posts, setPosts] = React.useState<IPost[]>([]);
    const getPosts = useQuery(['getProfilePosts', id], () => httpService.get(`${URLS.GET_PROFILE_POSTS}/${id}`), {
        onError: (error: any) => {
            alert(error.message);
        },
        onSuccess: (data) => {
            if (data.data.data) {
                setPosts(data.data.data.data);
            } else {
                setPosts([])
            }
        },
    });
  return (
    <Box flex={1} bg='mainBackGroundColor'>
        {/* STATS SECTIONS */}

       <ScrollView>

       {
           !getPosts.isLoading && posts.length < 1 && (
               <Box justifyContent='center' alignItems='center' height={50} paddingTop='l'>
                <CustomText variant='subheader' fontSize={18} color='primaryColor'>No post found</CustomText>
               </Box>
           )
       }
       {
           getPosts.isLoading && (
               <Box justifyContent='center' alignItems='center' height='20%' paddingTop='l'>
                <ActivityIndicator size='large' />
               </Box>
           )
       }

        {
             !getPosts.isLoading && posts.length > 0 && (
                <>
                    { posts.map(post => (
                        <FeedCard key={post.id} post={post} showReactions />
                    ))}
                </>
             )
        }

       </ScrollView>
    </Box>
  )
}

export default UserPosts