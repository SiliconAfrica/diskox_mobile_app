import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import Box from '../../../../components/general/Box'
import SettingsHeader from '../../../../components/settings/Header'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../navigation/MainNavigation'
import CustomText from '../../../../components/general/CustomText'
import { Switch } from 'react-native-ui-lib';
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../../theme'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import httpService from '../../../../utils/httpService'
import { URLS } from '../../../../services/urls'
import PrimaryButton from '../../../../components/general/PrimaryButton'
import { CUSTOM_STATUS_CODE } from '../../../../enums/CustomCodes'

const SettingCard = ({title, isChecked = false}: {
  title: string;
  isChecked: boolean;
}) => {
  const [on, setOn] = React.useState(isChecked);
  const theme = useTheme<Theme>();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: any) => httpService.put(`${URLS.UPDATE_NOTIFICATION_SETTINGS}`, data),
    onSuccess: (data) => {
      if (data?.data?.code === CUSTOM_STATUS_CODE.SUCCESS) {
        queryClient.invalidateQueries(['getNotificationsSettings']);
      }
    },
  });
  return (
    <Box width={'100%'} height={60} flexDirection='row' justifyContent='space-between' alignItems='center'>
      <CustomText variant='body'>{title.replace('_', ' ')}</CustomText>
      { !isLoading && (
        <Switch value={isChecked} onColor={theme.colors.primaryColor} offColor={theme.colors.secondaryBackGroundColor} onValueChange={(val) => mutate({ notification: title })} />
      )}
      { isLoading && (
        <ActivityIndicator color={theme.colors.primaryColor} size='small' />
      )}
    </Box>
  )
}

const NotificaitionsSettings = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'notifications-settings'>) => {
  const notififcations = ['inbox_notifications', 'community_notifications', 'mentions_notifications', 'tags_notifications'];
  const [states, setStates] = React.useState({
    inbox_notifications: 0,
    community_notifications: 0,
    mentions_notifications: 0,
    tags_notifications: 0,
  });

  const theme = useTheme<Theme>();

  const { isLoading, isError, refetch } = useQuery(['getNotificationsSettings'], () => httpService.get(`${URLS.GET_NOTIFICATIONS_SETTINGS}`), {
    onSuccess: (data) => {
      setStates(data?.data?.data);
    },
    onError: (error: any) => {}
  });
  if( !isLoading && isError ) {
    refetch();
  }
  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
      <SettingsHeader title='Notificattions settings' showSave={false} handleArrowPressed={() => navigation.goBack()} />

      {
        !isLoading && isError && (
          <Box width='100%' height={150} justifyContent='center' alignItems='center'>
            <CustomText>Something went wrong</CustomText>
            <PrimaryButton title='Refetch' onPress={() => refetch()} />
          </Box>
        )
      }

      {
        isLoading && (
          <Box width='100%' height={150} justifyContent='center' alignItems='center'>
            <ActivityIndicator color={theme.colors.primaryColor} size='large' />
          </Box>
        )
      }

      { !isLoading && !isError && (
        <Box marginTop='l' width='100%' paddingHorizontal='m'>
        {
          notififcations.map((notif, index) => {
            return <SettingCard title={notif} isChecked={states[notif] === 1 ?true:false} key={index.toString()} />
          })
        }
      </Box>
      )}
    </Box>
  )
}

export default NotificaitionsSettings