import { View, Text, Modal, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import CustomText from '../general/CustomText'
import { IUser } from '../../models/user'
import { Checkbox } from 'react-native-ui-lib'
import { Image } from 'expo-image'
import { FlashList } from '@shopify/flash-list'
import { useQuery } from 'react-query'
import { useDetailsState } from '../../states/userState'
import httpService, { IMAGE_BASE } from '../../utils/httpService'
import { Feather, Ionicons } from '@expo/vector-icons'

type Follower = {
    follower: IUser;
    following: IUser;
    follower_id: number;
    user_id: number;
}

const users: Partial<IUser>[] = [
    {
        id: 1,
        username: 'Dandolla',
        profile_image: require('../../../assets/images/logoB.png'),
        name: 'Dan Emma',
    },

    {
        id: 2,
        username: 'Dandolla98',
        profile_image: require('../../../assets/images/logoB.png'),
        name: 'Dan Emma2',
    },
    {
        id: 3,
        username: 'Dan',
        profile_image: require('../../../assets/images/logoB.png'),
        name: 'Dan john',
    },
    {
        id: 4,
        username: 'Emma',
        profile_image: require('../../../assets/images/logoB.png'),
        name: 'Emma',
    },
] 

const TagCard = ({ user, isChecked, onChecked }: {
    user: Partial<Follower>,
    onChecked: (user: number, val: boolean) => void,
    isChecked: boolean
}) => {
    const theme = useTheme<Theme>();
    const [c, setC] = React.useState(isChecked);
    const handleChecked = React.useCallback((val: boolean) => {
        onChecked(user.follower.id, val);
        setC(val);
    },[isChecked])
    return (
        <Box width='100%' height={70} flexDirection='row' alignItems='center' justifyContent='space-between'>
            <Box flexDirection='row' alignItems='center' > 
                <Box width={50} height={50} borderRadius={25} backgroundColor='secondaryBackGroundColor' overflow='hidden'>
                    <Image source={{ uri: `${IMAGE_BASE}${user.follower.profile_image}` }} style={{ width: '100%', height: '100%', borderRadius:1 }} contentFit='cover' />
                </Box>

                <CustomText variant='body' color='black' marginLeft='s'>{user.follower.name}</CustomText>
                <CustomText variant='xs' color='grey' marginLeft='s'>@{user.follower.username}</CustomText>
            </Box>
            <Checkbox value={c} onValueChange={handleChecked}  borderRadius={5} color={c ? theme.colors.primaryColor : theme.colors.textColor} selecedIcon={<Feather name='check' size={15} color='white' />} sele  />
        </Box>
    )
}

const TagModal = ({ open, onClose, tags, setTags }: {
    open: boolean,
    onClose: () => void,
    tags: number[],
    setTags: (tags: number, val: boolean) => void
}) => {
    const theme = useTheme<Theme>();
    const [followers, setFollowers] = React.useState<Follower[]>([])
    const [ids, setIds] = React.useState<number[]>([]);
    const [users, setUsers] = React.useState<Follower[]>([])
    const { id } = useDetailsState((state) => state);

    const { isLoading, isError } = useQuery(['GetFollower', id], () => httpService.get(`/fetch_user_followers/${id}`), {
        enabled: true,
        onSuccess: (data) => {
            const followersArr: Follower[] = data.data.data.data;
            setFollowers(followersArr);
            console.log(data.data.data.data);
        },
        onError: (error) => {
            alert(JSON.stringify(error));
        }
    });

    const Selected = React.useCallback(() => {
        return followers.filter((item) => tags.includes(item.follower.id))
    }, [tags, followers]);

    const handleCheck = React.useCallback((valid: number, val: boolean) => {
        setTags(valid, val)
    }, [])
   

  return (
    <Modal style={{ flex:1, backgroundColor: 'white' }} animationType='slide' transparent visible={open} onDismiss={() => onClose()} >
        <Box flex={1} backgroundColor='mainBackGroundColor' paddingTop='xl' paddingHorizontal='m'>
            {/* HEADERR BAR */}
            <Box flexDirection='row' height={50} alignItems='center' paddingTop='m'>
                <Ionicons name='arrow-back-outline' size={30} color={theme.colors.textColor} onPress={() => onClose()} />
                <CustomText variant='subheader' marginLeft='s'>Tag Someone</CustomText>
            </Box>

            {/* SEARCH  BAR AREA */}
            <Box style={{ ...style.textInput }} marginBottom='l' backgroundColor='secondaryBackGroundColor'>
                <Ionicons name='search-outline' size={25} color={theme.colors.textColor} />
                <TextInput style={{ flex: 1, fontFamily: 'RedRegular', marginLeft: 20, fontSize: theme.textVariants.body.fontSize }} placeholderTextColor={theme.colors.textColor} placeholder='Search for someone to tag'  />
            </Box>

            {Selected().length > 0 && (
                <Box width='100%' height={80} >
                    <FlashList 
                        estimatedItemSize={100}
                        ListEmptyComponent={() => (
                            <Text>Nothing to see here</Text>
                        )}
                        data={Selected()}
                        renderItem={({ item }) => (
                            <Box width={100} justifyContent='center' alignItems='center' >
                                <Image source={{ uri: `${IMAGE_BASE}${item.follower.profile_image}` }} style={{ width: 50, height: 50, borderRadius: 25 }} contentFit='cover' />
                                <CustomText variant='xs'>@{item.follower.username}</CustomText>
                            </Box>
                        )}
                    />
                </Box>
            )}

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
                    <TagCard user={item} onChecked={setTags} isChecked={tags.includes(item.follower.id, 0)} />
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

export default TagModal