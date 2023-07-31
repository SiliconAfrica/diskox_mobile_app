import { View, Text, Pressable, PressableProps, ViewStyle } from 'react-native'
import React from 'react'
import CustomText from './CustomText'

const LightBgButton = ({ action, label, style } : {
    label: string,
    action: () => void,
    style: ViewStyle
}) => {


  return (
    <Pressable 
        onPress={() => action()}
        style={{
          backgroundColor: '#34a85350',
          borderRadius: 50,
          height: 45,
          width: '100%',
          justifyContent:'center',
          alignItems:'center',
          marginTop: 20,
          ...style
        }}>
          <CustomText color="primaryColor">{label}</CustomText>
        </Pressable>
  )
}

export default LightBgButton