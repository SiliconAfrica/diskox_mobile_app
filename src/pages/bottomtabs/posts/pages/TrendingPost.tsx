import { View, Text, ActivityIndicator, RefreshControl } from "react-native";
import React from "react";
import Box from "../../../../components/general/Box";
import Searchbar from "../../../../components/Searchbar";
import { useUtilState } from "../../../../states/util";
import { FlashList, } from "@shopify/flash-list";
import FilterTopbar, { FILTER_BAR_ENUM } from "../../../../components/feeds/FilterTopbar";
import PostCard from "../../../../components/feeds/PostCard";
import { IPost } from "../../../../models/post";
import { useQuery, useMutation, useQueryClient } from "react-query";
import httpService from "../../../../utils/httpService";
import CustomText from "../../../../components/general/CustomText";
import { URLS } from "../../../../services/urls";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../../../theme";
import { useModalState } from "../../../../states/modalState";
import { POST_FILTERR } from "../../../../enums/Postfilters";
import AnnouncementBox from "../../../../components/announcements/announcementBox";
import useToast from "../../../../hooks/useToast";
import _ from 'lodash'
import { FlatList } from "react-native-gesture-handler";
import { CUSTOM_STATUS_CODE } from "../../../../enums/CustomCodes";
import FeedCard from "../../../../components/feeds/FeedCard";

const TrendingPost = ({
  activeTab,
  onActive
}: {
  activeTab: FILTER_BAR_ENUM,
  onActive: (data: FILTER_BAR_ENUM) => void
}) => {
  const { isLoggedIn, isDarkMode } = useUtilState((state) => state);
  const { setAll, filterBy } = useModalState((state) => state);
  const theme = useTheme<Theme>();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);
  const toast = useToast();

  // states
  const [posts, setPosts] = React.useState<IPost[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [ids, setIds] = React.useState<number[]>([]);
  const [perPage, setPerPage] = React.useState(0);
  const [noMore, setNoMore] = React.useState(false);

  // react query
  const { isLoading, isError, error, refetch } = useQuery(
    ["GetTrendingPosts", currentPage],
    () => httpService.get(`${URLS.GET_TRENDING_POSTS}`, {
      params: {
        page: currentPage,
      }
    }),
    {
      onSuccess: async (data) => {
        console.log(data.data.code);
        if (data.data.code === CUSTOM_STATUS_CODE.INTERNAL_SERVER_ERROR) {
          toast.show(data.data?.message, { type: 'warning', placement: 'top' });
        }
        if (data.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
          if (posts.length > 0) {
            if (data.data?.data !== undefined) {
              const uniqArr = _.uniqBy<IPost>([...posts, ...data.data?.data?.data], 'id')
              setPosts(uniqArr);
              const postData: IPost[] = data.data?.data?.data as IPost[];
              const postids = postData.map((item) => item.id);
              setIds(postids);
            } else {
              setNoMore(true);
              //toast.show(data.data?.message, { type: 'success'});
            }
          } else {
            setPosts(data.data.data.data);
            setTotal(data.data.data.total);
            const postData: IPost[] = data.data.data.data as IPost[];
            const postids = postData.map((item) => item.id);
            setIds(postids);
            setPerPage(data.data.data.per_page);
          }
        }
      },
      onError: (error: any) => {
        toast.show(error.message, { type: 'error'});
      },
    }
  );



  // mutations
  const markasViewed = useMutation({
    mutationFn: (data: { posts_id: number[] }) =>
      httpService.post(`${URLS.INCREMENT_POST_VIEWS}`, data),
    onError: (error: any) => {
      toast.show(error.message, { type: 'error'});
    },
    onSuccess: (data) => {
    },
  });

  // functions
  const onEndReached = React.useCallback(async () => {
    const startIndex = (currentPage -1) * perPage;
        const endIndex = Math.min(startIndex + perPage -1, total - 1);
        if (currentPage < endIndex && posts.length > 0 && noMore === false && !isLoading) {
          // markasViewed.mutate({ posts_id: ids });
          setCurrentPage(prev => prev+1);
      }
  }, [currentPage, ids, perPage, total, noMore, isLoading]);

  const handleRefresh = () => {
    if (!isLoading) {
      refetch();
    }
  }

  return (
    <Box
      backgroundColor={
        isDarkMode ? "mainBackGroundColor" : "secondaryBackGroundColor"
      }
      flex={1}
    >
      {  (
        <FlatList
        refreshControl={
          <RefreshControl 
            refreshing={isLoading && posts.length> 0}
            onRefresh={handleRefresh} 
            progressViewOffset={50}
            progressBackgroundColor={theme.colors.primaryColor}
            colors={['white']}
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={1}
        ListEmptyComponent={() => (
          <>
            {!isLoading && posts.length < 1 && (
              <CustomText variant="body" textAlign="center" marginTop="s">No Post to view</CustomText>
              )}
          </>
        )}
        ListHeaderComponent={() => (
          <Box bg={isDarkMode ? "mainBackGroundColor":"secondaryBackGroundColor"} style={{ marginBottom: 15 }}>
            { isLoggedIn && <Searchbar /> }
            <Box height={15}/>
            <FilterTopbar activeTab={activeTab} onActive={(data) => onActive(data)} />
          </Box>
      )}
        // estimatedItemSize={1000}
        keyExtractor={(item, index) => item.id.toString()}
        extraData={posts}
        renderItem={({ item }) => <FeedCard post={item} showReactions />}
        data={posts}
        ListFooterComponent={() => (
          <Box width="100%" alignItems="center" marginVertical="m">
            {isLoading && (
              <ActivityIndicator
                size="small"
                color={theme.colors.primaryColor}
              />
            )}
            {
              !isLoading && noMore && (
                <CustomText textAlign="center">Thats all for now</CustomText>
              )
            }
          </Box>
        )}
      />
      )}
    </Box>
  );
};


export default TrendingPost