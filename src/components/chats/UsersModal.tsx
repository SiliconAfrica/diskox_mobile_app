import { View, Text, Modal, TextInput, StyleSheet, Platform, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import CustomText from '../general/CustomText'
import { IUser } from '../../models/user'
import { Image } from 'expo-image'
import { FlashList } from '@shopify/flash-list'
import { useQuery } from 'react-query'
import { useDetailsState } from '../../states/userState'
import httpService, { IMAGE_BASE } from '../../utils/httpService'
import { Feather, Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { PageType } from '../../pages/login'
import { Follower } from '../../models/Follower'


export const UserCard = ({ user, action }: {
    user: Partial<Follower>,
    action: (us: Follower) => void
}) => {
    const theme = useTheme<Theme>();
 
    return (
        <Pressable onPress={() => action(user as Follower)} style={{ width: '100%', height: 70, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
            <Box flexDirection='row' alignItems='center' > 
                <Box width={50} height={50} borderRadius={25} backgroundColor='secondaryBackGroundColor' overflow='hidden'>
                    <Image source={{ uri: `${IMAGE_BASE}${user.follower.profile_image}` }} style={{ width: '100%', height: '100%', borderRadius:1 }} contentFit='cover' />
                </Box>

                <CustomText variant='body' color='black' marginLeft='s'>{user.follower.name}</CustomText>
                <CustomText variant='xs' color='grey' marginLeft='s'>@{user.follower.username}</CustomText>
            </Box>
        </Pressable>
    )
}

const UserModal = ({ open, onClose }: {
    open: boolean,
    onClose: () => void,
}) => {
    const theme = useTheme<Theme>();
    const [followers, setFollowers] = React.useState<Follower[]>([])
    const { id } = useDetailsState((state) => state);
    const navigation = useNavigation<PageType>();

    const { isLoading, isError } = useQuery(['GetFollower', id], () => httpService.get(`/fetch_user_followers/${id}`), {
        enabled: true,
        onSuccess: (data) => {
            const followersArr: Follower[] = data.data.data.data;
            setFollowers(followersArr);
        },
        onError: (error) => {
            alert(JSON.stringify(error));
        }
    });

    const Selected = React.useCallback((user: Follower) => {
        // navigate to chat page
        // with the users id
        navigation.navigate("chat", { userId: user.follower_id, profile_image: user.follower.profile_image, username: user.follower.username, last_seen: user.follower.last_seen });
        onClose();
    }, [followers]);

    const handleCheck = React.useCallback((valid: number, val: boolean) => {
        // setTags(valid, val)
    }, [])
   

  return (
    <Modal style={{ flex:1, backgroundColor: 'white' }} animationType='slide' transparent visible={open} onDismiss={() => onClose()} >
        <Box flex={1} backgroundColor='mainBackGroundColor' paddingTop={Platform.OS === 'ios' ? 'xl':'s'} paddingHorizontal='m'>
            {/* HEADERR BAR */}
            <Box flexDirection='row' height={50} alignItems='center' paddingTop='m'>
                <Ionicons name='arrow-back-outline' size={30} color={theme.colors.textColor} onPress={() => onClose()} />
                <CustomText variant='subheader' fontSize={22} marginLeft='s'>New Chat</CustomText>
            </Box>

            {/* SEARCH  BAR AREA */}
            <Box style={{ ...style.textInput }} marginBottom='l' backgroundColor='secondaryBackGroundColor'>
                <Ionicons name='search-outline' size={25} color={theme.colors.textColor} />
                <TextInput style={{ flex: 1, fontFamily: 'RedRegular', marginLeft: 20, fontSize: theme.textVariants.body.fontSize }} placeholderTextColor={theme.colors.textColor} placeholder='Search for someone to tag'  />
            </Box>

            {
                isLoading && (
                    <Box width='100%' height={50} justifyContent='center' alignItems='center'>
                        <ActivityIndicator size='small' color={theme.colors.primaryColor} />
                    </Box>
                )
            }

            {/* SCROLLAREA */}
            { !isLoading && !isError && (
                <FlashList 
                ListEmptyComponent={() => (
                    <Text>Nothing to see here</Text>
                )}
                keyExtractor={(item, index) => index.toString()}
                estimatedItemSize={100}
                data={followers}
                renderItem={({ item }) => (
                    <UserCard user={item} action={Selected} />
                )}
            />
            )}

        </Box>
    </Modal>
  )
}

const style = StyleSheet.create({
    textInput: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 20
    }
});

export default UserModal