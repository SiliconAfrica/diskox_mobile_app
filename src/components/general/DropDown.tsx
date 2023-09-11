import { View, Text, TextInput } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import CustomText from '../general/CustomText';
import {Ionicons, Feather} from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

interface IProps {
    value: string;
    onChangeText?: (text: string) => void;
    title: string;
    options: Array<string>;
    onSelected: (val: string) => void
}

const CustomDropDwon = ({ value, onChangeText, title, options = [], onSelected }: IProps) => {
    const [editingMode, setEditingMode] = React.useState(false);

    const theme = useTheme<Theme>();
    const handleSelect = React.useCallback((val: string) => {
        onSelected(val)
        setEditingMode(false)
    }, [])
  return (
    <Box width='100%' marginBottom='m'>
        <CustomText variant='subheader' fontSize={18}>{title}</CustomText>

        <Box marginTop='s' width='100%' height={45}  flexDirection='row' alignItems='center' justifyContent='space-between'>

            <CustomText variant='body'>{value}</CustomText>

            <Ionicons name={editingMode ? 'caret-up-outline':'caret-down-outline'} size={25} color={theme.colors.textColor} onPress={() => setEditingMode(prev => !prev)} /> 

        </Box> 
        { editingMode && (
            <Box width={'100%'} maxHeight={200} zIndex={100} borderWidth={2} borderColor='secondaryBackGroundColor' borderRadius={10}>
                <ScrollView contentContainerStyle={{ padding: 10 }}>
                    {options.map((item, index) => (
                        <CustomText variant='body' key={index} marginBottom={index === options.length - 1 ? null : 'm'} onPress={() => handleSelect(item)}>{item}</CustomText>
                    ))}
                </ScrollView>
            </Box> 
        )}
    </Box>
  )
}

export default CustomDropDwon;