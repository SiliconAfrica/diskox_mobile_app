import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import Box from '../../components/general/Box'
import CustomText from '../../components/general/CustomText'
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { useQuery } from 'react-query';
import { useDetailsState } from '../../states/userState';
import httpService, { IMAGE_BASE } from '../../utils/httpService';
import PrimaryButton from '../../components/general/PrimaryButton';
import moment from 'moment'
import { URLS } from '../../services/urls';
import { ScrollView } from 'react-native-gesture-handler';
import { Image } from 'expo-image'
import { FlashList } from '@shopify/flash-list';

const NotificationCard = ({ id, message, profile_image, created_at, read_at}: INotification) => {
  return (
    <Box flexDirection='row' height={70} backgroundColor={read_at === null ? 'secondaryBackGroundColor' : 'mainBackGroundColor'} borderBottomWidth={0.4} borderBottomColor={read_at === null ? 'primaryColor' : 'secondaryBackGroundColor'}  paddingHorizontal='m'>

      <Box flex={0.7} flexDirection='row' alignItems='center' width='100%'>
        <Box width={50} overflow='hidden' height={50} borderRadius={25} backgroundColor='primaryColor'>
          <Image source={{ uri: `${IMAGE_BASE}/${profile_image}`}} contentFit='cover' style={{ width: '100%', height: '100%'}} />
        </Box>
        <CustomText marginLeft='m'>{message.length > 20 ? message.substring(0, 20) + '...' : message}</CustomText>
      </Box>
      
      <Box flex={0.3} justifyContent='center' alignItems='flex-end'>
        <CustomText variant='xs' >{moment(created_at).fromNow()}</CustomText>
      </Box>

    </Box>
  )
}

const Notifications = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'notifications'>) => {
  const theme = useTheme<Theme>();
  const { id } = useDetailsState((state) => state);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [lastPage, setLastPage] = React.useState(1);
  const [notitications, setNotifications] = React.useState<INotification[]>([]);


  const { isLoading, isError, error, data, refetch } = useQuery(['getNotifications', currentPage], () => httpService.get(`${URLS.GET_NOITIFICATIONS}`), {
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
    if (currentPage === lastPage) {
      return;
    } else {
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
        <FlashList 
          onEndReached={onEndReached}
          estimatedItemSize={100}
          keyExtractor={(_, i)=> i.toString()}
          data={notitications}
          ListEmptyComponent={() => (
            <Box width='100%' alignItems='center'>
              { !isLoading && <CustomText>You have no notification</CustomText>}
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