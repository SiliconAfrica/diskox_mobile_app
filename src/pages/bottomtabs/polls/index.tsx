import { View, Text, ActivityIndicator, RefreshControl  } from 'react-native'
import React from 'react'
import Box from '../../../components/general/Box'
import Searchbar from '../../../components/Searchbar'
import { useUtilState } from '../../../states/util'
import { FlashList } from '@shopify/flash-list'
import FilterTopbar from '../../../components/feeds/FilterTopbar'
import PostCard from '../../../components/feeds/PostCard'
import { IPost } from '../../../models/post'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import httpService from '../../../utils/httpService'
import CustomText from '../../../components/general/CustomText'
import { URLS } from '../../../services/urls'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../theme'
import { useModalState } from '../../../states/modalState'
import { POST_FILTERR } from '../../../enums/Postfilters'
import PollCard from '../../../components/feeds/PollCard'
import useToast from '../../../hooks/useToast'

const Posts = () => {
  const { isLoggedIn } = useUtilState((state) => state);
  const { setAll, filterBy } = useModalState((state) => state)
  const theme = useTheme<Theme>();
  const queryClient = useQueryClient();
  const toast = useToast();

  // states
  const [posts, setPosts] = React.useState<IPost[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [ids, setIds] = React.useState<number[]>([]);
  const [url, setUrl] = React.useState<string>(POST_FILTERR.ALL);

  // react query
  const { isLoading, isError, error } = useQuery(['GetAllPolls', currentPage, url], () => httpService.get(`${URLS.GET_POLLS}?page=${currentPage}`), {
    onSuccess: async(data) => {
      if (posts.length > 0) {
        if (!data.data) {
          return;
        }
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

  const RefreshPost = useQuery(['GetAllPolls'], () => httpService.get(`${URLS.GET_POLLS}?page=${currentPage}`), {
    onSuccess: async(data) => {
      if (posts.length > 0) {
        if (!data.data) {
          return;
        }
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
      
        { RefreshPost.isLoading && (
          <Box width='100%' height={100} justifyContent="center" alignItems="center">
            <ActivityIndicator color={theme.colors.primaryColor} />
            <CustomText variant="body">Refreshing posts...</CustomText>
          </Box>
        )}

        {  (
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
            <CustomText variant='body'>No Post to view</CustomText>
          )}
          estimatedItemSize={100}
          renderItem={({ item }) => (
            <PollCard {...item} showStats />
          )}
          ListHeaderComponent={() => (
            <>
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
        )}
    </Box>
  )
}

export default Posts