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

const Followers = ({ id }: {
  id: number
}) => {
  const [page, setPage] = React.useState(1);
  const [users, setUsers] = React.useState<FollowingModel[]>([]);
  const [perPage, setPerPage] = React.useState(0);
  const [noMore, setNoMore] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  const theme = useTheme<Theme>();

  const { isLoading, isError } = useQuery([`getUserFollowers-${id}`, page], () => httpService.get(`${URLS.GET_USERS_FOLLOWERS}/${id}`, {
    params: {
      page
    }
  }), {
    onSuccess: (data) => {
      const item: PaginatedResponse<FollowingModel> = data.data;
      if (users?.length > 0) {
        if (item?.data?.data?.length !== undefined) {
          setUsers(_.uniq([...users, ...item.data.data]));
        } else {
          setNoMore(true);
        }
      } else {
        setUsers(item.data.data);
        setTotal(item.data.total);
        setPerPage(item.data.per_page);
      }
    }
  })

  const onEndReached = () => {
    if (users.length < total && !isLoading) {
      setPage(prev => prev+1);
    }
    // alert('end reached');
  };

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
          onEndReachedThreshold={10.8}
          ListEmptyComponent={() => (
            <>
              <Box width='100%' height={50} justifyContent='center' alignItems='center'>
                <CustomText>You are not following any one.</CustomText>
              </Box>
            </>
          )}
          keyExtractor={(item, index) => index.toString()}
          data={users}
          renderItem={({ item }) => <FollowingCard user={item} isFollower />}
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

export default Followers