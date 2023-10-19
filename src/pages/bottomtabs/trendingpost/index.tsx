import { View, Text, ActivityIndicator, RefreshControl  } from 'react-native'
import React from 'react'
import Box from '../../../components/general/Box'
import Searchbar from '../../../components/Searchbar'
import { useUtilState } from '../../../states/util'
import { FlashList } from '@shopify/flash-list'
import FilterTopbar from '../../../components/feeds/FilterTopbar'
import PostCard from '../../../components/feeds/PostCard'
import { IPost } from '../../../models/post'
import { useQuery, useMutation } from 'react-query'
import httpService from '../../../utils/httpService'
import CustomText from '../../../components/general/CustomText'
import { URLS } from '../../../services/urls'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../theme'
import useToast from '../../../hooks/useToast'

const TrendingPosts = () => {
  const { isLoggedIn } = useUtilState((state) => state);
  const theme = useTheme<Theme>();

  // states
  const [posts, setPosts] = React.useState<IPost[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [ids, setIds] = React.useState<number[]>([]);
  const toast = useToast();

  // react query
  const { isLoading, isError, error } = useQuery(['GetAllTrendingPosts', currentPage], () => httpService.get(`${URLS.GET_TRENDING_POSTS}?page=${currentPage}`), {
    onSuccess: async(data) => {
      if (posts.length > 0) {
        const arr = [...posts, ...data.data.data.data];
        setPosts(arr);
        setCurrentPage(data.data.data.current_page);
        setTotal(data.data.data.total);
        const postData: IPost[] = data.data.data.data as IPost[];
        const postids = await Promise.all(postData.map((item) => item.id))
        setIds(postids);
        return;
      } else {
        setPosts(data.data.data.data);
        setCurrentPage(data.data.data.current_page);
        setTotal(data.data.data.total);
        const postData: IPost[] = data.data.data.data as IPost[];
        const postids = await Promise.all(postData.map((item) => item.id))
        setIds(postids);
      }
    },
    onError: (error: any) => {
      toast.show(error.message, { type: 'error'});
    }
  });

  const RefreshPost = useQuery(['GetAllTrendingPosts',], () => httpService.get(`${URLS.GET_TRENDING_POSTS}?page=${currentPage}`), {
    onSuccess: async(data) => {
      if (posts.length > 0) {
        const arr = [...posts, ...data.data.data.data];
        setPosts(arr);
        return;
      } else {
        setPosts(data.data.data.data);
      }
    },
    onError: (error: any) => {
      toast.show(error.message, { type: 'error'});
    }
  });

  // mutations 
  const markasViewed = useMutation({
    mutationFn: (data: { posts_id: number[] }) => httpService.post(`${URLS.INCREMENT_POST_VIEWS}`, data),
    onError: (error: any) => {
      toast.show(error.message, { type: 'error'});
    },
    onSuccess: (data) => {
      console.log(data.data);
    }
  })

  // functions
  const onEndReached = React.useCallback(async() => {
    if ((total / 12) === currentPage) {
      return;
    } else {
      // get more items
      markasViewed.mutate({ posts_id: ids });
      // increment page number
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, ids]);

  const handleRefresh = () => {
    RefreshPost.refetch();
  }

  return (
    <Box backgroundColor='mainBackGroundColor' flex={1}>
        
        <FlashList 
           refreshControl={
            <RefreshControl 
              refreshing={RefreshPost.isLoading}
              onRefresh={handleRefresh} 
            />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={1}
          ListEmptyComponent={() => (
            <>
              { !isLoading && posts.length < 1 && (
                <CustomText variant='body' textAlign='center' marginTop='l'>No Post to view</CustomText>
              )}
            </>
          )}
          estimatedItemSize={100}
          renderItem={({ item }) => (
            <PostCard {...item} showStats />
          )}
          ListHeaderComponent={() => (
            <>
                <Box marginBottom='m'>
                    <CustomText variant='subheader' paddingLeft='m' paddingTop='s'>Trending Posts</CustomText>
                </Box>
              { isLoggedIn && (
                <Searchbar /> 
              )}
              <FilterTopbar />
            </>
          )}
          data={posts}
          ListFooterComponent={() => (
            <Box width='100%' alignItems='center' marginVertical='m'>
              { isLoading && <ActivityIndicator size='small' color={theme.colors.primaryColor} /> }
            </Box>
          )}
        />
    </Box>
  )
}

export default TrendingPosts