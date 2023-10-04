import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useRef } from 'react'
import ModalWrapper from '../ModalWrapper'
import Login from '../../pages/login'
import { useModalState } from '../../states/modalState'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import CustomText from '../general/CustomText'
import Box from '../general/Box'
import { Ionicons, Feather } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigation/MainNavigation'
import { useUtilState } from '../../states/util'

const ActionChip = ({
    icon,
    label,
    action
}: {
    icon: any,
    label: string,
    action: () => void
}) => {
    const { isDarkMode } = useUtilState((state) => state);
    const theme = useTheme<Theme>()
    return (
        <Pressable onPress={action} style={{ flexDirection: 'row', paddingHorizontal: 20, height: 60, justifyContent: 'flex-start', alignItems: 'center'}}>
            <Box width={40} height={40} style={{ backgroundColor: isDarkMode ? theme.colors.mainBackGroundColor : '#F3FBF5' }} borderRadius={20} justifyContent='center' alignItems='center' >
                {icon}
            </Box>
            <CustomText variant='body' marginLeft='m'>{label}</CustomText>
        </Pressable>
    )
}

const PostActionModal = () => {
    const [setAll, activePost] = useModalState((state) => [state.setAll, state.activePost]);
    const ref = useRef<BottomSheetModal>();
    const theme = useTheme<Theme>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'post'>>();

    const obj = [
        {
            label: 'View profile',
            action: () => {
                navigation.navigate('profile', { userId: activePost.user_id });
                setAll({ activePost: null, showPostAction: false })
            },
            icon: <Ionicons name='person-outline' size={20} color={theme.colors.textColor} />
        },
        {
            label: 'Save post',
            action: () => {},
            icon: <Ionicons name='bookmark-outline' size={20} color={theme.colors.textColor} />
        },
        {
            label: 'Copy link',
            action: () => navigation.navigate('profile', { userId: activePost.user_id }),
            icon: <Ionicons name='link-outline' size={20} color={theme.colors.textColor} />
        },
        {
            label: 'Report post',
            action: () => navigation.navigate('profile', { userId: activePost.user_id }),
            icon: <Ionicons name='flag-outline' size={20} color={theme.colors.textColor} />
        }
    ]

   

    useEffect(() => {
        if (ref.current !== null) {
            ref.current.present();
        }
    }, [])
  return (
    <ModalWrapper
        onClose={() => setAll({ showPostAction: false, activePost: null })}
        shouldScrroll={false}
        snapPoints={['40%']}
        ref={ref}
    >

        <Box width='100%' height={40} paddingHorizontal='m' flexDirection='row' justifyContent='flex-end'>
            <Feather name='x' size={25} color={theme.colors.textColor} onPress={() =>  setAll({ showPostAction: false, activePost: null })} />
        </Box>

        {obj.map((item, i) => (
            <ActionChip {...item} key={i.toString()} />
        ))}
       
    </ModalWrapper>
  )
}

export default PostActionModal