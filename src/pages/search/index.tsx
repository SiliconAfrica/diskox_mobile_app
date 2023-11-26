import { View, Text , TextInput, Pressable, ActivityIndicator} from 'react-native'
import React from 'react'
import Box from '../../components/general/Box'
import CustomText from '../../components/general/CustomText'
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/MainNavigation';
import useDebounce from '../../hooks/useDebounce';
import { useQuery } from 'react-query';
import httpService from '../../utils/httpService';
import { URLS } from '../../services/urls';
import { IUser } from '../../models/user';
import { IPost } from '../../models/post';
import PostsResults from '../../components/search/PostsResults';
import UserResults from '../../components/search/UserResults';
import CommunityResult from '../../components/search/CommunityResult';

const Search = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'notifications'>) => {

    const [searchTerm,setSearchTerm] = React.useState('');
    const search = useDebounce(searchTerm)
    const [active, setActive] = React.useState(1);
    const theme = useTheme<Theme>();

    const [communities, setCommunities] = React.useState([]);
    const [users, setUsers] = React.useState<Array<IUser>>([]);
    const [posts, setPosts] = React.useState<Array<IPost>>([]);

    const { isLoading, isError, refetch} = useQuery(['search', search], () => httpService.get(`${URLS.SEARCH}/${search}`), {
      enabled: search.length > 0,
      onSuccess: (data) => {
        if (data.data.code === 1) {
          setCommunities(data.data.data.communities.data);
          setUsers(data.data.data.users.data);
          setPosts(data.data.data.posts.data);
        }
      },
      onError: (error) => {},
    })

    const handlePageSwitch = React.useCallback(() => {
      switch(active) {
        case 1: {
          return <PostsResults data={posts} />
        }
        case 2: {
          return <UserResults users={users} />
        }
        case 3: {
          return <CommunityResult data={communities} />
        }
      }
    }, [active, users, posts, communities])

  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>

      <Box width='100%' height={130} flexDirection='row' alignItems='center' paddingHorizontal='m' paddingTop='l'>
        <Feather onPress={() => navigation.goBack()} name='arrow-left' size={25} color={theme.colors.textColor} />
        <TextInput value={searchTerm} onChangeText={(e) => setSearchTerm(e)} placeholder='Search' placeholderTextColor={theme.colors.textColor} style={{ flex: 1, height: 50, borderWidth: 1, borderColor: theme.colors.primaryColor, paddingHorizontal: 10, borderRadius: 25, marginLeft: 10, fontFamily: 'RedRegular', color: theme.colors.textColor }}></TextInput>
      </Box>

      <Box width='100%' height={60} flexDirection='row' paddingHorizontal='m' justifyContent='space-evenly' >
        <Pressable onPress={() => setActive(1)} style={{ minWidth: 100, height: 35, borderRadius: 25,  justifyContent: 'center', alignItems: 'center', backgroundColor: active === 1 ? theme.colors.primaryColor:theme.colors.mainBackGroundColor, borderColor: theme.colors.secondaryBackGroundColor, borderWidth: active === 1 ? 0 : 2 }}>
            <CustomText variant='header' fontSize={14} style={{ color: active === 1 ?'white':theme.colors.textColor }} >Post</CustomText>
        </Pressable>

        <Pressable onPress={() => setActive(2)}  style={{ minWidth: 100, height: 35, borderRadius: 25,  justifyContent: 'center', alignItems: 'center', backgroundColor: active === 2 ? theme.colors.primaryColor:theme.colors.mainBackGroundColor, borderColor: theme.colors.secondaryBackGroundColor, borderWidth: active === 2 ? 0 : 2 }}>
            <CustomText variant='header' fontSize={14} style={{ color: active === 2 ?'white':theme.colors.textColor }} >People</CustomText>
        </Pressable>

        <Pressable onPress={() => setActive(3)}  style={{ minWidth: 100, height:35, borderRadius: 25,  justifyContent: 'center', alignItems: 'center', backgroundColor: active === 3 ? theme.colors.primaryColor:theme.colors.mainBackGroundColor, borderColor: theme.colors.secondaryBackGroundColor, borderWidth: active === 3 ? 0 : 2 }}>
            <CustomText variant='header' fontSize={14} style={{ color: active === 3 ?'white':theme.colors.textColor }} >Communities</CustomText>
        </Pressable>
      </Box>
      
      <Box flex={1}>
        { !isLoading && search.length > 0 && (
          <Box paddingHorizontal='m'>
              <CustomText variant='subheader' style={{ fontSize: 20, marginBottom: 20 }}>
              Showing results for "{search}"
              </CustomText>
          </Box>
        )}
        { isLoading && search.length > 0 && (
          <Box paddingHorizontal='m' justifyContent='center' alignItems='center'>
            <ActivityIndicator size='large' color={theme.colors.primaryColor} />
          </Box>
        )}
        {
          !isLoading && !isError && search.length > 0 && handlePageSwitch()
        }
      </Box>
    </Box>
  )
}

export default Search