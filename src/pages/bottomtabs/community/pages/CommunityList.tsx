import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import Box from '../../../../components/general/Box'
import CustomText from '../../../../components/general/CustomText'
import FadedButton from '../../../../components/general/FadedButton'
import { ScrollView } from 'react-native-gesture-handler'
import CommunityListCard from '../../../../components/community/CommunityListCard'
import { useQueries, useQuery } from 'react-query'
import httpService from '../../../../utils/httpService'
import { URLS } from '../../../../services/urls'
import { FlashList } from '@shopify/flash-list'
import { ICommunity } from '../../../../models/Community'
import { Theme } from '../../../../theme'
import { useTheme } from '@shopify/restyle'
import ReactNavtieModalWrapper from '../../../../components/ReactNavtieModalWrapper'
import CreateCommunityModal from '../../../../components/modals/CreateCommunityModal'

const CommunityList = () => {
  const theme = useTheme<Theme>();
  const [showModal, setShowModal] = React.useState(false);
  const { isLoading,isError, data } = useQuery(['getCommunities'], () => httpService.get(`${URLS.GET_COMMUNITIES}`))
  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
      {/* MODALS */}
      <CreateCommunityModal isVisisble={showModal} onClose={() => setShowModal(prev => !prev)} />

      {/* HEADER */}
      <Box width='100%' flexDirection='row' justifyContent='space-between' alignItems='center' paddingHorizontal='s' marginTop='m' paddingBottom='m'>
        <CustomText variant='header' fontSize={15}>Explore Popular communities</CustomText>
        <FadedButton title='Create community' width={150} height={40} onPress={() => setShowModal(true)} />
      </Box>

     <FlashList 
     estimatedItemSize={20}
      ListFooterComponent={() => (
        <>
          {
            isLoading && (
              <Box width='100%' alignItems='center' justifyContent='center'>
                <ActivityIndicator size='large' color={theme.colors.primaryColor} />
              </Box>
            )
          }
        </>
      )}
      data={data?.data.data?.data as ICommunity[]}
      keyExtractor={(item, index)  => index.toString()}
      renderItem={({ item}) => (
        <CommunityListCard {...item} />
      )}
     />
    </Box>
  )
}

export default CommunityList