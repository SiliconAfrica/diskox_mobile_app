import { View, Text, TextInput, ActivityIndicator } from 'react-native'
import React from 'react'
import Box from '../../../../components/general/Box'
import { Feather, Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../../theme'
import CustomText from '../../../../components/general/CustomText'
import FadedButton from '../../../../components/general/FadedButton'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../navigation/MainNavigation'
import { IUser } from '../../../../models/user'
import httpService, { IMAGE_BASE } from '../../../../utils/httpService'
import { URLS } from '../../../../services/urls'
import { useMutation, useQuery } from 'react-query'
import { RouteProp, useRoute } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useToast } from 'react-native-toast-notifications'
import { Image } from 'expo-image'


const MemberCard = ({ id, name, username, profile_image }: Partial<IUser>) => {
    const theme = useTheme<Theme>();
    const toast = useToast();
    const { isLoading, isError, data } = useQuery(['getmemberFollowingCount', id], () => httpService.get(`${URLS.GET_USER_FOLLOWING_AND_FOLLOWERS_COUNT}/${id}`))

    const userDetails = useQuery(['getmemberFollowingCount', id], () => httpService.get(`${URLS.GET_USER_BY_USERNAME}/${username}`));

    const followUnFollowMutation = useMutation({
        mutationFn: () => httpService.post(`${URLS.FOLLOW_OR_UNFOLLOW_USER}/${id}`),
        onSuccess: (data) => {
            toast.show(data?.data?.message, { type: 'success' });
        }
    });

    return (
        <Box flexDirection='row' justifyContent='space-between' marginBottom='l' paddingHorizontal='m' alignItems='center'>
            <Box flexDirection='row' alignItems='center'>
                <Box width={50} height={50} borderRadius={25} borderColor='primaryColor' borderWidth={2} overflow='hidden'>
                    <Image source={{ uri: `${IMAGE_BASE}/${profile_image}`}} contentFit='cover' style={{ width: '100%', height: '100%', borderRadius: 25 }} />
                </Box>
                
                <Box marginLeft='m'>
                    <CustomText variant='subheader' fontSize={17}>{name || username}</CustomText>
                    { isLoading && <ActivityIndicator size='small' color={theme.colors.primaryColor} />}
                    { !isLoading && !isError && (
                        <Box flexDirection='row' alignItems='center' marginTop='s'>
                            <CustomText variant='xs'>{data?.data?.followers_count} followers</CustomText>
                            <CustomText variant='xs' marginLeft='m'>{data?.data?.following_count} following</CustomText>
                        </Box>
                    )}
                </Box>
            </Box>

            { userDetails.isLoading && <ActivityIndicator size='small' color={theme.colors.primaryColor} /> }
            { !userDetails.isLoading && !userDetails.isError  && userDetails.data?.data?.data?.isFollowing === 0 && (
                <FadedButton title='Follow' isLoading={followUnFollowMutation.isLoading} onPress={followUnFollowMutation.mutate} width={80} height={35} />
            )}
        </Box>
    )
}

const Members = ({ navigation }: NativeStackScreenProps<RootStackParamList>) => {
    const [members, setMembers] = React.useState<Partial<IUser[]>>([])
    const theme = useTheme<Theme>();
    const route = useRoute<RouteProp<RootStackParamList, 'community-members'>>();
    const { username } = route.params;
    const { isError, isLoading,} = useQuery(['getCommunityMembers', username], () => httpService.get(`${URLS.GET_COMMUNITY_MEMBERS}/${username}`), {
        onSuccess: (data) => {
            if (data.data.code === 1 && members.length < 1) {
                setMembers(data.data.data.data);
            } else {
                setMembers(prev => [...prev, ...data?.data?.data?.data]);
            }
        }
    });

  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
        <Box flexDirection='row' height={50} paddingHorizontal='m' alignItems='center'>
            <Feather name='arrow-left' size={30} color={theme.colors.textColor} onPress={() => navigation.goBack()} />
            <CustomText variant='subheader' fontSize={18} marginLeft='m' >Communtiy members</CustomText>
        </Box>

        {/* SEARCH BOX */}

        <Box paddingHorizontal='m' width='100%' marginTop='s'>
            <Box width={'100%'} height={45} borderRadius={25} backgroundColor='secondaryBackGroundColor' flexDirection='row' alignItems='center' paddingHorizontal='m' >
                <Feather name='search' size={25} color={theme.colors.textColor} />
                <TextInput style={{ flex: 1, color: theme.colors.textColor, fontFamily: 'RedRegular', paddingLeft: 10 }} placeholder='Search for a member' placeholderTextColor={theme.colors.textColor} />
            </Box>
        </Box>

        <CustomText variant='subheader' fontSize={14} marginTop='m' marginLeft='m'>{members.length} Members</CustomText>

        {/* ERROR DISPLAY */}
        { !isLoading && isError && (
            <Box width='100%' height={20} justifyContent='center' alignItems='center'>
                <Ionicons name='bug-outline' size={120} color={theme.colors.primaryColor} />
                <CustomText>An error occured</CustomText>
            </Box>
        )}

        {/* MEMBERS LIST */}
        { !isLoading && !isError && (
            <Box flex={1} marginTop='l'>
                <FlashList 
                    ListEmptyComponent={() => (
                        <>
                            { !isLoading && (
                                <Box width='100%' height={40} justifyContent='center' alignItems='center'>
                                    <CustomText>No members</CustomText>
                                </Box>
                            )}
                        </>
                    )}
                    ListFooterComponent={() => (
                        <>
                            { isLoading && (
                                <Box>
                                    <ActivityIndicator size='large' color={theme.colors.primaryColor} />
                                </Box>
                            )}
                        </>
                    )}
                    data={members}
                    estimatedItemSize={10}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={({ item }) => (
                        <MemberCard {...item} />
                    )}
                />
            </Box>
        )}
    </Box>
  )
}

export default Members