import {View, Text, ActivityIndicator, Pressable, Alert} from 'react-native'
import React from 'react'
import Box from '../../components/general/Box'
import CustomText from '../../components/general/CustomText'
import { Feather, Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDetailsState } from '../../states/userState';
import httpService, { IMAGE_BASE } from '../../utils/httpService';
import PrimaryButton from '../../components/general/PrimaryButton';
import moment from 'moment'
import { URLS } from '../../services/urls';
import { ScrollView } from 'react-native-gesture-handler';
import { Image } from 'expo-image'
import { FlatList } from 'react-native-gesture-handler'
import { CUSTOM_STATUS_CODE } from '../../enums/CustomCodes';
import { useNavigation } from '@react-navigation/native';

const NotificationCard = ({ id, message, profile_image, created_at, read_at, actionLink}: INotification) => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();


  const { mutate } = useMutation({
    mutationFn: () => httpService.put(`${URLS.MARK_NOTIFICATION_READ}/${id}`),
    onSuccess: (data) => {
      if (data.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
        queryClient.invalidateQueries(['getNotifications'])
      }
    },
    onError: (error) => {},
  });

  const handleClick = () => {
    mutate();
    if (actionLink.includes('post')) {
      const postId = actionLink.split('/post/')[1];
      //const filtered = postId.split('/')[0]
      navigation.navigate('slug-post', { slug: postId })
      //Alert.alert('This is the action link', postId);
    } else if (actionLink.includes('/q/')) {
      const postId = actionLink.split('post')[1];
      //const filtered = postId.split('/')[0]
      //navigation.navigate('slug-post', { slug: filtered })
      //Alert.alert('This is the action link', postId);
    } else {
      //Alert.alert('Action Link', actionLink);
    }
  }
  return (
    <Pressable 
    onPress={handleClick}
    style={{ flexDirection: 'row', height: 70, backgroundColor: read_at === null ? 'secondaryBackGroundColor' : 'mainBackGroundColor', borderBottomWidth: 0.4, borderBottomColor: read_at === null ? 'primaryColor' : 'secondaryBackGroundColor', paddingHorizontal: 10 }}>

      <Box flex={0.7} flexDirection='row' alignItems='center' width='100%'>
       { profile_image !== null && (
         <Box width={50} overflow='hidden' height={50} borderRadius={25} backgroundColor='primaryColor'>
          <Image source={{ uri: `${IMAGE_BASE}/${profile_image}`}} contentFit='cover' style={{ width: '100%', height: '100%'}} />
        </Box>
       )}
       {
        profile_image === null && (
          <Box width={50} overflow='hidden' height={50} borderRadius={25} backgroundColor='secondaryBackGroundColor' justifyContent='center' alignItems='center'>
            <Ionicons name='person-outline' size={25} color={theme.colors.textColor} />
          </Box>
        )
       }
        <CustomText marginLeft='m'>{message.length > 20 ? message.substring(0, 20) + '...' : message}</CustomText>
      </Box>
      
      <Box flex={0.3} justifyContent='center' alignItems='flex-end'>
        <CustomText variant='xs' >{moment(created_at).fromNow()}</CustomText>
      </Box>

    </Pressable>
  )
}

const Notifications = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'notifications'>) => {
  const theme = useTheme<Theme>();
  const { id } = useDetailsState((state) => state);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [lastPage, setLastPage] = React.useState(1);
  const [notitications, setNotifications] = React.useState<INotification[]>([]);

  const queryClient = useQueryClient();


  const markAllAsRead = useMutation({
    mutationFn: () => httpService.put(`${URLS.MARK_ALL_NOTIFICATIONS_AS_READ}`),
    onSuccess: (data) => {
      if (data.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
        queryClient.refetchQueries()
            .then()
      }
    },
    onError: (error) => {},
  });

  React.useEffect(() => {
    markAllAsRead.mutate();
  }, [])


  const { isLoading, isError, error, data, refetch } = useQuery(['getNotifications', currentPage], () => httpService.get(`${URLS.GET_NOITIFICATIONS}`, {
    params: {
      page: currentPage,
    }
  }), {
    onSuccess: (data) => {
      if (notitications.length > 0) {
        const arr = [...notitications, ...data?.data?.data];
        setNotifications(arr);
        // setCurrentPage(data.data.meta.current_page);
        setTotal(data.data.total);
        setLastPage(data?.data?.meta.last_page);
       
      } else {
        setNotifications(data?.data?.data);
        setCurrentPage(data.data.meta.current_page);
        setTotal(data.data.total);
        setLastPage(data?.data?.meta.last_page);
      }
    }
  })

   // functions
   const onEndReached = React.useCallback(async () => {
    if (!isLoading && notitications.length !== total) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, lastPage]);

  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
      <Box width='100%' height={130} flexDirection='row' alignItems='center' paddingHorizontal='m'>
        <Feather onPress={() => navigation.goBack()} name='arrow-left' size={25} color={theme.colors.textColor} />
        <CustomText variant='subheader' marginLeft='m'>Notifications</CustomText>
      </Box>

      { !isLoading && isError && (
        <Box width='100%' alignItems='center'>
          <CustomText>An error occured, please refresh</CustomText>
          <PrimaryButton title='Refetch' onPress={() => refetch()} />
        </Box>
      )}



      { !isError && (
        <FlatList
            onEndReachedThreshold={0.5}
          onEndReached={onEndReached}
          keyExtractor={(_, i)=> i.toString()}
          data={notitications}
          ListEmptyComponent={() => (
            <Box width='100%' alignItems='center'>
              {/*{ !isLoading && <CustomText>You have no notification</CustomText>}*/}
            </Box>
          )}
          renderItem={({ item }) => <NotificationCard {...item} />}
          ListFooterComponent={() => (
            <Box width="100%" alignItems="center" marginVertical="m">
              {isLoading && (
                <ActivityIndicator
                  size="large"
                  color={theme.colors.primaryColor}
                />
              )}
            </Box>
          )}
        />
        // <ScrollView>
        //   {(data.data?.data as INotification[]).map((item, index) => (
        //     <NotificationCard key={index.toString()} {...item} />
        //   ))}
        // </ScrollView>
      )}
    </Box>
  )
}

export default Notifications