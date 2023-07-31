import { View, Text } from 'react-native'
import React from 'react'
import Box from '../../../components/general/Box'
import CustomText from '../../../components/general/CustomText'
import useForm from '../../../hooks/useForm'
import { usernameSelectSchema } from '../../../services/validations'
import { CustomTextInput } from '../../../components/form/CustomInput'
import { SubmitButton } from '../../../components/form/SubmittButton'
import { useSignupState } from '../state'
import { useMutation } from 'react-query'
import httpService from '../../../utils/httpService'
import { URLS } from '../../../services/urls'

const Username = () => {
  const [setAll, values] = useSignupState((state) => [state.setAll, { username: state.username, email: state.email }]);
  const [details, setDetails] = React.useState({
    username: '',
    email: '',
  });

  const checkEmail = useMutation({
    mutationFn: (data: { email: string }) => httpService.post(`${URLS.CHECK_EMAIL}/${data.email}`, data),
    onError: (error) => {
      alert(JSON.stringify(error));
    },
    onSuccess: (data) => {
      setAll({ stage: 2, ...details });
    }
  })

  // check username mutation
  const checkUsername = useMutation({
    mutationFn: (data: { username: string }) => httpService.post(`${URLS.CHECK_USERNAME}/${data.username}`, data),
    onError: (error) => {
      alert(JSON.stringify(error));
    },
    onSuccess: (data) => {
      checkEmail.mutate({ email: details.email });
    }
  })

  const handleSubmit = React.useCallback((data: { username: string, email: string }) => {
    setDetails(data);
    checkUsername.mutate({ username: data.username.toLowerCase() });
  }, [])

  const { renderForm } = useForm({
    defaultValues: {
      username: values.username,
      email: values.email,
    },
    validationSchema: usernameSelectSchema,
  });
  return renderForm(
    <Box flex={1} marginTop='xl'>
      <CustomText variant='subheader'>Hi there! Sign up and start diskoxing</CustomText>

      <CustomTextInput name='username' placeholder='Enter your username' label='Username'  containerStyle={{ marginTop: 20 }}  />
      <CustomTextInput name='email' placeholder='Enter your email address' label='Email'  containerStyle={{ marginTop: 20 }}  />

      <Box height={20} />
      <SubmitButton label='Continue' onSubmit={handleSubmit} isLoading={checkUsername.isLoading || checkEmail.isLoading} />
    </Box>
  )
}

export default Username