import { View, Text, useWindowDimensions, StatusBar } from 'react-native'
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
import {useQueryClient} from "react-query";
import {Theme} from "../../theme";
import {useTheme} from "@shopify/restyle";


const Profile = ({ route }: NativeStackScreenProps<RootStackParamList, 'profile'>) => {
  const [refreshing, isRefreshing] = React.useState(false);
  const { userId } = route.params;
  const [currentTab, setCurrentTab] = React.useState(ACTIVE_TAB.OVERVIEW);

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
        return <Overview id={userId} />
      }
      case ACTIVE_TAB.POSTS: {
        return <UserPosts id={userId} />
      }
      case ACTIVE_TAB.UPVOTES: {
        return <Upvotes id={userId} />
      }
      case ACTIVE_TAB.COMMENTS: {
        return <Comments id={userId} />
      }
      case ACTIVE_TAB.POLLS: {
        return <Polls id={userId} />
      }
      case ACTIVE_TAB.DRAFTS: {
        return <Drafts id={userId} />
      }
    }
  }, [currentTab]);


  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
      <StatusBar animated backgroundColor={'transparent'} translucent={true} />
      <Header showMenuButton={false} />
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} disallowInterruption={true} tintColor={'white'} colors={[theme.colors.primaryColor]} progressBackgroundColor={'#3A3A3A'} style={{ backgroundColor: 'transparent' }} />} >
          <BannerSection currentTab={currentTab} switchTab={switchTab} id={userId} />
          <Box width='100%' height={HEIGHT / 100 * 83}>
            {activePage()}
          </Box>
        </ScrollView>
    </Box>
  )
}

export default Profile
