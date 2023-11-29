import { View, Text, Modal, TextInput, StyleSheet, Platform, Pressable } from 'react-native'
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
import Checkbox from 'expo-checkbox';
import { ScrollView } from 'react-native-gesture-handler'

type Follower = {
    follower: IUser;
    following: IUser;
    follower_id: number;
    user_id: number;
}


const TagCard = ({ user, isChecked, onChecked }: {
    user: Partial<Follower>,
    onChecked: (user: number) => void,
    isChecked: boolean
}) => {
    const theme = useTheme<Theme>();
    const handleChecked = React.useCallback(() => {
        onChecked(user.follower_id);
    },[])
    return (
        <Box width='100%' height={70} flexDirection='row' alignItems='center' justifyContent='space-between'>
            <Box flexDirection='row' alignItems='center' > 
                <Box width={50} height={50} borderRadius={25} backgroundColor='secondaryBackGroundColor' overflow='hidden'>
                    <Image source={{ uri: `${IMAGE_BASE}${user.follower.profile_image}` }} style={{ width: '100%', height: '100%', borderRadius:1 }} contentFit='cover' />
                </Box>

                <CustomText variant='body' color='black' marginLeft='s'>{user.follower.name}</CustomText>
                <CustomText variant='xs' color='grey' marginLeft='s'>@{user.follower.username}</CustomText>
            </Box>
            <Pressable 
                onPress={() => handleChecked()}
                style={{
                    width: 20,
                    height: 20,
                    borderRadius: 3,
                    borderWidth: 1,
                    borderColor: theme.colors.textColor,
                    backgroundColor: isChecked ? theme.colors.primaryColor:theme.colors.transparent2,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    { isChecked && <Feather name="check" size={8} color={'white'} /> }
                </Pressable>
            {/* <Box width={20} height={20} borderRadius={3} borderWidth={1} borderColor='textColor' bg={isChecked ? 'primaryColor':'transparent2'} />
            <Checkbox value={isChecked}  onValueChange={handleChecked} color={isChecked ? theme.colors.primaryColor : theme.colors.textColor}   /> */}
        </Box>
    )
}

const TagModal = ({ open, onClose, tags, setTags }: {
    open: boolean,
    onClose: () => void,
    tags: number[],
    setTags: (tags: number) => void
}) => {
    const theme = useTheme<Theme>();
    const [followers, setFollowers] = React.useState<Follower[]>([]);
    const [selectedUsers, setSelectedUsers] = React.useState([])
    const [ids, setIds] = React.useState<number[]>([]);
    const [users, setUsers] = React.useState<Follower[]>([])
    const { id } = useDetailsState((state) => state);

    React.useEffect(() => {
        setSelectedUsers(followers.filter((item) => tags.includes(item.follower_id)));
    }, [tags])

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

    // const Selected = React.useCallback(() => {
    //     return setSelectedUsers(followers.filter((item) => tags.includes(item.follower.id)))
    // }, [tags, followers]);

    const handleChange = React.useCallback((valid: number) => {
        setTags(valid);
    }, []);
   

  return (
    <Modal style={{ flex:1, backgroundColor: 'white' }} animationType='slide' transparent visible={open} onDismiss={() => onClose()} >
        <Box flex={1} backgroundColor='mainBackGroundColor' paddingTop={Platform.OS === 'ios' ? 'xl':'s'} paddingHorizontal='m'>
            {/* HEADERR BAR */}
            <Box flexDirection='row' height={Platform.OS === 'ios' ? 50: 50} alignItems='center' paddingTop='m'>
                <Ionicons name='arrow-back-outline' size={30} color={theme.colors.textColor} onPress={() => onClose()} />
                <CustomText variant='subheader' marginLeft='s'>Tag Someone</CustomText>
            </Box>

            {/* SEARCH  BAR AREA */}
            <Box style={{ ...style.textInput }} marginBottom='l' backgroundColor='secondaryBackGroundColor'>
                <Ionicons name='search-outline' size={25} color={theme.colors.textColor} />
                <TextInput style={{ flex: 1, fontFamily: 'RedRegular', marginLeft: 20, fontSize: theme.textVariants.body.fontSize }} placeholderTextColor={theme.colors.textColor} placeholder='Search for someone to tag'  />
            </Box>

            {selectedUsers.length > 0 && (
                <Box width='100%' height={80} >
                    <ScrollView horizontal contentContainerStyle={{ width: '100%', height: '100%', alignItems: 'center' }}>
                        {selectedUsers.map((item, index) => (
                             <Box key={index.toString()} width={80} justifyContent='center' alignItems='center' >
                                <Box width={60} height={60} borderRadius={30} overflow='hidden'>
                                <Image source={{ uri: `${IMAGE_BASE}${item.follower.profile_image}` }} style={{ width: 50, height: 50, borderRadius: 25 }} contentFit='cover' />
                                </Box>
                                <CustomText variant='xs' textAlign='center' style={{ width: '100%'}}>@{item.follower.username.length > 7 ? item.follower.username.substring(0, 7) + '...' : item.follower.username}</CustomText>
                         </Box>
                        ))}
                    </ScrollView>
                </Box>
            )}

            {/* SCROLLAREA */}
            { !isLoading && !isError && (
                <ScrollView>
                    {
                        followers.map((item, index) => (
                            <TagCard key={index.toString()} user={item} onChecked={handleChange} isChecked={tags.includes(item.follower_id)} />

                        ))
                    }
                </ScrollView>
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

export default TagModal