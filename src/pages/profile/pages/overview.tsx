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

const Overview = ({ id }: IProps) => {
    const [posts, setPosts] = React.useState<IPost[]>([]);
    const getPosts = useQuery(['getProfileOverview', id], () => httpService.get(`${URLS.GET_PROFILE_OVERVIEW_POSTS}/${id}`), {
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
        
       <Box padding='m'>
        <CustomText variant='subheader' fontSize={20}>User overview</CustomText>
            <CustomText variant='body' mt='s'>Monitor your performance at a glance or get deeper insights by clicking into your analytics below.</CustomText>

            <Box flexDirection='row' flexWrap='wrap' justifyContent='space-between' mt='m'>
                <StatsCard title='Post Views' amount={300} mainColor='#9747FF' iconBg='#F6F0FF' iconName='stats-chart-outline' />
                <StatsCard title='Upvotes' amount={14} iconName='arrow-up-outline' mainColor='#39A2AE' iconBg='#EBF7FF' />
                <StatsCard title='Posts' amount={20} iconName='reader-outline' mainColor='#34A853' iconBg='#EFFAF2' />
                <StatsCard title='Comments' amount={800} iconName='chatbox-ellipses-outline' mainColor='#EE580D' iconBg='#FEF2EC' />
                <StatsCard title='Reaction' amount={130} iconName='heart-outline' mainColor='#FACC07' iconBg='#FFFBEB' />
            </Box>
       </Box>

       {
           !getPosts.isLoading && posts.length < 1 && (
               <Box justifyContent='center' alignItems='center' height='20%' paddingTop='l'>
                <CustomText variant='subheader' color='primaryColor'>No Post found</CustomText>
               </Box>
           )
       }

       {
           getPosts.isLoading && (
               <Box justifyContent='center' alignItems='center' height='20%'>
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

export default Overview