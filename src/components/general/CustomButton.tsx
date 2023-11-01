import React from 'react'
import { ActivityIndicator, Pressable } from 'react-native';
import CustomText from './CustomText';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';

interface IProps {
    width?: number|string;
    height?: number|string;
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    color?: string;
    textColor?: string;
}

const CustomButton = ({ title, onPress, width = 120, height = 45, isLoading = false, color='grey', textColor = 'white'}: IProps) => {
    const theme = useTheme<Theme>();
  return (
    <Pressable onPress={onPress} style={{ backgroundColor: color, borderRadius: 25, width, height, justifyContent: 'center', alignItems: 'center' }}>
        { isLoading && <ActivityIndicator color={theme.colors.primaryColor} size='small' /> }
        { !isLoading && <CustomText variant="header" color='primaryColor' fontSize={16} style={{ color: textColor }}>{title}</CustomText> }
    </Pressable>
  )
}

export default CustomButton
