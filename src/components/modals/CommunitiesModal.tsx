import {View, Text, ActivityIndicator, NativeSyntheticEvent, NativeScrollEvent, Pressable} from 'react-native'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import ReactNavtieModalWrapper from '../ReactNavtieModalWrapper'
import Box from '../general/Box';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import CustomText from '../general/CustomText';
import { Image } from 'expo-image';
import httpService, { IMAGE_BASE } from '../../utils/httpService';
import { useDetailsState } from '../../states/userState';
import { Checkbox } from 'react-native-ui-lib';
import CustomButton from '../general/CustomButton';
import { Feather, Ionicons } from '@expo/vector-icons';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { ICommunity } from '../../models/Community';
import { useQuery } from 'react-query';
import { URLS } from '../../services/urls';
import { PaginatedResponse } from '../../models/PaginatedResponse'
import { uniqBy } from 'lodash';
import {UserAdd} from 'iconsax-react-native'
import {useModalState, VISIBILITY} from "../../states/modalState";

interface IProps {
    isVisisble: boolean;
    onClose: () => void;
    setActiveCommunity: (data: ICommunity) => void;
    activeCommunity: ICommunity|null;
  }

const CommunitiesModal = ({ isVisisble, onClose, activeCommunity, setActiveCommunity }: IProps) => {
    const [tab, setTab] = React.useState(1);
    const [communities, setCommunities] = React.useState<ICommunity[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const [nomore, setNomore] = React.useState(false);
    const [search, setSearch] = React.useState('');

    const {setAll, visibility} = useModalState((state) => state);

    const { isLoading, isError } = useQuery(['getMyCommunities'], () => httpService.get(`${URLS.GET_MY_COMMUNITIES}`), {
        onSuccess: (data) => {
            const item: PaginatedResponse<ICommunity> = data.data;
            if (item.data) {
                if (communities.length > 0) {
                    setCommunities(uniqBy([...communities, ...item.data.data], 'id'));
                    setTotal(item.data.total);
                } else {
                    setCommunities(uniqBy(item.data.data, 'id'));
                    setTotal(item.data.total);
                    setNomore(item.data.data.length < item.data.total ? false : true);
                }
                
            } else {
                setCommunities([])
            }
        }
    })
    const { profile_image } = useDetailsState((state) => state);
    const theme = useTheme<Theme>();

    // NativeSyntheticEvent<NativeScrollEvent>
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 20;
    
        if (
          layoutMeasurement.height + contentOffset.y >=
          contentSize.height - paddingToBottom
        ) {
          // Load more data when user reaches the end
          if (!isLoading && communities.length < total) {
            setCurrentPage(currentPage + 1);
          }
        }
      };
  return (
    <ReactNavtieModalWrapper isVisible={isVisisble} height={'70%'} backgroundColor={theme.colors.secondaryBackGroundColor}>
        <Box flex={1} >
            <Box paddingHorizontal='m' borderBottomWidth={0.5} borderBottomColor='borderColor' width={'100%'} height={50} justifyContent='center'>
                <CustomText variant='header' fontSize={18}>Post In</CustomText>
            </Box>

            <Box width={'100%'} height={50} flexDirection={'row'} paddingHorizontal={'l'} borderBottomWidth={0.5} borderBottomColor={'borderColor'}>
                <Pressable onPress={() => setTab(1)} style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottomColor: theme.colors.primaryColor,
                    borderBottomWidth: tab === 1? 3:0
                }} >
                    <FontAwesome5 name={'users'} size={25} color={theme.colors.textColor} />
                    <CustomText variant={'subheader'} fontSize={16} marginLeft={'s'}>Community</CustomText>
                </Pressable>

                <Pressable onPress={() => {
                    setTab(2);
                    setActiveCommunity(null);
                }} style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottomColor: theme.colors.primaryColor,
                    borderBottomWidth: tab === 2? 3:0
                }} >
                    <Image source={{ uri: profile_image ? IMAGE_BASE + profile_image : '' }} style={{ width: 30, height: 30, borderRadius: 20 }} />
                    <CustomText variant={'subheader'} fontSize={16} marginLeft={'s'}>Personal Profile</CustomText>
                </Pressable>
            </Box>

            {/*<Box paddingHorizontal='m' borderBottomWidth={0.5} borderBottomColor='borderColor' width={'100%'} height={80}  flexDirection='row' alignItems='center' justifyContent='space-between'>*/}
            {/*    <Box flexDirection='row' alignItems='center'>*/}
            {/*        <Image source={{ uri: profile_image ? IMAGE_BASE + profile_image : '' }} style={{ width: 40, height: 40, borderRadius: 20 }} />*/}
            {/*        <CustomText variant='body' marginLeft='s' fontSize={14}>Personal Profile</CustomText>*/}
            {/*    </Box>*/}

            {/*    <Checkbox color={theme.colors.primaryColor} value={activeCommunity === null ? true:false} onValueChange={() => setActiveCommunity(null)}  />*/}
            {/*</Box>*/}
            { tab === 2 && (
                <Box flex={1} paddingHorizontal='m' paddingTop={'m'}>
                    <CustomText variant={'body'} fontSize={18}>Share with</CustomText>

                    <Box flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} marginTop={'l'}>
                        <Box flexDirection={'row'} alignItems={'center'}>
                            <Box width={40} height={40} borderRadius={20} backgroundColor={'mainBackGroundColor'} alignItems={'center'} justifyContent={'center'}>
                                <Feather name={'globe'} color={theme.colors.textColor} size={25}/>
                            </Box>
                            <CustomText variant={'body'} fontSize={16} marginLeft={'m'}>Everyone</CustomText>
                        </Box>

                        <Checkbox color={theme.colors.primaryColor} value={visibility === VISIBILITY.EVERYONE} onValueChange={() => setAll({ visibility: VISIBILITY.EVERYONE })}  />
                    </Box>

                    <Box flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} marginTop={'l'}>
                        <Box flexDirection={'row'} alignItems={'center'}>
                            <Box width={40} height={40} borderRadius={20} backgroundColor={'mainBackGroundColor'} alignItems={'center'} justifyContent={'center'}>
                                <UserAdd variant={"Outline"} color={theme.colors.textColor} size={25}/>
                            </Box>
                            <CustomText variant={'body'} fontSize={16} marginLeft={'m'}>Only my followers</CustomText>
                        </Box>

                        <Checkbox color={theme.colors.primaryColor} value={visibility === VISIBILITY.FOLLOWERS} onValueChange={() => setAll({ visibility: VISIBILITY.FOLLOWERS })}  />
                    </Box>
                </Box>
            )}

            {/*comunity tab*/}
            { tab === 1 && (
                <Box flex={1} paddingHorizontal='m'>
                    <Box width="100%" height={50} flexDirection='row' alignItems='center' >
                        <Feather name='search' size={25} color={theme.colors.textColor} />
                        <TextInput value={search} onChangeText={(e) => setSearch(e)} placeholder='Search for a community' placeholderTextColor={theme.colors.lightGrey} style={{ flex: 1, fontFamily: 'RedRegular', fontSize: 16, marginLeft: 10, color: theme.colors.textColor }} />
                    </Box>
                    <CustomText variant='subheader' color='lightGrey' fontSize={16} marginTop='s'>Your communities</CustomText>
                    <ScrollView onScroll={handleScroll} scrollEventThrottle={16} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
                        { isLoading && (
                            <Box width={'100%'} height={40} justifyContent='center' alignItems='center'>
                                <ActivityIndicator size={'small'} color={theme.colors.primaryColor} />
                                <CustomText variant='body'>Loading Communities</CustomText>
                            </Box>
                        )}
                        {
                            !isLoading && isError && (
                                <Box width={'100%'} height={40} justifyContent='center' alignItems='center'>
                                    <CustomText variant='body' textAlign='center'>An error occured while trying to get your communities</CustomText>
                                </Box>
                            )
                        }
                        {
                            !isLoading && !isError && communities.length < 1 && (
                                <Box width={'100%'} height={40} justifyContent='center' alignItems='center'>
                                    <CustomText variant='body' textAlign='center'>You havn't created or joined any community</CustomText>
                                </Box>
                            )
                        }
                        {
                            !isLoading && !isError && communities.length > 0 && communities.filter((item) => {
                                if (search === '') {
                                    return item
                                }
                                if (search !== '' && item.name.toLowerCase().includes(search.toLowerCase())) {
                                    return item;
                                }
                            }).map((item, index) => (
                                <Box key={index.toString()} width={'100%'} height={70} borderBottomWidth={0} borderBottomColor='borderColor' flexDirection='row' alignItems='center' justifyContent='space-between'>
                                    <Box flexDirection='row'>
                                        {/* IMAGE BOX */}
                                        <Box width={50} height={50} borderRadius={30} overflow='hidden'>
                                            { item.profile_image !== null && <Image source={{ uri: IMAGE_BASE + item.profile_image }} style={{ width: '100%', height: '100%' }} /> }
                                            { item.profile_image === null && (
                                                <Box width={'100%'} height='100%' justifyContent='center' alignItems='center'>
                                                    <Ionicons name='people' size={30} color={theme.colors.textColor} />
                                                </Box>
                                            ) }
                                        </Box>

                                        <Box>
                                            <CustomText variant='subheader' fontSize={17}>c/{item.name}</CustomText>
                                            <CustomText variant='body' color='lightGrey' fontSize={16}>member(s){item.members_count}</CustomText>
                                        </Box>
                                    </Box>
                                    <Checkbox color={theme.colors.primaryColor} value={activeCommunity?.id === item.id ? true:false} onValueChange={() => setActiveCommunity(item)} />
                                </Box>
                            ))
                        }
                    </ScrollView>
                </Box>
            )}

            <Box width='100%' flexDirection={'row'} height={70} borderTopWidth={0.5} borderTopColor='borderColor' paddingHorizontal='m' alignItems='center' justifyContent='flex-end'>
                <CustomText variant={'header'} fontSize={18} onPress={() => onClose()} marginRight={'m'}>Cancel</CustomText>
                <CustomButton onPress={() => onClose()} title='Save' color={activeCommunity === null || tab !== 2 ?'grey':theme.colors.primaryColor} textColor='white' variant='subheader' height={38} />
            </Box>
        </Box>
    </ReactNavtieModalWrapper>
  )
}

export default CommunitiesModal