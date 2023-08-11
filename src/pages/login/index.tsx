import React from 'react'
import { Image } from 'expo-image';
import useForm from '../../hooks/useForm';
import { loginSchema } from '../../services/validations';
import Box from '../../components/general/Box';
import CustomText from '../../components/general/CustomText';
import { CustomTextInput } from '../../components/form/CustomInput';
import { SubmitButton } from '../../components/form/SubmittButton';
import LightBgButton from '../../components/general/LightBgButton';
import { useModalState } from '../../states/modalState';
import { useMutation } from 'react-query';
import httpService from '../../utils/httpService';
import { URLS } from '../../services/urls';
import { useDetailsState } from '../../states/userState';
import * as SecureStorage from 'expo-secure-store';
import { useUtilState } from '../../states/util';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootBottomTabParamList } from '../../navigation/BottomTabs';


export type PageType = CompositeNavigationProp<
  BottomTabNavigationProp<RootBottomTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
  >;;
const Login = () => {
  const navigation = useNavigation<PageType>();
  const [ setAll ] = useModalState((state) => [state.setAll]);
  const { setAll: updateDetails } = useDetailsState((state) => state);
  const { setAll: updateUtil } = useUtilState((state) => state)

  const { renderForm } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }, 
    validationSchema: loginSchema,
  });

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: any) => httpService.post(`${URLS.LOGIN}`, data),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: async(data) => {
      console.log(data.data);
      updateDetails({ ...data.data.user, token: data.data.authorisation.token });
      await SecureStorage.setItemAsync('token', data.data.authorisation.token);
      await SecureStorage.setItemAsync('user', JSON.stringify(data.data.user));
      updateUtil({ isLoggedIn: true });
      setAll({ showLogin: false });
      navigation.navigate('home');
    }
  })
  return renderForm(
    <Box paddingTop='xl'>
      <CustomText variant='subheader'>Hi there! Welcome back to diskox</CustomText>
      <CustomTextInput name='email' placeholder='Email' containerStyle={{ marginTop: 20 }} />
      <CustomTextInput name='password' placeholder='Password' isPassword containerStyle={{ marginTop: 10 }} />
      <Box height={40} />
      <SubmitButton label='Login' onSubmit={(data) => mutate(data)} isLoading={isLoading} />
      <LightBgButton label='Signup' action={() => setAll({ showLogin: false, showSignup: true })} style={{ marginTop: 20 }} />

      <CustomText variant='body' textAlign='center' marginTop='xl' onPress={() => {
        setAll({ showLogin: false });
        navigation.navigate('reset-password')
      }}>Reset Password</CustomText>
    </Box>
  )
}

export default Login