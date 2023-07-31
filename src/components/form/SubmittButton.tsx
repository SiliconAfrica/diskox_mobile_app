import React from 'react'
import { useForm, useFormContext } from 'react-hook-form'
import { Pressable } from 'react-native';
import { Colors, Button } from 'react-native-ui-lib'
import CustomText from '../general/CustomText';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';

interface IProps {
    onSubmit: (data: any) => void;
    label: string;
    isLoading?: boolean;
}



export const SubmitButton = ({ onSubmit, label, isLoading }: IProps ) => {
    const { handleSubmit, formState: { isDirty, isValid, isSubmitting } } = useFormContext();
    const theme = useTheme<Theme>();

    //disabled={!isDirty || !isValid  ? true: false}

  return (
    <>
       <Pressable onPress={handleSubmit(onSubmit)}  style={{ width: '100%', height: 45, backgroundColor: !isDirty || !isValid ? '#97E1CB': theme.colors.primaryColor, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
        <CustomText variant='body' style={{ fontSize: 17, fontFamily: 'RedRegular', color: !isDirty || !isValid ? theme.colors.primaryColor: 'white' }}>{isLoading ? 'submitting...':label}</CustomText>
      </Pressable>
    </>

  )
}
