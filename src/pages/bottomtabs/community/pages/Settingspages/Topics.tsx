import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Box from '../../../../../components/general/Box'
import { ScrollView } from 'react-native-gesture-handler'
import CustomText from '../../../../../components/general/CustomText';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../../../../theme';
import { Feather } from '@expo/vector-icons'
import SettingsHeader from '../../../../../components/settings/Header';
import { useNavigation } from '@react-navigation/native';
import { PageType } from '../../../../login';

const arr = ['Movies', 'Sports', 'Politics', 'IT', 'Business', 'Diskos', 'Tech'];

const Topics = () => {
    const theme = useTheme<Theme>();
    const navigation = useNavigation<PageType>()

    const [active, setActive] = React.useState('Movies');

  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
        <SettingsHeader showSave title='Topics' handleArrowPressed={() => navigation.goBack()} />
        <Box flex={1} padding='m'>
            <Box height={55}>
                <Pressable style={{ paddingHorizontal: 15, height: 30, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.secondaryBackGroundColor, width: 120, flexDirection: 'row' }}>
                    <CustomText variant='body'>{active}</CustomText>
                    <Feather name='x' size={20} color={theme.colors.textColor} style={{ marginLeft: 20 }} />
                </Pressable>
            </Box>
            <Box flex={0.9}>
                <ScrollView>
                    { arr.map((item, index) => (
                        <Pressable key={index.toString()} onPress={() => setActive(item)} style={{  paddingHorizontal: 15, width: 120, marginBottom: 30, height: 30, borderRadius: 5, justifyContent: 'center', alignItems: 'flex-start', minWidth: 40}}>
                            <CustomText key={index.toString()} variant='body'>{item}</CustomText>
                        </Pressable>
                    ))}
                </ScrollView>
            </Box>
        </Box>
    </Box>
  )
}

export default Topics