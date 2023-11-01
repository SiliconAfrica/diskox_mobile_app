import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import CustomText from './CustomText'

const NormalButton = ({ label, action, isLoading = false }: {
    label: string,
    action: () => void;
    isLoading?: boolean
}) => {
    const theme = useTheme<Theme>();
  return (
    <Pressable 
        onPress={() => action()}
        style={{
          backgroundColor: theme.colors.primaryColor,
          borderRadius: 50,
          height: 38,
          width: '100%',
          justifyContent:'center',
          alignItems:'center',
          marginTop: 20,
        }}>
          <CustomText variant='header' fontSize={16} style={{ color: 'white' }}>
            { !isLoading && label }
            { isLoading && 'submitting...' }
          </CustomText>
        </Pressable>
  )
}

export default NormalButton