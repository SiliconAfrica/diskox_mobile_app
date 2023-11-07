import { View, Text, Pressable, Share } from 'react-native'
import React, { useEffect, useRef } from 'react'
import ModalWrapper from '../ModalWrapper'
import Login from '../../pages/login'
import { useModalState } from '../../states/modalState'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import CustomText from '../general/CustomText'
import Box from '../general/Box'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigation/MainNavigation'


const ShareChip = ({
    icon,
    label,
    action
}: {
    icon: any,
    label: string,
    action: () => void
}) => {
    return (
        <Pressable onPress={action} style={{ flexDirection: 'row', paddingHorizontal: 20, height: 60, justifyContent: 'flex-start', alignItems: 'center'}}>
            {icon}
            <CustomText variant='body' marginLeft='m'>{label}</CustomText>
        </Pressable>
    )
}

const ShareModal = () => {
    const [setAll, postId, activePost] = useModalState((state) => [state.setAll, state.postId, state.activePost]);
    const ref = useRef<BottomSheetModal>();
    const theme = useTheme<Theme>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'post'>>();

    let medias = ['Facebook', 'Twitter', 'LinkedIn', 'Whatsapp'];

    const name = React.useCallback((name: string) => {
        switch(name) {
            case 'Facebook': {
                return {
                    name: 'logo-facebook',
                    color: '#1777F2'
                }
            }
            case 'Twitter': {
                return {
                    name: 'logo-twitter',
                    color: '#1EA1F2'
                }
            }
            case 'LinkedIn': {
                return {
                    name: 'logo-linkedin',
                    color: '#1EA1F2'
                }
            }
            case 'Whatsapp': {
                return {
                    name: 'logo-whatsapp',
                    color: '#5FD669'
                }
            }
        }
    }, []);

    const handleShare = async () => {
        try {
          const result = await Share.share({
            message: `Checkout this post by ${activePost.user.username} on Diskox https://test404.diskox.com/post/${activePost.slug}`,
            url: `https://test404.diskox.com/posts/${activePost.slug}`,
          });
      
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // Shared with specific activity type
              console.log(`Shared with ${result.activityType}`);
            } else {
              // Shared
              console.log('Shared');
            }
          } else if (result.action === Share.dismissedAction) {
            // Dismissed
            console.log('Dismissed');
          }
        } catch (error) {
          console.error(error.message);
        }
      };

    const handleRepost = () => {
        navigation.navigate('repost', { id: postId })
        setAll({ showShare: false, postId: 0 });
    }

    useEffect(() => {
        ref.current.present();
    }, [])
  return (
    <ModalWrapper
        onClose={() => setAll({ showShare: false, postId: 0, activePost: null })}
        shouldScrroll
        snapPoints={['50%']}
        ref={ref}
    >
        <Box borderBottomWidth={2} borderBottomColor='secondaryBackGroundColor' paddingBottom='s'>
            <ShareChip icon={
                <Ionicons name='reload-circle-outline' size={25} color={theme.colors.primaryColor} />
            } 
                label='Repost on Diskos'
                action={handleRepost}
            />
        </Box>
        {medias.map((item, i) => (
            <ShareChip key={i} icon={<Ionicons name={name(item).name as any} size={25} color={name(item).color} />} label={item} action={handleShare} />
        ))}
    </ModalWrapper>
  )
}

export default ShareModal