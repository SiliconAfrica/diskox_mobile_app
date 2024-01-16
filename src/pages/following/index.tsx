import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Box from '../../components/general/Box'
import SettingsHeader from '../../components/settings/Header'
import CustomText from '../../components/general/CustomText'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigation/MainNavigation'
import Following from './pages/Following'
import Followers from './pages/Followers'

enum TAB {
    FOLLOWING = 'following',
    FOLLOWERS = 'followers'
}

const FollowingPage = ({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'following'>) => {
    const [tab, setTab] = React.useState(TAB.FOLLOWING);

    const theme = useTheme<Theme>();
    const { id } = route.params;

    const handleChange = React.useCallback(() => {
        const obj = {
            following: <Following id={id} />,
            followers: <Followers id={id} />
        }
        return obj[tab];
    }, [tab])
  return (
    <Box flex={1} bg='mainBackGroundColor'>
        <SettingsHeader title='Following' handleArrowPressed={() => navigation.goBack()} showSave={false} />
        <Box width={'100%'} height={50} borderBottomColor='grey' borderBottomWidth={0.5} flexDirection='row' justifyContent='space-between' paddingHorizontal='xl'>
            <Pressable style={{
                width: '35%',
                height: '100%',
                borderBottomColor: theme.colors.primaryColor,
                borderBottomWidth: tab === TAB.FOLLOWING? 2: 0,
                justifyContent: 'center',
                alignItems: 'center'
            }} 
                onPress={() => setTab(TAB.FOLLOWING)}
            >
                <CustomText variant='body' color={tab ===TAB.FOLLOWING ? 'primaryColor':'grey'}>Following</CustomText>
            </Pressable>    

            <Pressable style={{
                width: '35%',
                height: '100%',
                borderBottomColor: theme.colors.primaryColor,
                borderBottomWidth: tab === TAB.FOLLOWERS ? 2: 0,
                justifyContent: 'center',
                alignItems: 'center'
            }} 
            onPress={() => setTab(TAB.FOLLOWERS)}
            >
                <CustomText variant='body' color={tab ===TAB.FOLLOWERS ? 'primaryColor':'grey'}>Followers</CustomText>
            </Pressable>
        </Box>

        <Box flex={1}>
            {handleChange()}
        </Box>
    </Box>
  )
}

export default FollowingPage