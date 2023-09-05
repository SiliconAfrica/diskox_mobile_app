import { View, Text } from 'react-native'
import React from 'react'
import Box from '../../../../components/general/Box'
import CustomText from '../../../../components/general/CustomText'
import FadedButton from '../../../../components/general/FadedButton'
import { ScrollView } from 'react-native-gesture-handler'
import CommunityListCard from '../../../../components/community/CommunityListCard'

const arr = [1,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,33,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3];
const CommunityList = () => {
  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>

      {/* HEADER */}
      <Box width='100%' flexDirection='row' justifyContent='space-between' alignItems='center' paddingHorizontal='s' marginTop='m' paddingBottom='m'>
        <CustomText>Explore Popular communities</CustomText>
        <FadedButton title='Create community' width={150} onPress={() => {}} />
      </Box>

      <ScrollView>
        { arr.map((item, index) => (
          <CommunityListCard key={index} />
        ))}
      </ScrollView>
    </Box>
  )
}

export default CommunityList