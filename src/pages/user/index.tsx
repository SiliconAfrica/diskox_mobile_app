import {View, Text, useWindowDimensions, StatusBar, ActivityIndicator} from 'react-native'
import React from 'react'
import Box from '../../components/general/Box'
import BannerSection, { ACTIVE_TAB } from '../../components/profile/BannerSection'
import CustomText from '../../components/general/CustomText'
import { ScrollView, RefreshControl } from 'react-native-gesture-handler'
import Overview from './pages/overview'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigation/MainNavigation'
import UserPosts from './pages/Posts'
import Upvotes from './pages/Upvotes'
import Comments from './pages/Comments'
import Polls from './pages/Polls'
import Drafts from './pages/Drafts'
import Header from '../../components/Header'
import {useQuery, useQueryClient} from "react-query";
import {Theme} from "../../theme";
import {useTheme} from "@shopify/restyle";
import httpService from "../../utils/httpService";
import {URLS} from "../../services/urls";
import {IUser} from "../../models/user";


const MentionProfile = ({ route }: NativeStackScreenProps<RootStackParamList, 'mention-profile'>) => {
  const [refreshing, isRefreshing] = React.useState(false);
  const { username } = route.params;
  const [currentTab, setCurrentTab] = React.useState(ACTIVE_TAB.OVERVIEW);
  const [user, setUser] = React.useState<IUser|null>(null)

  const { isLoading, isError } = useQuery(['getMentionedProfile', username], () => httpService.get(`${URLS.GET_USER_BY_USERNAME}/${username}`), {
    retry: false,
    refetchInterval: false,
    onSuccess: (data) => {
      setUser(data.data.data);
    }
  })

  const HEIGHT = useWindowDimensions().height;
  const queryClient = useQueryClient();
  const theme = useTheme<Theme>();

  const switchTab = React.useCallback((num: ACTIVE_TAB) => {
    setCurrentTab(num);
  }, []);

  const handleRefresh = React.useCallback(() => {
    isRefreshing(true);
    queryClient.refetchQueries()
        .then(() => isRefreshing(false));
  }, [])

  const activePage = React.useCallback(() => {
    switch (currentTab) {
      case ACTIVE_TAB.OVERVIEW: {
        return <Overview id={user?.id} />
      }
      case ACTIVE_TAB.POSTS: {
        return <UserPosts id={user?.id} />
      }
      case ACTIVE_TAB.UPVOTES: {
        return <Upvotes id={user?.id} />
      }
      case ACTIVE_TAB.COMMENTS: {
        return <Comments id={user?.id} />
      }
      case ACTIVE_TAB.POLLS: {
        return <Polls id={user?.id} />
      }
      case ACTIVE_TAB.DRAFTS: {
        return <Drafts id={user?.id} />
      }
    }
  }, [currentTab, user]);

  if (isLoading) {
    return (
        <Box flex={1} backgroundColor='mainBackGroundColor' justifyContent={'center'} alignItems={'center'}>
          <ActivityIndicator size={'small'} color={theme.colors.primaryColor} />
          <CustomText>Loading Profile</CustomText>
        </Box>
    )
  }

  if (user !== null && !isLoading) {
    return (
        <Box flex={1} backgroundColor='mainBackGroundColor'>
          <StatusBar animated backgroundColor={'transparent'} translucent={true} />
          <Header showMenuButton={false} />
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} disallowInterruption={true} tintColor={'white'} colors={[theme.colors.primaryColor]} progressBackgroundColor={'#3A3A3A'} style={{ backgroundColor: 'transparent' }} />} >
            {<BannerSection currentTab={currentTab} switchTab={switchTab} id={user?.id}/> }
            <Box width='100%' height={HEIGHT / 100 * 83}>
              {activePage()}
            </Box>
          </ScrollView>
        </Box>
    )
  }

  if (user === null && !isLoading || isError) {
    return (
        <Box flex={1} backgroundColor='mainBackGroundColor'>
          <StatusBar animated backgroundColor={'transparent'} translucent={true} />
          <Header showMenuButton={false} />

          <Box flex={1}  justifyContent={'center'} alignItems={'center'}>
            <CustomText variant={'header'}>Error 404</CustomText>
            <CustomText variant={'body'}>This page has been abducted, try something else</CustomText>
          </Box>
        </Box>
    )
  }

}

export default MentionProfile
