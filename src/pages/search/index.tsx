import { View, Text , TextInput, Pressable} from 'react-native'
import React from 'react'
import Box from '../../components/general/Box'
import CustomText from '../../components/general/CustomText'
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/MainNavigation';

const Search = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'notifications'>) => {
    const [active, setActive] = React.useState(1);
  const theme = useTheme<Theme>();

  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>

      <Box width='100%' height={130} flexDirection='row' alignItems='center' paddingHorizontal='m' paddingTop='l'>
        <Feather onPress={() => navigation.goBack()} name='arrow-left' size={25} color={theme.colors.textColor} />
        <TextInput placeholder='Search' placeholderTextColor={theme.colors.textColor} style={{ flex: 1, height: 50, borderWidth: 1, borderColor: theme.colors.primaryColor, paddingHorizontal: 10, borderRadius: 25, marginLeft: 10, fontFamily: 'RedRegular', color: theme.colors.textColor }}></TextInput>
      </Box>

      <Box width='100%' height={60} flexDirection='row' paddingHorizontal='m' justifyContent='space-evenly' >
        <Pressable onPress={() => setActive(1)} style={{ minWidth: 100, height: 45, borderRadius: 25, padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: active === 1 ? theme.colors.primaryColor:theme.colors.mainBackGroundColor, borderColor: theme.colors.secondaryBackGroundColor, borderWidth: active === 1 ? 0 : 2 }}>
            <CustomText variant='body' style={{ color: active === 1 ?'white':theme.colors.textColor }} >Post</CustomText>
        </Pressable>

        <Pressable onPress={() => setActive(2)}  style={{ minWidth: 100, height: 45, borderRadius: 25, padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: active === 2 ? theme.colors.primaryColor:theme.colors.mainBackGroundColor, borderColor: theme.colors.secondaryBackGroundColor, borderWidth: active === 2 ? 0 : 2 }}>
            <CustomText variant='body' style={{ color: active === 2 ?'white':theme.colors.textColor }} >People</CustomText>
        </Pressable>

        <Pressable onPress={() => setActive(3)}  style={{ minWidth: 100, height: 45, borderRadius: 25, padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: active === 3 ? theme.colors.primaryColor:theme.colors.mainBackGroundColor, borderColor: theme.colors.secondaryBackGroundColor, borderWidth: active === 3 ? 0 : 2 }}>
            <CustomText variant='body' style={{ color: active === 3 ?'white':theme.colors.textColor }} >Communities</CustomText>
        </Pressable>
      </Box>
    </Box>
  )
}

export default Search