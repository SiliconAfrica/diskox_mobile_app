import { View, Text } from 'react-native'
import React from 'react'
import { FlashList } from '@shopify/flash-list'
import Box from '../general/Box'
import CustomText from '../general/CustomText'
import { IPost } from '../../models/post'
import PostCard from '../feeds/PostCard'
import FeedCard from '../feeds/FeedCard'

const PostsResults = ({ data }: { data: IPost[]}) => {
  return (
    <FlashList 
    estimatedItemSize={20}
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