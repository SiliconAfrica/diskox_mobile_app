import { View, Text } from 'react-native'
import React from 'react'
import Box from '../general/Box';
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import CustomText from '../general/CustomText';


interface IProps {
    title: string;
    showSave: boolean;
    onSave?: () => void,
    handleArrowPressed?: () => void;
    rightItem?: JSX.Element;
}

const SettingsHeader = ({ title, showSave = false, onSave, handleArrowPressed = null, rightItem }: IProps) => {
  const theme = useTheme<Theme>();
  
  return (
    <Box width='100%' height={100} paddingHorizontal='m' paddingTop='l' backgroundColor='mainBackGroundColor' flexDirection='row' justifyContent='space-between' alignItems='center' borderBottomWidth={2} borderBottomColor='secondaryBackGroundColor'>
        <Box flexDirection='row' alignItems='center'>
          <Ionicons name='arrow-back-outline' size={25} color={theme.colors.textColor} onPress={handleArrowPressed ? handleArrowPressed: null} />
          <CustomText variant='subheader' marginLeft='s'>{title}</CustomText>
        </Box>

        { showSave && rightItem && rightItem }
    </Box>
  )
}

export default SettingsHeader