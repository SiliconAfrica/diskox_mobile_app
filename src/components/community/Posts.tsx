import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import { RouteProp, useRoute } from '@react-navigation/native'
import { CommunityStackParamList } from '../../pages/bottomtabs/community'
import { IPost } from '../../models/post'
import { useQuery } from 'react-query'
import httpService from '../../utils/httpService'
import { URLS } from '../../services/urls'
import { FlashList } from '@shopify/flash-list'
import PostCard from '../feeds/PostCard'
import CustomText from '../general/CustomText'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'

const Posts = () => {
  const [posts, setPosts] = React.useState<IPost[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [total,setTotal] = React.useState(0);
  const [perPage, setPerPage] = React.useState(0);
  const [lastPage, setLastPage] = React.useState(0);
  const theme = useTheme<Theme>();
  const route = useRoute<RouteProp<CommunityStackParamList, 'community'>>();
  const { id } = route.params;

  const {isLoading} = useQuery(['getCommunityPosts', id, currentPage], () => httpService.get(`${URLS.GET_COMMUNITY_POSTS}/${id}`, {
    params: {
      page: currentPage,
    }
  }), {
    onSuccess: (data) => {
      if (posts.length > 0) {
        setPosts(prev => [...prev, ...data?.data?.data?.data]);
        setCurrentPage(data?.data?.current_page);
      } else {
        setPosts(data?.data?.data?.data);
        setCurrentPage(data?.data?.current_page);
        setTotal(data?.data?.total);
        setPerPage(data?.data?.per_page);
        setLastPage(data?.data?.last_page);
      }
    },
    onError: (error) => {
      
    }
  })

  const handleEndReached = React.useCallback(() => {
    if (total / currentPage !== lastPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [total, currentPage, lastPage])
  return (
    <FlashList
      onEndReached={handleEndReached} 
      estimatedItemSize={20}
      ListFooterComponent={() => (
        <>
          {
            isLoading && (
              <ActivityIndicator size='large' color={theme.colors.primaryColor} />
            )
          }
        </>
      )}
      ListEmptyComponent={() => (
        <>
          {
            !isLoading && (
              <Box width='100%' justifyContent='center' alignItems='center'>
                <CustomText variant='body'>No Post Found</CustomText>
              </Box>
            )
          }
        </>
      )}
      data={posts}
      renderItem={({ item }) => (
        <PostCard {...item} showStats />
      )}
    />
  )
}

export default Posts