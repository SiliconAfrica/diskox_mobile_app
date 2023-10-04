import { View, Text } from 'react-native'
import React from 'react'
import Box from '../../../../components/general/Box'
import SettingsHeader from '../../../../components/settings/Header'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../navigation/MainNavigation'
import useForm from '../../../../hooks/useForm'
import { CustomTextInput } from '../../../../components/form/CustomInput'
import { SubmitButton } from '../../../../components/form/SubmittButton'
import { changePasswordSchema } from '../../../../services/validations'
import { useMutation } from 'react-query'
import httpService from '../../../../utils/httpService'
import { URLS } from '../../../../services/urls'
import useToast from '../../../../hooks/useToast'
import { CUSTOM_STATUS_CODE } from '../../../../enums/CustomCodes'

const Security = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'notifications-settings'>) => {
  const toast = useToast();
  const { renderForm } = useForm({
    defaultValues: {
      current_assword: '',
      password: '',
      password_confirmation: ''
    },
    validationSchema: changePasswordSchema
  });

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: any) => httpService.put(`${URLS.CHANGE_PASSWORD}`, data),
    onSuccess: (data) => {
      if (data?.data?.code === CUSTOM_STATUS_CODE.SUCCESS) {
        toast.show('Password changed successfully', { type:'success' });
        navigation.goBack();
      }
    },
    onError: (error: any) => {
      toast.show(error?.message, { type: 'error' });
    },
  });
  return renderForm(
    <Box flex={1} backgroundColor='mainBackGroundColor'>
      <SettingsHeader title='Security settings' showSave={false} handleArrowPressed={() => navigation.goBack()} />
      <Box padding='m'>
        <CustomTextInput name='current_password' label='Current password' placeholder='Current password' isPassword  />
        <Box height={20} />
        <CustomTextInput name='password' label='New password' placeholder='New password' isPassword  />
        <Box height={20} />
        <CustomTextInput name='password_confirmation' label='Confirm password' placeholder='Confirm password' isPassword  />
        <Box height={40} />
        <SubmitButton label='Change' isLoading={isLoading} onSubmit={(data) => mutate(data)} />
      </Box>
    </Box>
  )
}

export default Security