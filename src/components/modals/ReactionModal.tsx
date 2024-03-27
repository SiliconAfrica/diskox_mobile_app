import React, {useEffect, useRef} from 'react';
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {useModalState} from "../../states/modalState";
import {useTheme} from "@shopify/restyle";
import {Theme} from "../../theme";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/MainNavigation";
import ModalWrapper from "../ModalWrapper";
import Box from "../general/Box";
import CustomText from "../general/CustomText";
import {IUser} from "../../models/user";
import {useQuery} from "react-query";
import httpService, {IMAGE_BASE} from "../../utils/httpService";
import {IReaction} from "../../models/reaction";
import {URLS} from "../../services/urls";
import {PaginatedResponse} from "../../models/PaginatedResponse";
import {uniqBy} from "lodash";
import {FlatList} from "react-native-gesture-handler";
import { Image } from 'expo-image';
import FadedButton from "../general/FadedButton";
import {ActivityIndicator} from "react-native";

const ReactionModal = () => {

    const [page, setPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const [users, setUsers] = React.useState<IReaction[]>([]);

    const { reactionId, reactionType, showReactedUsers, setAll } = useModalState((state) => state);
    const ref = useRef<BottomSheetModal>();
    const theme = useTheme<Theme>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'post'>>();

    useEffect(() => {
        ref.current.present();
    }, [])

    const getPostReact = useQuery(['getPostReact', reactionType], () => httpService.get(`${URLS.GET_POST_REACTION(reactionId)}`, {
        params: {
            page
        }
    }), {
        enabled: reactionType === 'POST',
        onSuccess: (data) => {
            const item: PaginatedResponse<IReaction> = data.data;
            if (users.length > 0) {
                const arr = uniqBy([...users, ...item.data.data], 'id');
                setTotal(item.data.total);
            } else {
                setUsers(item.data.data);
                setTotal(item.data.total);
            }
        },
        onError: (error) => {},
    })


    const getCommentReact = useQuery(['getPostReact', reactionType], () => httpService.get(`${URLS.GET_COMMENT_REACTION(reactionId)}`, {
        params: {
            page
        }
    }), {
        enabled: reactionType === 'COMMENT',
        onSuccess: (data) => {
            const item: PaginatedResponse<IReaction> = data.data;
            if (users.length > 0) {
                const arr = uniqBy([...users, ...item.data.data], 'id');
                setTotal(item.data.total);
            } else {
                setUsers(item.data.data);
                setTotal(item.data.total);

            }
        },
        onError: (error) => {},
    })


    const getReplyReact = useQuery(['getPostReact', reactionType], () => httpService.get(`${URLS.GET_REPLY_REACTION(reactionId)}`, {
        params: {
            page
        }
    }), {
        enabled: reactionType === 'REPLY',
        onSuccess: (data) => {
            const item: PaginatedResponse<IReaction> = data.data;
            if (users.length > 0) {
                const arr = uniqBy([...users, ...item.data.data], 'id');
                setTotal(item.data.total);
            } else {
                setUsers(item.data.data);
                setTotal(item.data.total);
            }
        },
        onError: (error) => {},
    })

    // @ts-ignore
    return (
        <ModalWrapper
            onClose={() => setAll({ showReactedUsers: false, reactionId: null })}
            shouldScrroll={false}
            snapPoints={['75%', '80%']}
            ref={ref}
        >
            {reactionType === 'POST' && getPostReact.isError && (
                <Box width={'100%'} height={100} alignItems={'center'} justifyContent={'center'}>
                    <CustomText variant={'header'}>Error 404</CustomText>
                    <CustomText>An error occured while getting the reactions</CustomText>
                </Box>
            )}

            {reactionType === 'COMMENT' && getCommentReact.isError && (
                <Box width={'100%'} height={100} alignItems={'center'} justifyContent={'center'}>
                    <CustomText variant={'header'}>Error 404</CustomText>
                    <CustomText>An error occured while getting the reactions</CustomText>
                </Box>
            )}

            {reactionType === 'REPLY' && getReplyReact.isError && (
                <Box width={'100%'} height={100} alignItems={'center'} justifyContent={'center'}>
                    <CustomText variant={'header'}>Error 404</CustomText>
                    <CustomText>An error occured while getting the reactions</CustomText>
                </Box>
            )}

            { !getPostReact.isError && !getCommentReact.isError && !getReplyReact.isError && (
                <Box flex={1} paddingHorizontal={'m'}>
                    <CustomText variant={'subheader'} fontSize={22}>Reactions</CustomText>
                    <FlatList
                        data={users}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => {
                            if(users.length < total) {
                                setPage((prev) => prev+1);
                            }
                        }}
                        ListEmptyComponent={() => (
                            <Box width={'100%'} height={50} justifyContent={'center'} alignItems={'center'}>
                                { reactionType === 'POST' && !getPostReact.isLoading ? (
                                    <>
                                        { getPostReact.isLoading && (
                                            <Box width={'100%'} height={50} justifyContent={'center'} alignItems={'center'}>
                                                <CustomText variant={'subheader'}>No Reaction</CustomText>
                                            </Box>
                                        )}
                                    </>
                                ) : reactionType === 'COMMENT' && !getCommentReact.isLoading ? (
                                    <>
                                        { getCommentReact.isLoading && (
                                            <Box width={'100%'} height={50} justifyContent={'center'} alignItems={'center'}>
                                                <CustomText variant={'subheader'}>No Reaction</CustomText>
                                            </Box>
                                        )}
                                    </>
                                ):(
                                    <>
                                        { getReplyReact.isLoading && !getReplyReact.isLoading && (
                                            <Box width={'100%'} height={50} justifyContent={'center'} alignItems={'center'}>
                                                <CustomText variant={'subheader'}>No Reaction</CustomText>
                                            </Box>
                                        )}
                                    </>
                                )}
                            </Box>
                        )}
                        ListFooterComponent={() => (
                            <>
                                { reactionType === 'POST' ? (
                                    <>
                                        { getPostReact.isLoading && (
                                            <Box width={'100%'} height={50} justifyContent={'center'} alignItems={'center'}>
                                                <ActivityIndicator size={'small'} color={theme.colors.primaryColor} />
                                                <CustomText>Loading More...</CustomText>
                                            </Box>
                                        )}
                                    </>
                                ) : reactionType === 'COMMENT' ? (
                                    <>
                                        { getCommentReact.isLoading && (
                                            <Box width={'100%'} height={50} justifyContent={'center'} alignItems={'center'}>
                                                <ActivityIndicator size={'small'} color={theme.colors.primaryColor} />
                                                <CustomText>Loading More...</CustomText>
                                            </Box>
                                        )}
                                    </>
                                ):(
                                    <>
                                        { getReplyReact.isLoading && (
                                            <Box width={'100%'} height={50} justifyContent={'center'} alignItems={'center'}>
                                                <ActivityIndicator size={'small'} color={theme.colors.primaryColor} />
                                                <CustomText>Loading More...</CustomText>
                                            </Box>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                        renderItem={({ item }) => (
                            <Box width={'100%'} height={80} borderBottomColor={'borderColor'} borderBottomWidth={0.5} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                <Box flexDirection={'row'} alignItems={'center'}>
                                    { item.user.profile_image !== null && (
                                        <Box width={40} height={40} borderRadius={20} backgroundColor={'primaryColor'} overflow={'hidden'}>
                                            <Image source={{ uri: `${IMAGE_BASE}${item.user.profile_image}` }} contentFit={'cover'} style={{ width: '100%', height: '100%'}} />
                                        </Box>
                                    )}

                                    { item.user.profile_image === null && (
                                        <Box width={40} height={40} borderRadius={20} overflow={'hidden'}>
                                            <Image source={require('../../../assets/images/dummy.jpeg')} contentFit={'cover'} style={{ width: '100%', height: '100%'}} />
                                        </Box>
                                    )}

                                    <CustomText variant={'subheader'} fontSize={16} marginLeft={'s'}>{item.user.name}
                                        <CustomText variant={'xs'} marginLeft={'s'} >@{item.user.username}</CustomText>
                                    </CustomText>
                                </Box>

                                {/*{ item.user.isFollowing === 0 && (*/}
                                {/*    <FadedButton title={'Follow'} onPress={() => {}} width={70} height={25}  />*/}
                                {/*)}*/}
                            </Box>
                        )}
                    />
                </Box>
            )}

        </ModalWrapper>
    )


}

export default ReactionModal;