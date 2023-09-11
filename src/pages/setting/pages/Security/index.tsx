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

const Security = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'notifications-settings'>) => {
  const { renderForm } = useForm({
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: changePasswordSchema
  });
  return renderForm(
    <Box flex={1} backgroundColor='mainBackGroundColor'>
      <SettingsHeader title='Security settings' showSave={false} handleArrowPressed={() => navigation.goBack()} />
      <Box padding='m'>
        <CustomTextInput name='oldPassword' label='Current password' placeholder='' isPassword  />
        <Box height={20} />
        <CustomTextInput name='password' label='New password' placeholder='' isPassword  />
        <Box height={20} />
        <CustomTextInput name='confirmPassword' label='Confirm password' placeholder='' isPassword  />
        <Box height={40} />
        <SubmitButton label='Change' isLoading={false} onSubmit={(data) => console.log(data)} />
      </Box>
    </Box>
  )
}

export default Security