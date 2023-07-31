import { View, Text } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import CustomText from '../general/CustomText'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'

const FilterTopbar = () => {
    const theme = useTheme<Theme>();

  return (
    <Box borderBottomWidth={1} borderBottomColor='secondaryBackGroundColor' height={80} borderTopWidth={1} borderTopColor='secondaryBackGroundColor' backgroundColor='mainBackGroundColor' width='100%' flexDirection='row' justifyContent='space-between' alignItems='center' paddingHorizontal='m' marginVertical='s'>

        <View style={{ height: 40, width: '35%', borderRadius: 30, backgroundColor: '#F7FCF9', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <CustomText variant='body' color='primaryColor'>Sort</CustomText>
            <Ionicons name='chevron-down-outline' size={15} color={theme.colors.primaryColor} style={{ marginLeft: 6, marginTop: 3 }} />
        </View>

        <View style={{ height: 40,  borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name='flash-outline' size={25} color={theme.colors.textColor} style={{ marginRight: 4 }} />
            <CustomText variant='body'>New</CustomText>
        </View>

        <View style={{ height: 40,  borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name='arrow-up-outline' size={25} color={theme.colors.textColor} style={{ marginRight: 4 }} />
            <CustomText variant='body'>Top Stories</CustomText>
        </View>

    </Box>
  )
}

export default FilterTopbar