import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommunityList from './pages/CommunityList';
import Community from './pages/Community';
import Members from './pages/Members';

const { Navigator, Screen } = createNativeStackNavigator();

export const Communities = () => {
    return (
        <Navigator initialRouteName='list' screenOptions={{ headerShown: false }}>
            <Screen name='list' component={CommunityList} />
            <Screen name='community' component={Community} />
            <Screen name='community-members' component={Members} />
        </Navigator>
    )
}