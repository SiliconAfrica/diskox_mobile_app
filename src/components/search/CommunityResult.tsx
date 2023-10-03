import { View, Text } from 'react-native'
import React from 'react'
import { FlashList } from '@shopify/flash-list'
import Box from '../general/Box'
import CustomText from '../general/CustomText'

const CommunityResult = ({ data }: { data: any[] }) => {
  return (
    <FlashList 
    estimatedItemSize={20}
    ListEmptyComponent={()  => (
        <Box px='m'>
            <CustomText>No communities found</CustomText>
        </Box>
    )}
    data={data}
    renderItem={({ item }) => (
        <></>
    )}
/>
  )
}

export default CommunityResult