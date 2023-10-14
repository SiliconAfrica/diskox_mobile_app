import { View, Text } from 'react-native'
import React from 'react'
import Box from '../../../components/general/Box'
import CustomText from '../../../components/general/CustomText'
import { Feather, Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../theme'
import { useUtilState } from '../../../states/util'
import PrimaryButton from '../../../components/general/PrimaryButton'
import BorderButton from '../../../components/general/BorderButton'

const items = [
    'Celebrity',
    'Government Official',
    'Public Figure',
    'Media Outlet'
]

const PageTwo = ({next}: {
    next: (num: number) => void
}) => {
    const theme = useTheme<Theme>();
  return (
    <Box flex={1} paddingTop='m'>
        <CustomText variant='header' fontSize={26}>Verify your account</CustomText>
        <CustomText variant='body' marginTop='m' color='grey'> A verified profile has a green checkmark next the username. Keep in mind that verified badge are for well-known, often searched profiles.  </CustomText>

        <CustomText variant='header' fontSize={18} marginTop='m' marginBottom='s' >Upload any official government issued ID</CustomText>
        <CustomText variant='xs' style={{ color: 'red' }}>Uploading any forged document would attract a permanent ban from diskox</CustomText>


        <Box width={'100%'} height={200}  borderRadius={15} borderWidth={1} borderStyle='dashed' borderColor='primaryColor' marginTop='m' overflow='hidden' >
            <Box flex={1}></Box>

            <Box width={'100%'} height={50} bg='fadedButtonBgColor' justifyContent='center' alignItems='center' >
                <CustomText variant='header' fontSize={18} color='primaryColor'>UploadID</CustomText>
            </Box>
        </Box>       

        <Box width={'100%'} flex={1} flexDirection='row' justifyContent='space-between' alignItems='center'>
            <BorderButton width={100} borderColor={theme.colors.mainBackGroundColor} height={44} title='Go Back' onPress={() => next(1)} borderRadius={10} />
            <PrimaryButton width={100} height={44} title='Next' onPress={() => next(3)} borderRadius={10} />
        </Box>
    </Box>
  )
}

export default PageTwo