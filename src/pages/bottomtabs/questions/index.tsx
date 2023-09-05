import { View, Text, ActivityIndicator  } from 'react-native'
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

const Questions = () => {
  const { isLoggedIn } = useUtilState((state) => state);
  const { setAll, filterBy } = useModalState((state) => state)
  const theme = useTheme<Theme>();
  const queryClient = useQueryClient();

  // states
  const [posts, setPosts] = React.useState<IPost[]>([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [ids, setIds] = React.useState<number[]>([]);
  const [url, setUrl] = React.useState<string>(POST_FILTERR.ALL);

  React.useEffect(() => {
    console.log(filterBy);
    switch (filterBy) {
      case POST_FILTERR.HIGHEST_UPVOTES: {
        setUrl(URLS.MOST_UPVOTES);
        queryClient.invalidateQueries(['GetAllPosts']);
        break;
      }
      case POST_FILTERR.MOST_COMMENTS: {
        setUrl(URLS.MOST_COMMENTS);
        queryClient.invalidateQueries(['GetAllPosts']);
        break;
      }
      case POST_FILTERR.MOST_REACTIONS: {
        setUrl(URLS.MOST_REACTIONS);
        queryClient.invalidateQueries(['GetAllPosts']);
        break;
      }
      case POST_FILTERR.TOP_STORIES: {
          setUrl(URLS.TOP_STORIES);
          queryClient.invalidateQueries(['GetAllPosts']);
          break;
      }
      case POST_FILTERR.ALL: {
        setUrl(URLS.GET_POST);
        queryClient.invalidateQueries(['GetAllPosts']);
        break;
      }
    }
  }, [filterBy])

  const request = React.useCallback(() => {
    console.log(filterBy);
    return 
  }, [currentPage])


  // react query
  const { isLoading, isError, error } = useQuery(['GetAllPosts', currentPage], () => httpService.get(`${URLS.GET_QUESTIONS}`, {
    params: {
      page:currentPage
    }
  }), {
    onSuccess: async(data) => {
      if (posts.length > 0) {
        if (data.data) {
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
      alert(error.message)
    }
  });

  // mutations 
  // const markasViewed = useMutation({
  //   mutationFn: (data: { posts_id: number[] }) => httpService.post(`${URLS.INCREMENT_POST_VIEWS}`, data),
  //   onError: (error: any) => {
  //     alert(error.message);
  //   },
  //   onSuccess: (data) => {
  //     console.log(`this is were the data is`);
  //   }
  // })

  // functions
  const onEndReached = React.useCallback(async() => {
    if ((total / 12) === currentPage) {
      return;
    } else {
      // get more items
      //markasViewed.mutate({ posts_id: ids });
      // increment page number
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, ids]);

  return (
    <Box backgroundColor='mainBackGroundColor' flex={1}>
        
        <FlashList 
          onEndReached={onEndReached}
          onEndReachedThreshold={1}
          ListEmptyComponent={() => (
            <CustomText variant='body'>No Questions to view</CustomText>
          )}
          estimatedItemSize={100}
          renderItem={({ item }) => (
            <PostCard {...item} showStats />
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
    </Box>
  )
}

export default Questions