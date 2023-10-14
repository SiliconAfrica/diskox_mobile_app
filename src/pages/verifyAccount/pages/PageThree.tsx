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

const PageThree = ({next}: {
    next: (num: number) => void
}) => {
    const theme = useTheme<Theme>();
  return (
    <Box flex={1} paddingTop='m'>
        <CustomText variant='header' fontSize={26}>Verify your account</CustomText>
        <CustomText variant='body' marginTop='m' color='grey'> A verified profile has a green checkmark next the username. Keep in mind that verified badge are for well-known, often searched profiles.  </CustomText>

        <CustomText variant='header' fontSize={18} marginTop='m' marginBottom='s' >Upload a picture of you holding your valid ID below your face</CustomText>
        <CustomText variant='xs' style={{ color: 'red' }}>Uploading any forged document would attract a permanent ban from diskox</CustomText>


        <Box width={'100%'} height={200}  borderRadius={15} borderWidth={1} borderStyle='dashed' borderColor='primaryColor' marginTop='m' overflow='hidden' >
            <Box flex={1}></Box>

            <Box width={'100%'} height={50} bg='fadedButtonBgColor' flexDirection='row' justifyContent='center' alignItems='center' >
                <Ionicons name='folder-outline' size={25} color={theme.colors.primaryColor} />
                <CustomText variant='header' fontSize={18} color='primaryColor' marginLeft='m'>Browse file (PNG or JPG)</CustomText>
            </Box>
        </Box>       

        <Box width={'100%'} flex={1} flexDirection='row' justifyContent='space-between' alignItems='center'>
            <BorderButton width={100} borderColor='black' height={44} title='Go Back' onPress={() => next(2)} borderRadius={10} />
            <PrimaryButton width={100} height={44} title='Next' onPress={() => next(4)} borderRadius={10} />
        </Box>
    </Box>
  )
}

export default PageThree