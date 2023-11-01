import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import { Ionicons, Feather } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import CustomText from '../general/CustomText'
import { IUser } from '../../models/user'
import moment from 'moment';
import { Image } from 'expo-image'
import { IMAGE_BASE } from '../../utils/httpService'
import { useNavigation } from '@react-navigation/native'
import { PageType } from '../../pages/login'
import { useModalState } from '../../states/modalState'

const ChatSectionHeader = ({ username, last_seen, profile_image, userId }: Partial<IUser> & { userId: number }) => {
    const { setAll } = useModalState((state) => state)
    const theme = useTheme<Theme>();
    const navigation = useNavigation<PageType>();
    const [showMenu, setShowMenu] = React.useState(false);
  return (
    <Box zIndex={100} width={'100%'} height={130}  borderBottomWidth={1} borderBottomColor='secondaryBackGroundColor' flexDirection='row' alignItems='center' justifyContent='space-between' paddingHorizontal='m' paddingTop='l'>

        <Box flexDirection='row' alignItems='center'>
            <Ionicons name='arrow-back-outline' size={25} color={theme.colors.textColor} onPress={() => navigation.goBack()} />
            <Box flexDirection='row' alignItems='center' >
                <Box width={40} height={40} borderRadius={25} overflow='hidden' marginHorizontal='m'>
                    <Image source={{ uri: `${IMAGE_BASE}${profile_image}`}} style={{ width: '100%', height: '100%' }} contentFit='cover' />
                </Box>
                <Box>
                    <CustomText variant='body'>{username}</CustomText>
                    <CustomText variant='xs'>{moment(last_seen).fromNow()}</CustomText>
                </Box>
            </Box>
        </Box>

        <Ionicons name='ellipsis-vertical-outline' size={30} color={theme.colors.textColor} onPress={() => setShowMenu(prev => !prev)} />
       {
        showMenu && (
            <Box  elevation={4} position='absolute' height={150} backgroundColor='secondaryBackGroundColor' borderRadius={10} zIndex={100} right={20} bottom={-120} padding='m'>
                <Pressable style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }} onPress={() => {
                    setAll({
                        activeChat: { userId, username},
                        showBlockUser: true,
                        showDeleteConvo: false,
                    })
                }}>
                    <Feather name='slash' size={20} color={theme.colors.textColor} />
                    <CustomText variant="body" marginLeft='s'>Block this person</CustomText>
                </Pressable>

                <Pressable style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }} onPress={() => {
                    setAll({
                        activeChat: { userId, username},
                        showBlockUser: false,
                        showDeleteConvo: true
                    })
                }} >
                    <Feather name='trash-2' size={20} color={theme.colors.textColor} />
                    <CustomText variant="body" marginLeft='s'>Delete conversation</CustomText>
                </Pressable>

                <Box flexDirection='row' alignItems='center' flex={1}>
                    <Feather name='flag' size={20} color={theme.colors.textColor} />
                    <CustomText variant="body" marginLeft='s'>Report</CustomText>
                </Box>
            </Box>
        )
       }
    </Box>
  )
}

export default ChatSectionHeader