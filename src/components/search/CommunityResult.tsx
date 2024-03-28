import { View, Text } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import Box from '../general/Box'
import CustomText from '../general/CustomText'
import CommunityListCard from "../community/CommunityListCard";

const CommunityResult = ({ data }: { data: any[] }) => {
  return (
    <FlatList 
    ListEmptyComponent={()  => (
        <Box px='m'>
            <CustomText>No communities found</CustomText>
        </Box>
    )}
    data={data}
    renderItem={({ item }) => (
       <CommunityListCard {...item} />
    )}
/>
  )
}

export default CommunityResult