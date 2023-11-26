import { View, Text } from 'react-native'
import React from 'react'
import Box from '../../../components/general/Box'
import FilterTopbar, { FILTER_BAR_ENUM } from '../../../components/feeds/FilterTopbar'
import { useUtilState } from '../../../states/util'
import Searchbar from '../../../components/Searchbar'
import NewPosts from './pages/NewPosts'
import FollowingPosts from './pages/FollowingPosts'
import TrendingPost from './pages/TrendingPost'

const Posts = () => {
  const [activeTab, setActiveTab] = React.useState(FILTER_BAR_ENUM.NEW)
  const { isLoggedIn, isDarkMode } = useUtilState((state) => state);

  const handleChange = React.useCallback(() => {
    switch(activeTab) {
      case FILTER_BAR_ENUM.NEW: {
        return <NewPosts activeTab={activeTab} onActive={(data) => setActiveTab(data)} />
      }
      case FILTER_BAR_ENUM.FOLLOWING: {
        return <FollowingPosts activeTab={activeTab} onActive={(data) => setActiveTab(data)} />
      }
      case FILTER_BAR_ENUM.TRENDING: {
        return <TrendingPost activeTab={activeTab} onActive={(data) => setActiveTab(data)} />
      }
    }
  }, [activeTab,setActiveTab])
  return (
    <Box flex={1} bg='mainBackGroundColor' paddingTop='s'>
      {handleChange()}
    </Box>
  )
}

export default Posts