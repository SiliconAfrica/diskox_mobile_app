import React from 'react'
import Box from '../general/Box'
import CustomText from '../general/CustomText'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import PrimaryButton from '../general/PrimaryButton'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { PageType } from '../../pages/login'
import { CommunityStackParamList } from '../../pages/bottomtabs/community'
import { useQuery } from 'react-query'
import httpService, { IMAGE_BASE } from '../../utils/httpService'
import { URLS } from '../../services/urls'
import { ICommunity } from '../../models/Community'
import moment from 'moment'
import useToast from '../../hooks/useToast'
import { FlashList } from '@shopify/flash-list'
import { IModerator } from '../../models/Moderators'
import { Image } from 'expo-image';

const ModeratorCard = ({ id, username, profile_image, role }: Partial<IModerator>) => {
  const theme = useTheme<Theme>();
 
  return (
      <Box flexDirection='row' justifyContent='space-between' marginBottom='l' paddingHorizontal='m' alignItems='center'>
          <Box flexDirection='row' alignItems='center'>
              <Box width={50} height={50} borderRadius={25} borderColor='primaryColor' borderWidth={2} overflow='hidden'>
                  <Image source={{ uri: `${IMAGE_BASE}/${profile_image}`}} contentFit='cover' style={{ width: '100%', height: '100%', borderRadius: 25 }} />
              </Box>
              
          </Box>

        <CustomText color='primaryColor'>{role}</CustomText>
      </Box>
  )
}

const AboutCommunity = () => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<PageType>();
  const route = useRoute<RouteProp<CommunityStackParamList, 'community'>>();
  const { show } = useToast();
  const { id, data } = route.params;
  const [details, setDetails] = React.useState<null | ICommunity>(null);;
  const [moderators, setModerators] = React.useState<any[]>([])

  const { isLoading, isError } = useQuery(['getCmmunityDetails', id], () => httpService.get(`${URLS.GET_SINGLE_COMMUNITY}/${data.username}`), {
    onSuccess: (data) => {
      setDetails(data?.data?.data);
    }
  });

  const moderatorQuery = useQuery(['getModerators', id], () => httpService.get(`${URLS.GET_COMMUNITY_MODERATORS}/${data.id}`), {
    onSuccess: (data) => {
      if (data?.data?.code === 3) {
        show('No Moderators', { type: 'success'})
      } else if ( data?.data?.code === 1) {
        setModerators(data?.data?.data?.data);
      } else {
        show(data?.data?.message, { type: 'error'});
      }
    },
    onError: (error: any) => {
      show(error?.message, { type: 'error'});
    }
  });
  return (
    <Box flex={1} padding='m'>

      {/* FIRST BOX */}
      <Box width='100%' borderRadius={15} borderWidth={2} borderColor='secondaryBackGroundColor' padding='m'>

        <Box borderBottomWidth={2} borderBottomColor='secondaryBackGroundColor' paddingBottom='m' >
          <CustomText variant='subheader' fontSize={20}>About Community</CustomText>
          <CustomText variant='body' marginTop='s'>{details?.description}</CustomText>
        </Box>

        <Box marginTop='m' paddingBottom='m' borderBottomWidth={2} borderBottomColor='secondaryBackGroundColor' >
          <Box flexDirection='row' justifyContent='space-between'>
            <CustomText variant='subheader' fontSize={20}>Total Members</CustomText>
            <CustomText variant='subheader' fontSize={20} color='primaryColor' onPress={() => navigation.navigate('community-members', { id,username: data.username })}>View members</CustomText>
          </Box>

          <Box flexDirection='row' marginTop='m'>
            <Box>
              <CustomText variant='subheader' fontSize={18}>{details?.members_count}</CustomText>
              <CustomText variant='body' marginTop='s' fontSize={14}>Members</CustomText>
            </Box>

            <Box marginLeft='m'>
              <CustomText variant='subheader' fontSize={18}>24</CustomText>
              <CustomText variant='body' marginTop='s' fontSize={14}>Online</CustomText>
            </Box>
          </Box>
        </Box>

        <Box paddingBottom='m' marginTop='m' >
          <Box flexDirection='row' alignItems='center' marginBottom='l'>
            <Ionicons name='calendar' size={30} color={theme.colors.textColor} />
            <CustomText variant='body' fontSize={16} marginLeft='s'>Created {moment(details?.created_at).toDate().toDateString()}</CustomText>
          </Box>
          
          <PrimaryButton title='Create a post' width='100%' onPress={function (): void {
            throw new Error('Function not implemented.')
          } } />
        </Box>

      </Box>

      {/* MODERATORS BOX */}
      <Box marginTop='l' marginBottom='xl' width='100%' borderRadius={15} borderWidth={2} borderColor='secondaryBackGroundColor' padding='m'>
        <CustomText variant='subheader' fontSize={20}>Moderators</CustomText>
        { !moderatorQuery.isLoading && moderatorQuery.isError && (
          <Box width='100%' height={40} justifyContent='center' alignItems='center'>
            <CustomText>An Error Occured</CustomText>
            <PrimaryButton title='Retry' onPress={() => moderatorQuery.refetch()} />
          </Box>
        )}
        { !moderatorQuery.isLoading && !moderatorQuery.isError && (
          <FlashList 
            keyExtractor={(item,i) => i.toString()}
            data={moderators}
            renderItem={({ item }) => (
              <ModeratorCard {...item} />
            )}
            ListEmptyComponent={() => (
              <>
                {
                  !moderatorQuery.isLoading && (
                    <Box width='100%' height={40} justifyContent='center' alignItems='center'>
                      <CustomText>No moderators</CustomText>
                    </Box>
                  )
                }
              </>
            )}
            estimatedItemSize={20}
          />
        )}
      </Box>
    </Box>
  )
}

export default AboutCommunity