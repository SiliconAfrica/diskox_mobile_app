import { View, Text } from 'react-native'
import React, { memo } from 'react'
import Box from '../../../../components/general/Box'
import SettingsHeader from '../../../../components/settings/Header'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../navigation/MainNavigation'
import { COMMUNITY_SETTING_TYPE } from '../../../../enums/CommunitySettings'
import { ScrollView } from 'react-native-gesture-handler'
import Settings from './Settingspages/Settings'

const CommunitySettings = ({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'community-settings'>) => {
  const { id, type } = route.params;

  const renderTitle = React.useCallback(() => {
    switch(type) {
      case COMMUNITY_SETTING_TYPE.DEFAULT: {
        return 'Settings';
      }
    }
  }, [type]);

  const renderPage = React.useCallback(() => {
    switch(type) {
      case COMMUNITY_SETTING_TYPE.DEFAULT: {
        return <Settings />
      }
    }
  }, [type])

  return (
    <Box flex={1} backgroundColor='mainBackGroundColor' paddingTop='s'>
        <SettingsHeader title={renderTitle()} showSave={false} handleArrowPressed={() => navigation.goBack()} />
        <Box flex={1}>
          <ScrollView contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}>
            {renderPage()}
          </ScrollView>
        </Box>
    </Box>
  )
}

export default CommunitySettings