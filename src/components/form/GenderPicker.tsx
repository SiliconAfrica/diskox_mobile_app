import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import CustomText from '../general/CustomText'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import { useUtilState } from '../../states/util'

const GenderPicker = ({ onChange }: { onChange: (gen: string) => void }) => {
    const theme = useTheme<Theme>();
    const [gender, setGender] = React.useState('male');
    const [isDark] = useUtilState((state) => [state.isDarkMode]);

    const handleChange = React.useCallback((gen: string) => {
        setGender(gen);
        onChange(gen);
    }, [])
  return (
    <Box width="100%" backgroundColor='mainBackGroundColor' marginTop='l'>
        <CustomText variant='body'>Gender</CustomText>

        <Box flexDirection='row' width='100%' marginTop='m' justifyContent='space-between'>

            <Pressable onPress={() =>handleChange('male')} style={{ width: '50%', flex: 0.49, height: 50 }}>
                <Box flex={1} height={50} flexDirection='row' justifyContent='center' alignItems='center' borderWidth={2} borderRadius={10} borderColor={gender === 'male' ? 'primaryColor':'secondaryBackGroundColor'} backgroundColor={gender === 'male' ? isDark ? 'secondaryBackGroundColor' : 'fadedButtonBgColor' : 'mainBackGroundColor'}>
                    <Ionicons name='male-outline' size={30} color={gender === 'male' ? theme.colors.primaryColor: theme.colors.textColor } />
                    <CustomText variant='body' marginLeft='m' color={gender === 'male' ? 'primaryColor' : 'textColor'}>Man</CustomText>
                </Box>
            </Pressable>

            <Pressable onPress={() =>handleChange('female')} style={{ width: '50%', flex: 0.49, height: 50 }}>
                <Box flex={1} height={50} flexDirection='row' justifyContent='center' alignItems='center' borderWidth={2} borderRadius={10} borderColor={gender === 'female' ? 'primaryColor':'secondaryBackGroundColor'} backgroundColor={gender === 'female' ? isDark ? 'secondaryBackGroundColor' : 'fadedButtonBgColor' : 'mainBackGroundColor'}>
                    <Ionicons name='female-outline' size={30} color={gender === 'female' ? theme.colors.primaryColor: theme.colors.textColor } />
                    <CustomText variant='body' marginLeft='m' color={gender === 'female' ? 'primaryColor' : 'textColor'}>Woman</CustomText>
                </Box>
            </Pressable>

        </Box>
    </Box>
  )
}

export default GenderPicker