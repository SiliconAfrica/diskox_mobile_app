import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CommunityList from "./pages/CommunityList";
import Community from "./pages/Community";
import Members from "./pages/Members";
import { ICommunity } from "../../../models/Community";
import SingleCommunity from "./pages/SingleCommunity";

export type CommunityStackParamList = {
  list: undefined;
  community: { id: number; data: ICommunity };
  "community-username": {username: string},
  "community-members": { id: number };
};

const { Navigator, Screen } =
  createNativeStackNavigator<CommunityStackParamList>();

export const Communities = () => {
  return (
    <Navigator initialRouteName="list" screenOptions={{ headerShown: false }}>
      <Screen name="list" component={CommunityList} />
      <Screen name="community" component={Community} />
      <Screen name="community-members" component={Members} />
        <Screen name="community-username" component={SingleCommunity} />
    </Navigator>
  );
};
