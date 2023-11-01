import { View, Text } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import PrimaryButton from '../general/PrimaryButton'
import CustomText from '../general/CustomText'
import { useNavigation } from '@react-navigation/native'
import { PageType } from '../../pages/login'
import { ICommunity } from '../../models/Community'
import { Image } from 'expo-image'
import httpService, { IMAGE_BASE } from '../../utils/httpService'
import { useMutation, useQueryClient } from 'react-query'
import { URLS } from '../../services/urls'

const CommunityListCard = (props: ICommunity) => {
  const { name, description, profile_image, id, is_member } = props;
  const navigation = useNavigation<PageType>();
  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation({
    mutationFn: ()=> httpService.post(`${URLS.JOIN_COMMUNITY}/${id}`),
    onSuccess: (data) => {
      alert(`You've successfully join ${name} community`);
      queryClient.invalidateQueries(['getCommunities']);
      navigation.navigate('community', { id, data: props })
    },
    onError: () => {
      alert('An error occured');
    }
  });

  return (
    <Box width={'100%'} height={100} flexDirection='row' justifyContent='space-between' alignItems='center' paddingHorizontal='m'   borderBottomColor='secondaryBackGroundColor' borderBottomWidth={2}>

        <Box flexDirection='row' flex={0.6} alignItems='center'>
          <Box height={30} width={30} borderRadius={15} bg='primaryColor' overflow='hidden'>
            <Image source={{ uri: `${IMAGE_BASE}${profile_image}`}} contentFit='cover' style={{ width: '100%', height: '100%'}} />
          </Box>

          <Box marginLeft='s'>
            <CustomText variant='subheader' fontSize={16}>{name}</CustomText>
            <CustomText variant='body' fontSize={15}>
              {description?.length > 20 ? description?.substring(0, 20) + '...' : description}
            </CustomText>
          </Box>
        </Box>

        { is_member === 0 && (
          <PrimaryButton title='Join' onPress={() => mutate()} height={35} width={70}></PrimaryButton>
        )}
        { is_member !== 0 && (
          <PrimaryButton title='View' onPress={() => navigation.navigate('community', { id, data: props })} height={35} width={70}></PrimaryButton>
        )}
    </Box>
  )
}

export default CommunityListCard