import React from 'react'
import { ActivityIndicator, Pressable } from 'react-native';
import CustomText from './CustomText';
import { border, useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';

interface IProps {
    width?: number|string;
    height?: number|string;
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    borderRadius?: number;
    borderColor?: string;
}

const BorderButton = ({ title, onPress, width = 120, height = 45, isLoading = false, borderRadius = (height as number) / 2 || 25, borderColor }: IProps) => {
    const theme = useTheme<Theme>();
  return (
    <Pressable onPress={onPress} style={{ borderWidth: 1, borderColor: borderColor ?? theme.colors.mainBackGroundColor, borderRadius:  borderRadius, width, height, justifyContent: 'center', alignItems: 'center', }}>
        { isLoading && <ActivityIndicator color={'white'} size='small' /> }
        { !isLoading && <CustomText variant="subheader" color='textColor' fontSize={17}>{title}</CustomText> }
    </Pressable>
  )
}

export default BorderButton
