import { View, Text } from 'react-native'
import React from 'react'
import Box from '../../../components/general/Box'
import CustomText from '../../../components/general/CustomText'
import useForm from '../../../hooks/useForm'
import { emailResetSchema } from '../../../services/validations'
import { CustomTextInput } from '../../../components/form/CustomInput'
import { SubmitButton } from '../../../components/form/SubmittButton'
import { useResetState } from './state'
import { useMutation } from 'react-query'
import httpService from '../../../utils/httpService'
import { URLS } from '../../../services/urls'

const Email = () => {
  const { setAll, stage } = useResetState((state) => state);
  const { mutate, isLoading } = useMutation({
    mutationFn: (data: any) => httpService.post(URLS.PASSWORD_RESET_OTP, data),
    onSuccess: () => {
      setAll({ stage: 2 });
    },
    onError: (error: any) => {
      alert(error.message);
    }
  });
  const { renderForm } = useForm({
    defaultValues: {
      email: '',
    },
    validationSchema: emailResetSchema,
  });

  const submit = React.useCallback((data: { email: string}) => {
    setAll({ email: data.email });
    mutate({ email: data.email });
  }, [])
  return renderForm(
    <Box flex={1}>
      <Box flex={0.7}>
        <CustomText variant='subheader' fontSize={22}>
          Please enter your email to reset your password
        </CustomText>
        <CustomText variant='body' marginTop='m'>
        A link will be sent to the email address you provided with instrctions to reset your password
        </CustomText>
        <Box height={20} />
        <CustomTextInput name='email' label='Email' placeholder='Enter you email address' showLabel={false} />
      </Box>
      <Box flex={0.3} justifyContent='center'>
        <SubmitButton label='Send link' onSubmit={(data: { email: string}) => submit(data)} isLoading={isLoading} />
      </Box>
    </Box>
  )
}

export default Email