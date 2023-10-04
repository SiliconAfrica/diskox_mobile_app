import { View, Text, ImageBackground, useWindowDimensions, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import CustomText from '../general/CustomText';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { useMutation, useQuery } from 'react-query';
import httpService, { IMAGE_BASE } from '../../utils/httpService';
import { CompositeNavigationProp, RouteProp, useNavigation, useRoute,  } from '@react-navigation/native';
import { PageType } from '../../pages/login';
import { RootBottomTabParamList } from '../../navigation/BottomTabs';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import { URLS } from '../../services/urls';
import { Ionicons, Feather } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { useDetailsState } from '../../states/userState';
import { useUtilState } from '../../states/util';
import moment from 'moment';
import { IUser } from '../../models/user';
import useToast from '../../hooks/useToast';

export enum ACTIVE_TAB {
    OVERVIEW = 1,
    POSTS,
    UPVOTES,
    COMMENTS,
    POLLS,
  }

interface IProps {
    currentTab: ACTIVE_TAB,
    switchTab: (data: ACTIVE_TAB) => void
}

const BannerSection = ({ currentTab, switchTab }: IProps) => {
    const [user, setUser] = React.useState<IUser | null>(null);
    const navigation = useNavigation<PageType>();
    const route = useRoute<any>();
    const HEIGHT = useWindowDimensions().height;
    const { id} = useDetailsState((state) => state)
    const { userId } = route.params;
    const theme = useTheme<Theme>();
    const toast = useToast();

    const { profile_image, username, name, created_at, about, country, state } = useDetailsState((state) => state);
    const { isDarkMode } = useUtilState((state) => state)

    const getUserDetails = useQuery(['getDetails', userId], () => httpService.get(`${URLS.GET_USER_BY_ID}/${userId}`), {
        enabled: userId !== id,
        onError: () => {},
        onSuccess: (data) => {
            console.log(`this is not my profile oooo!!!!`);
            console.log(data?.data?.data);
            setUser(data?.data?.data);
        }
    });

    const getAuthUserDetails = useQuery(['getLoggedInDetails', id], () => httpService.get(`${URLS.GET_AUTH_USER_DETAILS}`), {
        enabled: userId === id,
        onError: () => {},
        onSuccess: (data) => {
            console.log(`this is my profile`);
            console.log(data?.data?.data);
            setUser(data?.data?.data);
        }
    });

    console.log(userId);

    // query

    const getFollowCount = useQuery(['getFollowerCount', userId], () => httpService.get(`${URLS.GET_USER_FOLLOWING_AND_FOLLOWERS_COUNT}/${userId}`), {
        onError: () => {},
        onSuccess: (data) => {
            console.log(data?.data);
        }
    });

    const followUnFollowMutation = useMutation({
        mutationFn: () => httpService.post(`${URLS.FOLLOW_OR_UNFOLLOW_USER}/${userId}`),
        onSuccess: (data) => {
            //console.log(toast);
            toast.show(data?.data?.message, { type: 'success' });
        }
    });
  return (
    <Box width='100%'>
        <ImageBackground source={require('../../../assets/images/banner.png')} style={{ width: '100%', height: HEIGHT / 100 * 25, paddingTop: 50 }}>
            {/* <Box flexDirection='row'>
                <Text>hello therre people</Text>
            </Box> */}

            <Box width={100} height={100} borderRadius={50} backgroundColor='black' position='absolute' bottom={-50} left={20} overflow='hidden' style={{ padding: 2, backgroundColor: isDarkMode ? theme.colors.secondaryBackGroundColor:'white' }}>
                <Image source={{ uri: `${IMAGE_BASE}/${user?.profile_image}`}} contentFit='cover' style={{ width: '100%', height: '100%', borderRadius: 70}} />
            </Box>
        </ImageBackground>
        
        {/* BUTTONS SECTION */}

        {
            userId === id && (
                <Box width='100%' height={80} flexDirection='row' justifyContent='flex-end' alignItems='center' paddingHorizontal='m'>
                    <Pressable 
                    onPress={() => navigation.navigate('settings')}
                    style={{ height: 50, borderRadius: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, borderColor: theme.colors.secondaryBackGroundColor, borderWidth: 2, marginRight: 10 }} >
                        <Ionicons name="create-outline" size={25} color={theme.colors.textColor} />
                        <CustomText variant='xs' marginLeft='s'>Edit Profile</CustomText>
                    </Pressable>

                    {/* <Box width={50} height={50} borderRadius={25} borderWidth={2} borderColor='secondaryBackGroundColor' alignItems='center' justifyContent='center'>
                        <Ionicons name="ellipsis-vertical-outline" size={25} color={theme.colors.textColor} />
                    </Box> */}
                </Box>
            )
        }


        {
            userId !== id && (
                <Box width='100%' height={80} flexDirection='row' justifyContent='flex-end' alignItems='center' paddingHorizontal='m'>
                    <Pressable 
                    onPress={() => followUnFollowMutation.mutate()}
                    style={{ height: 50, borderRadius: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, borderColor: theme.colors.secondaryBackGroundColor, borderWidth: 2, backgroundColor: theme.colors.primaryColor, marginRight: 10 }} >
                        { !followUnFollowMutation.isLoading && (
                            <>
                                <Ionicons name="person-add-outline" size={25} color={theme.colors.textColor} />
                                <CustomText variant='header' fontSize={16}  marginLeft='s'>Follow</CustomText>
                            </>
                        )}
                        {
                            followUnFollowMutation.isLoading && (
                                <ActivityIndicator color="whwite" size='small' />
                            )
                        }
                    </Pressable>

                    <Pressable style={{ height: 50, width: 50, borderRadius: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',  borderColor: theme.colors.grey, borderWidth: 2, marginRight: 10 }} >
                        <Ionicons name="mail-outline" size={25} color={theme.colors.textColor} />
                    </Pressable>

                    
                </Box>
            )
        }

        {/* DETAILS SECTIONS */}
        <Box paddingHorizontal='m'>
            {/* NAME */}
            <Box flexDirection='row'>
                <CustomText variant='subheader' fontSize={18}>{user?.name || 'NONE'}</CustomText>
                <CustomText variant='xs' marginLeft='s'>@{user?.username}</CustomText>
            </Box>

            {/* FOLLOWER */}
            <Box flexDirection='row' alignItems='center' marginTop='s'>
                <Box flexDirection='row' alignItems='center'>
                    <CustomText variant='subheader' fontSize={18}>{!getFollowCount.isLoading && getFollowCount.data?.data.followers_count}</CustomText>
                    <CustomText variant='xs' marginLeft='s'>Followers</CustomText>
                </Box>
                    <Ionicons name='ellipse-outline' size={10} color={theme.colors.textColor} style={{ marginHorizontal: 10}} />
                <Box flexDirection='row' alignItems='center'>
                    <CustomText variant='subheader' fontSize={18}>{!getFollowCount.isLoading && getFollowCount.data?.data.following_count}</CustomText>
                    <CustomText variant='xs' marginLeft='s'>Following</CustomText>
                </Box>
            </Box>

            <CustomText variant='body' marginTop='m'>{user?.about}</CustomText>

            <Box flexDirection='row' marginTop='m' alignItems='center'>
                <Box flexDirection='row' alignItems='center'>
                    <Ionicons name='calendar-outline' size={25} color={theme.colors.textColor} />
                    <CustomText marginLeft='s'>Joined {moment(user?.created_at).format('MMM YYYY')}</CustomText>
                </Box>

                <Box flexDirection='row' alignItems='center' marginLeft='l'>
                    <Ionicons name='location-outline' size={25} color={theme.colors.textColor} />
                    <CustomText marginLeft='s'>{user?.state}, {user?.country}</CustomText>
                </Box>
            </Box>

            {/* TAB BAR */}

            <Box width='100%' height={60} flexDirection='row' paddingHorizontal='s' borderBottomColor='secondaryBackGroundColor' borderBottomWidth={2}>

                <Pressable style={{ ...styles.button, borderBottomColor:theme.colors.primaryColor, borderBottomWidth: currentTab === ACTIVE_TAB.OVERVIEW ? 3 : 0 }} onPress={() => switchTab(ACTIVE_TAB.OVERVIEW)} >
                    <CustomText variant='xs' color={currentTab === ACTIVE_TAB.OVERVIEW ? 'primaryColor':'textColor'}>Overview</CustomText>
                </Pressable>

                <Pressable style={{ ...styles.button, borderBottomColor:theme.colors.primaryColor, borderBottomWidth: currentTab === ACTIVE_TAB.POSTS ? 3 : 0 }} onPress={() => switchTab(ACTIVE_TAB.POSTS)} >
                    <CustomText variant='xs' color={currentTab === ACTIVE_TAB.POSTS ? 'primaryColor':'textColor'} >Posts</CustomText>
                </Pressable>

                <Pressable style={{ ...styles.button, borderBottomColor:theme.colors.primaryColor, borderBottomWidth: currentTab === ACTIVE_TAB.UPVOTES? 3 : 0 }} onPress={() => switchTab(ACTIVE_TAB.UPVOTES)} >
                    <CustomText variant='xs' color={currentTab === ACTIVE_TAB.UPVOTES ? 'primaryColor':'textColor'} >Upvotes</CustomText>
                </Pressable>

                <Pressable style={{ ...styles.button, borderBottomColor:theme.colors.primaryColor, borderBottomWidth: currentTab === ACTIVE_TAB.COMMENTS ? 3 : 0 }} onPress={() => switchTab(ACTIVE_TAB.COMMENTS)} >
                    <CustomText variant='xs' color={currentTab === ACTIVE_TAB.COMMENTS ? 'primaryColor':'textColor'} >Comments</CustomText>
                </Pressable>

                <Pressable style={{ ...styles.button, borderBottomColor:theme.colors.primaryColor, borderBottomWidth: currentTab === ACTIVE_TAB.POLLS? 3 : 0 }} onPress={() => switchTab(ACTIVE_TAB.POLLS)} >
                    <CustomText variant='xs' color={currentTab === ACTIVE_TAB.POLLS ? 'primaryColor':'textColor'} >Polls</CustomText>
                </Pressable>

            </Box>

        </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
    button: {
        height: '100%',
        justifyContent: 'center',
        alignItems: "center",
        flex: 1,
    }
});

export default BannerSection