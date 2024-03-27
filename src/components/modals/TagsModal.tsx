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

const TagsModal = () => {


    const { setAll, tags } = useModalState((state) => state);
    const ref = useRef<BottomSheetModal>();
    const theme = useTheme<Theme>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'post'>>();

    useEffect(() => {
        ref.current.present();
    }, [])


    return (
        <ModalWrapper
            onClose={() => setAll({ showTags: false, tags: [] })}
            shouldScrroll={false}
            snapPoints={['75%', '80%']}
            ref={ref}
        >

            <Box flex={1} paddingHorizontal={'m'}>
                <CustomText variant={'subheader'} fontSize={22}>Tags</CustomText>
                <FlatList
                    data={tags}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.5}
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

        </ModalWrapper>
    )


}

export default TagsModal;