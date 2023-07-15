import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Box from './general/Box'
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';
import { Image } from 'expo-image'
import CustomText from './general/CustomText';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/MainNavigation';
import { useUtilState } from '../states/util';

const Header = () => {
    const theme = useTheme<Theme>();
    const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
    const [isDarkMode] = useUtilState((state) => [state.isDarkMode])

  return (
    <Box paddingHorizontal='m' paddingTop='l' backgroundColor='mainBackGroundColor' height={110} flexDirection='row' justifyContent='space-between' alignItems='center'>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name='menu' size={30} color={theme.colors.textColor} onPress={() => navigation.openDrawer()} />
            <Image 
                source={isDarkMode ? require('../../assets/images/logo.png'):require('../../assets/images/logoB.png')}
                style={{ width: 60, height: 60, resizeMode: 'contain', marginLeft: 20 }}
                contentFit='contain'
                transition={1000}
            />
        </View>

        <Pressable style={{ width: 80, height: 40, borderRadius: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.primaryColor }}>
            <CustomText variant='body'>Login</CustomText>
        </Pressable>
    </Box>
  )
}

export default Header