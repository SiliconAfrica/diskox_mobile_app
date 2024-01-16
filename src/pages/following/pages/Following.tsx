import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { useQuery } from 'react-query'
import httpService from '../../../utils/httpService'
import { URLS } from '../../../services/urls'
import { PaginatedResponse } from '../../../models/PaginatedResponse'
import { FollowingModel } from '../../../models/followingModal'
import _ from 'lodash'
import Box from '../../../components/general/Box'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../theme'
import FollowingCard from '../../../components/following/FollowingCard'
import { FlatList } from 'react-native-gesture-handler'
import CustomText from '../../../components/general/CustomText'

const Following = ({ id }: {
  id: number
}) => {
  const [page, setPage] = React.useState(1);
  const [followings, setFollowings] = React.useState<FollowingModel[]>([]);
  const [perPage, setPerPage] = React.useState(0);
  const [noMore, setNoMore] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  const theme = useTheme<Theme>();

  const { isLoading, isError } = useQuery([`getProfileFollowing-${id}`, page], () => httpService.get(`${URLS.GET_USER_FOLLOWING}/${id}`, {
    params: {
      page
    }
  }), {
    onSuccess: (data) => {
      const item: PaginatedResponse<FollowingModel> = data.data;
      console.log(item);
      if (followings?.length > 0) {
        if (item?.data?.data?.length !== undefined) {
          setFollowings(_.uniq([...followings, ...item.data.data]));
        } else {
          setNoMore(true);
        }
      } else {
        setFollowings(item.data.data);
        setTotal(item.data.total);
        setPerPage(item.data.per_page);
      }
    }
  })

  const onEndReached = () => {
    console.log(`total is ${total}`);
    console.log(`current users length ${followings.length}`)
    if (followings.length < total && !isLoading) {
      setPage(prev => prev+1);
    }
    // alert('end reached');
  }
  return (
    <Box flex={1}>
      {isLoading && (
        <Box width='100%' height={60} justifyContent='center' alignItems='center'>
          <ActivityIndicator color={theme.colors.primaryColor} />
        </Box>
      )}
      {
        !isLoading && 
        <FlatList 
          onEndReached={onEndReached}
          onEndReachedThreshold={0.8}
          ListEmptyComponent={() => (
            <>
              <Box width='100%' height={50} justifyContent='center' alignItems='center'>
                <CustomText>You are not following any one.</CustomText>
              </Box>
            </>
          )}
          keyExtractor={(item, index) => index.toString()}
          data={followings}
          renderItem={({ item }) => <FollowingCard user={item} isFollower={false} />}
          ListFooterComponent={() => (
            <Box width="100%" alignItems="center" marginVertical="m">
              {isLoading &&  (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.primaryColor}
                />
              )}
            </Box>
          )}
        />
      }
    </Box>
  )
}

export default Following