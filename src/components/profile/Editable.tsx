import { View, Text, TextInput } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import CustomText from '../general/CustomText';
import {Ionicons, Feather} from '@expo/vector-icons';

interface IProps {
    value: string;
    onChangeText?: (text: string) => void;
    title: string;
    subtitle?: string;
    textarea?: boolean;
    showEditIcon?: boolean;
}

const Editable = ({ value, onChangeText, title, subtitle = null, textarea = false, showEditIcon = true }: IProps) => {
    const [editingMode, setEditingMode] = React.useState(false);

    const theme = useTheme<Theme>();
  return (
    <Box width='100%' marginBottom='m'>
        <CustomText variant='subheader' fontSize={18}>{title}</CustomText>
        { subtitle && <CustomText variant='xs'>{subtitle && subtitle}</CustomText> }

        <Box marginTop='s' width='100%' borderRadius={10} height={45} borderWidth={2} borderColor={ editingMode ? 'secondaryBackGroundColor' : 'mainBackGroundColor' as any} flexDirection='row' alignItems='center' paddingHorizontal={ editingMode ? 'm':null}>

            <TextInput style={{ fontFamily: 'RedRegular', fontSize: 18, color: theme.colors.textColor, flex: 1 }} editable={editingMode} value={value} onChangeText={onChangeText} multiline={textarea} numberOfLines={textarea ? 4:1} />

            { showEditIcon && <Feather name={ editingMode ? 'x':'edit-2'} size={25} color={theme.colors.textColor} onPress={() => setEditingMode(prev => !prev)} /> }

        </Box>  
    </Box>
  )
}

export default Editable