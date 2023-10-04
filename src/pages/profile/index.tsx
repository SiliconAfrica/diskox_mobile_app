import { View, Text, useWindowDimensions } from 'react-native'
import React from 'react'
import Box from '../../components/general/Box'
import { FlashList } from '@shopify/flash-list'
import BannerSection, { ACTIVE_TAB } from '../../components/profile/BannerSection'
import CustomText from '../../components/general/CustomText'
import { ScrollView } from 'react-native-gesture-handler'
import Overview from './pages/overview'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigation/MainNavigation'
import UserPosts from './pages/Posts'
import Upvotes from './pages/Upvotes'
import Comments from './pages/Comments'
import Polls from './pages/Polls'


const Profile = ({ route }: NativeStackScreenProps<RootStackParamList, 'profile'>) => {

  const { userId } = route.params;
  const [currentTab, setCurrentTab] = React.useState(ACTIVE_TAB.OVERVIEW);
 
  const HEIGHT = useWindowDimensions().height;

  const switchTab = React.useCallback((num: ACTIVE_TAB) => {
    setCurrentTab(num);
  }, []);

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
    }
  }, [currentTab]);


  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
      <ScrollView>
        <BannerSection currentTab={currentTab} switchTab={switchTab} />
        <Box width='100%' height={HEIGHT / 100 * 89}>
          {activePage()}
        </Box>
      </ScrollView>
      {/* <FlashList 
        ListHeaderComponent={() => <BannerSection currentTab={currentTab} switchTab={switchTab} />}
        stickyHeaderHiddenOnScroll
        estimatedItemSize={100}
        keyExtractor={(item, index) => index.toString()}
        data={nums}
        extraData={nums}
        renderItem={({ item }) => (
          <CustomText>{item}</CustomText>
        )}
      /> */}
    </Box>
  )
}

export default Profile