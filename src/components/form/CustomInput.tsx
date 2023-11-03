import { TextInputProps, TextInput, StyleSheet, Alert, ViewStyle } from 'react-native'
import { Controller, useFormContext } from 'react-hook-form';
import React from 'react'
import { Colors, TextField } from 'react-native-ui-lib';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import Box from '../general/Box';
import CustomText from '../general/CustomText';
import { Ionicons } from '@expo/vector-icons'

interface IProps {
    required?: boolean;
    name: string;
    placeholder: string;
    isPassword?: boolean;
    containerStyle?: ViewStyle;
    label?: string;
    showLabel?: boolean;
}

export const CustomTextInput = (props: IProps & TextInputProps) => {
    const [focused, setFocused] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(true);
    const theme = useTheme<Theme>();

    // form context
    const { control, formState: { errors }} = useFormContext();
  return (
    <Box style={{ ...props.containerStyle }}>
        {props.showLabel || props.showLabel === undefined && (
            <Box flexDirection='row'>
                <CustomText variant='xs' fontFamily='RedRegular' marginBottom='s'>{props.label || props.placeholder }</CustomText>
                { props.required && <CustomText style={{ color: 'red' }}>*</CustomText> }
            </Box>
        )}
      <Controller 
        control={control}
        rules={{
            required: props.required || false,
        }}
        name={props.name}
        render={({ field: { onChange, value  }}) => {
            return (
                <Box style={[Style.parent, { borderColor: focused && !errors[props.name] ? theme.colors.primaryColor : errors[props.name] ? Colors.red10 : 'lightgrey', }]}>
                    <Box style={{ flex: 1, justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 10 }}>
                        {/* {focused && <Text variant='xs'>{props.placeholder || props.name}</Text>} */}
                        <TextInput {...props} placeholderTextColor={theme.colors.textColor} cursorColor={theme.colors.textColor}  placeholder={!focused ? props.placeholder || props.name: ''} value={value} onChangeText={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}  secureTextEntry={props.isPassword ? showPassword : false} style={{ color: theme.colors.textColor, fontFamily: 'RedRegular' }} />

                       
                    </Box>
                    { props.isPassword && (
                            <Ionicons onPress={() => setShowPassword(prev => !prev)} name={showPassword ? 'eye':'eye-off'} size={25} color={theme.colors.textColor} />
                    )}
                </Box>
            )
        }}
      />
      {errors[props.name] && <CustomText variant='xs' style={{ color: 'red' }}>{errors[props.name]?.message as any}</CustomText>}
    </Box>
  )
}

const Style = StyleSheet.create({
    parent: {
        width: '100%',
        height: 52,
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    textInput: {
        width: '100%',
        marginBottom: 10
    }
});

// export CustomTextInput