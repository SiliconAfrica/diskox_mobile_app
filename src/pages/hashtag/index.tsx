import { View, Text, TextInput, RefreshControl, FlatList, ActivityIndicator } from 'react-native'
import React from 'react'
import Box from '../../components/general/Box'
import { ArrowLeft } from 'iconsax-react-native'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import { useQuery } from 'react-query'
import httpService from '../../utils/httpService'
import { URLS } from '../../services/urls'
import { CUSTOM_STATUS_CODE } from '../../enums/CustomCodes'
import { IPost } from '../../models/post'
import _ from 'lodash'
import { RootStackParamList } from '../../navigation/MainNavigation'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import CustomText from '../../components/general/CustomText'
import PostCard from '../../components/feeds/PostCard'
import PollCard from '../../components/feeds/PollCard'
import Header from '../../components/Header'
import useDebounce from '../../hooks/useDebounce'

const Hashtag = ({
    route,
    navigation,
  }: NativeStackScreenProps<RootStackParamList, "hashtag">) => {
    const { hashTag: tag } = route.params;

    const [hashTag, setHashtag] = React.useState(tag);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const [posts, setPosts] = React.useState<IPost[]>([]);
    const [perPage, setPerPage] = React.useState(0);
    const [noMore, setNoMore] = React.useState(false);

    const theme = useTheme<Theme>();
    const debounceValue = useDebounce(hashTag);

    const { isLoading, isError, refetch } = useQuery(['get_post_by_hashtag', debounceValue, currentPage], () => httpService.get(`${URLS.FETCH_POSTS_BY_HASHTAG}/${debounceValue}`, {
        params: {
            page: currentPage
        }
    }), {
        onSuccess: (data) => {
            if (data.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
                if (data.data?.data !== undefined) {
                    const uniqArr = _.uniqBy<IPost>([...posts, ...data.data?.data?.data], 'id')
                    setPosts(uniqArr);
                    const postData: IPost[] = data.data?.data?.data as IPost[];
                    const postids = postData.map((item) => item.id);
                  } else {
                    setNoMore(true);
                    //toast.show(data.data?.message, { type: 'success'});
                  }
                } else {
                  setPosts(data.data.data.data);
                  setTotal(data.data.data.total);
                  const postData: IPost[] = data.data.data.data as IPost[];
                  const postids = postData.map((item) => item.id);
                  setPerPage(data.data.data.per_page);
                }
            }
    })

     // functions
  const onEndReached = React.useCallback(async () => {
    const startIndex = (currentPage -1) * perPage;
        const endIndex = Math.min(startIndex + perPage -1, total - 1);
        if (currentPage < endIndex && posts.length > 0 && noMore === false && !isLoading) {
          setCurrentPage(prev => prev+1);
      }
  }, [currentPage, perPage, total, noMore, isLoading]);

  const handleRefresh = () => {
    if (!isLoading) {
      refetch();
    }
  }
  return (
    <Box flex={1} backgroundColor='secondaryBackGroundColor'>
        <Header showMenuButton={false} />
        <Box flexDirection='row' width='100%' alignItems='center' paddingHorizontal='l' height={60}>
            <ArrowLeft onPress={() => navigation.goBack()} size={20} color={theme.colors.textColor} />
            <TextInput value={hashTag} onChangeText={(e) => setHashtag(e)} style={{ flex: 1, height: 40, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.inputBorderColorLight, marginLeft: 20, color: theme.colors.textColor, paddingHorizontal: 20, fontFamily: 'RedRegular' }} />
        </Box>
        <Box flex={1}>
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
            {!isLoading && (
              <CustomText variant="body" textAlign="center" marginTop="s">No Post to view</CustomText>
              )}
          </>
        )}
        // estimatedItemSize={1000}
        keyExtractor={(item, index) => item.id.toString()}
        extraData={posts}
        renderItem={({ item }) => (
            <>
                { item.post_type === 'poll' ? <PollCard showStats {...item} />:<PostCard {...item} showStats />}
            </>
        )}
        ListHeaderComponent={() => (
          <>
            
          </>
        )}
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
        </Box>
    </Box>
  )
}

export default Hashtag