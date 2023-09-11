import { View, Text } from 'react-native'
import React from 'react'
import Box from '../../../../components/general/Box'
import SettingsHeader from '../../../../components/settings/Header'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../navigation/MainNavigation'
import CustomText from '../../../../components/general/CustomText'
import { Switch } from 'react-native-ui-lib';
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../../theme'

const SettingCard = ({title, isChecked = false}: {
  title: string;
  isChecked: boolean;
}) => {
  const [on, setOn] = React.useState(isChecked);
  const theme = useTheme<Theme>();
  return (
    <Box width={'100%'} height={60} flexDirection='row' justifyContent='space-between'>
      <CustomText variant='body'>{title}</CustomText>
      <Switch value={isChecked} onColor={theme.colors.primaryColor} offColor={theme.colors.secondaryBackGroundColor} onValueChange={(val) => setOn(val)} />
    </Box>
  )
}

const NotificaitionsSettings = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'notifications-settings'>) => {
  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
      <SettingsHeader title='Notificattions settings' showSave={false} handleArrowPressed={() => navigation.goBack()} />

      <Box marginTop='l' width='100%' paddingHorizontal='m'>
        <SettingCard title='Disable all notification' isChecked={false} />
        <SettingCard title='Upvoted your post' isChecked={true} />
        <SettingCard title='Commented on your post' isChecked={true} />
        <SettingCard title='Replied to your comment' isChecked={true} />
        <SettingCard title='Upvoted your comment' isChecked={true} />
        <SettingCard title='Mentioned you in comments' isChecked={true} />
        <SettingCard title='Tagged you to a post' isChecked={true} />
        <SettingCard title='Mentioned you in a post' isChecked={true} />
      </Box>
    </Box>
  )
}

export default NotificaitionsSettings