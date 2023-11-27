import { View, Text } from 'react-native'
import React from 'react'
import Box from '../../../components/general/Box'
import CustomText from '../../../components/general/CustomText'
import { Feather, Ionicons } from '@expo/vector-icons'
import { backgroundColor, useTheme } from '@shopify/restyle'
import { Theme } from '../../../theme'
import { useUtilState } from '../../../states/util'
import PrimaryButton from '../../../components/general/PrimaryButton'
import { Pressable } from 'react-native';
import { useVerificationState } from '../state'
import useToast from '../../../hooks/useToast'

const items = [
    'Celebrity',
    'Government Official',
    'Public Figure',
    'Media Outlet'
]

const Items = ({ name, isActive, onPress }: { name: string, isActive: boolean, onPress: (text:string) => void }) => {
    const { isDarkMode } = useUtilState((state) => state);
    const theme = useTheme<Theme>();

    return (
        <Box flexDirection='row' alignItems='center' marginBottom='m'>
            <Pressable style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: theme.colors.textColor,
                backgroundColor: isActive ? theme.colors.primaryColor: 'transparent'
            }} 
            onPress={() => onPress(name)}
            ></Pressable>
            <CustomText variant='xs' fontSize={18} marginLeft='m'>{name}</CustomText>
        </Box>
    )
}

const PageOne = ({next}: {
    next: (num: number) => void
}) => {
    const theme = useTheme<Theme>();
    const toast = useToast();

    const { setAll, category } = useVerificationState((state) => state);

    const handlePress = (text: string) => {
        setAll({ category: text });
    }

    const handleNext = () => {
        if (category === '' || category === null) {
            toast.show('Please select a category to continue', { type: 'warning', placement: 'top', duration: 5000, style: { marginTop: 50 } });
            return;
        }else {
            next(2);
        }
    }
  return (
    <Box flex={1} paddingTop='m'>
        <CustomText variant='header' fontSize={26}>Verify your account</CustomText>
        <CustomText variant='xs' fontSize={18} marginTop='m'>A verified profile has a green checkmark next the username. Keep in mind that verified badge are for well-known, often searched profiles. </CustomText>

        <Box width={'100%'} backgroundColor='fadedButtonBgColor' borderRadius={15} borderWidth={2} borderColor='primaryColor' marginTop='m' padding='m'>
            <Box flexDirection='row'>
                <Ionicons name='warning-outline' size={20} color={theme.colors.black}  style={{ color: 'black' }} />
                <CustomText variant='header' marginLeft='s' fontSize={18} style={{ color: 'black' }}>Please Note</CustomText>
            </Box>
            <CustomText variant='body' fontSize={17} marginTop='s' color='grey'>If you do not fall under any of the category listed, it means you must have at least up to 100k followers and 10k total upvotes before your application for a badge can be considered for approval.</CustomText>
        </Box>
        <CustomText variant='header' fontSize={18} marginTop='m' marginBottom='m' >Select the category that best describes you</CustomText>
        { items.map((item, index) => (
            <Items key={index.toString()} name={item} onPress={handlePress} isActive={item === category} />
        ))}

        <Box width={'100%'} flex={1} justifyContent='center' alignItems='flex-end'>
            <PrimaryButton width={100} height={44} title='Next' onPress={handleNext} borderRadius={10} />
        </Box>
    </Box>
  )
}

export default PageOne