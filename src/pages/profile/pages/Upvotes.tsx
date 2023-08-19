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

interface IProps {
    id: number;
}

const Upvotes = ({ id }: IProps) => {
    const [posts, setPosts] = React.useState<IPost[]>([]);
    const getPosts = useQuery(['getProfileUpvotes', id], () => httpService.get(`${URLS.GET_PROFILE_UPVOTES}/${id}`), {
        onError: (error: any) => {
            alert(error.message);
        },
        onSuccess: (data) => {
            console.log(data.data);
            if (data.data.data) {
                setPosts(data.data.data.data);
            } else {
                setPosts([])
            }
        },
    });
  return (
    <Box flex={1} bg='secondaryBackGroundColor'>
        {/* STATS SECTIONS */}

       <ScrollView>

       {
           !getPosts.isLoading && posts.length < 1 && (
               <Box justifyContent='center' alignItems='center' height={50} paddingTop='l'>
                <CustomText variant='subheader' color='primaryColor'>No Post found</CustomText>
               </Box>
           )
       }
        
        {
           getPosts.isLoading && (
               <Box justifyContent='center' alignItems='center' height={50}>
                <ActivityIndicator size='large' />
               </Box>
           )
       }

        {
             !getPosts.isLoading && posts.length > 0 && (
                <>
                    { posts.map(post => (
                        <PostCard key={post.id} {...post} showStats />
                    ))}
                </>
             )
        }

       </ScrollView>
    </Box>
  )
}

export default Upvotes