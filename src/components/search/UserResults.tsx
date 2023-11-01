import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { IUser } from '../../models/user'
import { FlashList } from '@shopify/flash-list'
import PostCard from '../feeds/PostCard'
import { Theme } from '../../theme'
import { useTheme } from '@shopify/restyle'
import Box from '../general/Box'
import CustomText from '../general/CustomText'
import { Image } from 'expo-image'
import { IMAGE_BASE } from '../../utils/httpService'
import { useNavigation } from '@react-navigation/native'

const UserCard = ({ user }: {
    user: Partial<IUser>,
}) => {
    const navigation = useNavigation<any>();
    return (
        <Box px='m' width='100%' height={50} flexDirection='row' alignItems='center' justifyContent='space-between' marginBottom='s'>
            <Box flexDirection='row' alignItems='center' > 
                <Box width={32} height={32} borderRadius={25} backgroundColor='secondaryBackGroundColor' overflow='hidden'>
                    <Pressable onPress={() => navigation.navigate('profile', { userId: user.id })} style={{ width:  '100%', height: '100%', borderRadius: 25 }}>
                        <Image source={{ uri: `${IMAGE_BASE}${user.profile_image}` }} style={{ width: '100%', height: '100%', borderRadius:1 }} contentFit='cover' />
                    </Pressable>
                </Box>

                <CustomText variant='subheader' fontSize={15} color='black' marginLeft='s'>{user.name}</CustomText>
                <CustomText variant='body' color='grey' marginLeft='s'>@{user.username}</CustomText>
            </Box>
        </Box>
    )
}

const UserResults = ({ users }: { users: Array<IUser>}) => {
  return (
    <FlashList 
        estimatedItemSize={20}
        ListEmptyComponent={()  => (
            <Box px='m'>
                <CustomText>No Person found</CustomText>
            </Box>
        )}
        data={users}
        renderItem={({ item }) => (
            <UserCard user={item} />
        )}
    />
  )
}

export default UserResults