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
}

const PrimaryButton = ({ title, onPress, width = 120, height = 45, isLoading = false}: IProps) => {
    const theme = useTheme<Theme>();
  return (
    <Pressable onPress={onPress} style={{ backgroundColor: theme.colors.primaryColor, borderWidth: 0, borderColor: theme.colors.primaryColor, borderRadius:  (height as number) / 2 || 25, width, height, justifyContent: 'center', alignItems: 'center' }}>
        { isLoading && <ActivityIndicator color={theme.colors.primaryColor} size='small' /> }
        { !isLoading && <CustomText variant="subheader" color='primaryColor' fontSize={15} style={{ color: 'white'}}>{title}</CustomText> }
    </Pressable>
  )
}

export default PrimaryButton
