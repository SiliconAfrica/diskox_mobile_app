import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import Box from '../../../../components/general/Box'
import SettingsHeader from '../../../../components/settings/Header'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../navigation/MainNavigation'
import CustomText from '../../../../components/general/CustomText'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../../theme'
import { ScrollView } from 'react-native-gesture-handler'
import { isError, useMutation, useQuery } from 'react-query'
import httpService, { IMAGE_BASE } from '../../../../utils/httpService'
import { URLS } from '../../../../services/urls'
import { CUSTOM_STATUS_CODE } from '../../../../enums/CustomCodes'
import { IBlockUser } from '../../../../models/BlockedUser'
import useToast from '../../../../hooks/useToast'
import { FlashList } from '@shopify/flash-list'
import PrimaryButton from '../../../../components/general/PrimaryButton'
import { Image } from 'expo-image'
import { date } from 'zod'

const BlockedUserCard = ({ username, name, profile_image}: IBlockUser) => {
  const theme = useTheme<Theme>();
  const toast = useToast()
  const { isLoading, isError } = useMutation({
    mutationFn: (data: string) => httpService.post(`${URLS.BLOCK_AND_UNBLOCK_USER}/${data}`),
    onSuccess: (data) => {
      if (data?.data?.code === CUSTOM_STATUS_CODE.INTERNAL_SERVER_ERROR) {
        toast.show(data?.data?.message, { type:'error' });
      } else {
        toast.show(data?.data?.message, { type:'success' });
      }
    },
    onError: (error: any) => {}
  })
  return (
    <Box width='100%' height={80} flexDirection='row' justifyContent='space-between'>

      <Box flexDirection='row'>
          <Box width={50} height={50} borderRadius={25} bg='secondaryBackGroundColor'>
            <Image source={{ uri: `${IMAGE_BASE}${profile_image}`}} />
          </Box>
          <Box marginLeft='m'>
            <CustomText variant='xs' style={{ color: 'red' }}>Blocked</CustomText>
            <Box flexDirection='row'>
              <CustomText variant='subheader' fontSize={18}>BigAniita</CustomText>
              <CustomText variant='body' fontSize={18}>@anita</CustomText>
            </Box>
          </Box>
      </Box>

      <Pressable style={{ height: 30, borderRadius: 25, paddingHorizontal: 10, backgroundColor: theme.colors.primaryColor, justifyContent: 'center', alignItems: 'center' }}>
        <CustomText variant='subheader' fontSize={16} style={{ color: 'white' }} >Unblock</CustomText>
      </Pressable>

    </Box>
  )
}

const BlockedUsers= ({ navigation }: NativeStackScreenProps<RootStackParamList, 'notifications-settings'>) => {
  const [users, setUsers] = React.useState<IBlockUser[]>([]);
  const [page, setPage] = React.useState(1);
  const theme = useTheme<Theme>();
  const toast = useToast();

  const { isLoading, refetch } = useQuery(['getBlockedUsers', page], () => httpService.get(`${URLS.FETCH_BLOCKED_USERS}`, {
    params: {
      page,
    }
  }), {
    onSuccess: ( data) => {
      // if (data?.data?.code !== CUSTOM_STATUS_CODE.INTERNAL_SERVER_ERROR && data?.data?.code === CUSTOM_STATUS_CODE.SUCCESS) {
      //   setUsers(data?.data?.data?.data);
      // }
    },
    onError: (error: any) => {
    }
  })
  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
      <SettingsHeader title='Blocked users' showSave={false} handleArrowPressed={() => navigation.goBack()} />
      <Box flex={1} marginTop='l'>
        {
          isError && (
            <Box width='100%' height={70} justifyContent='center' alignItems='center'>
                <CustomText>You have no blocked user</CustomText>
                <PrimaryButton title='Refetch' onPress={() => refetch()} />
            </Box>
          )
        }
        {
          !isError && (
            <FlashList 
          ListFooterComponent={() => (
            <>
              { isLoading && (
                <Box width='100%' height={70} justifyContent='center' alignItems='center'>
                  <ActivityIndicator size='large' color={theme.colors.primaryColor} />
                </Box>
              )}
            </>
          )}
          ListEmptyComponent={() => (
            <>
            { !isLoading && (
              <Box width='100%' height={70} justifyContent='center' alignItems='center'>
                <CustomText>You have no blocked user</CustomText>
              </Box>
            )}
            </>
          )}
          estimatedItemSize={20}
          keyExtractor={(item, index) => index.toString()}
          data={users}
          renderItem={({ item }) => (
            <BlockedUserCard {...item} />
          )}
        />
          )
        }
        {/* <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
          { Array.from(Array(30).keys()).map((item, index) => {
            return <BlockedUserCard key={index} />
          })}
        </ScrollView> */}
      </Box>
    </Box>
  )
}

export default BlockedUsers