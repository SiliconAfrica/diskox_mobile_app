import { View, Text } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import PrimaryButton from '../general/PrimaryButton'
import CustomText from '../general/CustomText'
import { useNavigation } from '@react-navigation/native'
import { PageType } from '../../pages/login'

const CommunityListCard = () => {
  const text = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam, debitis!';

  const navigation = useNavigation<PageType>();

  return (
    <Box width={'100%'} height={100} flexDirection='row' justifyContent='space-between' alignItems='center' paddingHorizontal='m'   borderBottomColor='secondaryBackGroundColor' borderBottomWidth={2}>

        <Box flexDirection='row' flex={0.6} alignItems='center'>
          <Box height={30} width={30} borderRadius={15} bg='primaryColor'></Box>

          <Box marginLeft='s'>
            <CustomText variant='subheader' fontSize={16}>c/thewildcats</CustomText>
            <CustomText variant='body' fontSize={15}>
              {text?.length > 20 ? text?.substring(0, 20) + '...' : text}
            </CustomText>
          </Box>
        </Box>

        <PrimaryButton title='Join' onPress={() => navigation.navigate('community', { id: 234 })} height={40} width={70}></PrimaryButton>
    </Box>
  )
}

export default CommunityListCard