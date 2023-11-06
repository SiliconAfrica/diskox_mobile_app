import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import ChatHeader from './ChatHeader'
import CustomText from '../general/CustomText'
import NormalButton from '../general/NormalButton'
import { useChatScreenState } from '../../pages/bottomtabs/chats/state'
import { useQuery } from 'react-query'
import httpService, { IMAGE_BASE } from '../../utils/httpService'
import { URLS } from '../../services/urls'
import { IUser } from '../../models/user'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import { Image } from 'expo-image'
import { set } from 'react-native-reanimated'
import { FlashList } from '@shopify/flash-list'
import { ChatEntry } from '../../models/ChatEntry'
import moment from 'moment'
import { useNavigation } from '@react-navigation/native'
import { PageType } from '../../pages/login'
import { Ionicons } from '@expo/vector-icons'
import useDebounce from '../../hooks/useDebounce'


interface IProps {
}

export const UserList = ({ user, action }: {
    user: ChatEntry,
    action: (us: ChatEntry) => void
}) => {
    const theme = useTheme<Theme>();

    return (
        <Pressable onPress={() => action(user)} style={{ width: '100%', height: 70, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: theme.colors.secondaryBackGroundColor, borderBottomWidth: 2 }} >
            <Box flexDirection='row' alignItems='center' >
                <Box width={32} height={32} borderRadius={17} backgroundColor='secondaryBackGroundColor' overflow='hidden'>
                    <Image source={{ uri: `${IMAGE_BASE}${user.profile_image}` }} style={{ width: '100%', height: '100%', borderRadius: 1 }} contentFit='cover' />
                </Box>

                <Box marginLeft='s'>
                    <Box flexDirection='row'>
                        <CustomText variant='subheader' fontSize={15} color='black' >@{user.username}</CustomText>
                        {/* <CustomText variant='xs' color='grey' marginLeft='s'>@{user.username}</CustomText> */}
                        {user.unread_message > 0 && (
                            <Box width={15} height={15} borderRadius={10} justifyContent='center' alignItems='center' backgroundColor='primaryColor'>
                                <CustomText variant='xs' style={{ color: 'white' }}>{user.unread_message}</CustomText>
                            </Box>
                        )}
                    </Box>
                    <CustomText variant='body' fontSize={14}>{user.message}</CustomText>
                </Box>
            </Box>
            <CustomText variant='xs'>{moment(user.created_at).startOf('hour').fromNow()}</CustomText>
        </Pressable>
    )
}
const ChatList = () => {
    const [chats, setChats] = React.useState<ChatEntry[]>([]);
    const { setAll } = useChatScreenState((state) => state);
    const navigation = useNavigation<PageType>();
    const theme = useTheme<Theme>();
    const [searchText, setSearchText] = React.useState('');

    const debounceValue = useDebounce(searchText);

    const { isLoading } = useQuery(['getChatedUsers'], () => httpService.get(`${URLS.CHATTED_USER}`), {
        onSuccess: (data) => {
            setChats(data.data.data.data);
        },
        onError: (error: any) => {
            alert(error.message);
        }
    });

    const goToPage = React.useCallback((user: ChatEntry) => {
        navigation.navigate("chat", { userId: user.user_id, profile_image: user.profile_image, username: user.username, last_seen: '' });

    }, []);

    return (
        <Box flex={1} backgroundColor='mainBackGroundColor' position='relative'>
            <ChatHeader text={searchText} onChange={(e) => setSearchText(e)} />

            {chats.length > 0 && (
                <Pressable onPress={() => setAll({ showModal: true })} style={{ width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', bottom: 20, right: 20, backgroundColor: theme.colors.primaryColor, position: 'absolute', zIndex: 10 }}>
                    <Ionicons name='add-outline' size={25} color='white' />
                </Pressable>
            )}
            <FlashList
                contentContainerStyle={{ paddingHorizontal: 20 }}
                ListEmptyComponent={() => (
                    <Box flex={1} justifyContent='center' alignItems='center'>
                        <CustomText variant='body'>You have not started any chat</CustomText>
                        <Box width='60%'>
                            <NormalButton label='Chat someone' action={() => setAll({ showModal: true })} />
                        </Box>
                    </Box>
                )}
                keyExtractor={(item, index) => index.toString()}
                estimatedItemSize={100}
                data={chats.filter((item) => {
                    if (debounceValue === '') {
                        return item;
                    } else if (item.username.toLowerCase().includes(debounceValue.toLowerCase())) {
                        return item;
                    }else {
                        return
                    }
                })}
                renderItem={({ item }) => (
                    <UserList user={item} action={goToPage} />
                )}
            />
        </Box>
    )
}

export default ChatList