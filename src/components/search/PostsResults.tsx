import { View, Text } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import Box from '../general/Box'
import CustomText from '../general/CustomText'
import { IPost } from '../../models/post'
import PostCard from '../feeds/PostCard'
import FeedCard from '../feeds/FeedCard'

const PostsResults = ({ data }: { data: IPost[]}) => {
  return (
    <FlatList 
    ListEmptyComponent={()  => (
        <Box px='m'>
            <CustomText>No Post found</CustomText>
        </Box>
    )}
    data={data}
    renderItem={({ item }) => (
        <FeedCard post={item} showReactions />
    )}
/>
  )
}

export default PostsResults