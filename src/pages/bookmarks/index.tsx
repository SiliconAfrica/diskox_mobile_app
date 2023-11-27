import React from 'react';
import { View } from 'react-native';
import Box from '../../components/general/Box';
import SettingsHeader from '../../components/settings/Header';
import { useQuery } from 'react-query';
import { useDetailsState } from '../../states/userState';
import httpService from '../../utils/httpService';
import { URLS } from '../../services/urls';
import { IPost } from '../../models/post';
import CustomText from '../../components/general/CustomText';
import { FlashList } from '@shopify/flash-list';
import PostCard from '../../components/feeds/PostCard';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import _ from 'lodash';
import FeedCard from '../../components/feeds/FeedCard';

// import { Container } from './styles';

const Bookmarks: React.FC = () => {
    const [posts, setPosts] = React.useState<IPost[]>([]);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [totalItems, setTotalItems] = React.useState<number|null>(0);
    const [perPage, setPerPage] = React.useState(0);

    const { id } = useDetailsState((state) => state)
    const { isLoading, isError, error, refetch } = useQuery(['getBookmarks', page], () => httpService.get(`${URLS.GET_BOOKMARK_POSTS}`, {
        params: {
            page
        }
    }), {
        onSuccess: (data) => {
            if (posts.length < 1) {
                setPosts(data.data.data.data);
                setTotalItems(data.data.data.total);
                setPerPage(data.data.data.per_page);
            } else {
                const uniqArra = _.uniqBy<IPost>([...posts, ...data.data.data.data], 'id');
                setPosts(uniqArra);
            }
        }
    });

    const onEndReached = () => {
        const startIndex = (page -1) * perPage;
        const endIndex = Math.min(startIndex + perPage -1, totalItems - 1);
        if (page !== endIndex) {
            setPage(page + 1);
        }
    }
  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
        <SettingsHeader title='Bookmarks' showSave={false}  />
        { !isLoading  && isError && (
            <Box width={'100%'} height={120} alignItems='center'>
                <CustomText>{(error as any)?.message}</CustomText>
            </Box>
        )}
        { !isError && (
            <FlatList 
                data={posts}
                keyExtractor={(item: IPost, index) => item.id.toString()}
                renderItem={({ item }) => (
                    <FeedCard post={item} showReactions />
                )}
                refreshControl={<RefreshControl onRefresh={refetch} refreshing={isLoading} />}
                ListFooterComponent={() => (
                    <>
                        { isLoading || isRefreshing && (
                            <Box width={'100%'} height={120} alignItems='center'>
                                <CustomText>{(error as any)?.message}</CustomText>
                            </Box>
                        )}
                    </>
                )}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
            />
        )}
    </Box>
  )
}

export default Bookmarks;