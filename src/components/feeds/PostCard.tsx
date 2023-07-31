import { View, Text } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import CustomText from '../general/CustomText'
import { IPost } from '../../models/post'
import { Image} from 'expo-image'
import { IMAGE_BASE } from '../../utils/httpService'
import  moment from 'moment';
import { useNavigation } from '@react-navigation/native'

const PostCard = ({
    description,
    user: { name, about, isFollowing, profile_image },
    created_at,
    upvotes_count,
    view_count,
    comments_count,
    reactions_count,
    repost_count,
    id
}: IPost) => {
    const theme = useTheme<Theme>();
    const navigation = useNavigation<any>();

  return (
    <Box width='100%' backgroundColor='mainBackGroundColor' marginBottom='s' padding='m'>
 
        {/* HEADER SECTION */}
        <Box flexDirection='row' justifyContent='space-between' alignItems='center'>
            <Box flexDirection='row'>
                <Box flexDirection='row'>
                    <View style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: theme.colors.primaryColor, backgroundColor: theme.colors.secondaryBackGroundColor, overflow: 'hidden' }} >
                        <Image source={{ uri: `${IMAGE_BASE}${profile_image}`}} contentFit='contain' style={{ width: '100%', height: '100%', borderRadius: 25 }} />
                    </View>

                    <Box marginLeft='s' justifyContent='center'>
                        <Box flexDirection='row'>
                            <CustomText variant='body' color='black'>{name} </CustomText>
                            <CustomText variant='body' color='grey'></CustomText>
                        </Box>
                        <CustomText variant='xs' onPress={() => navigation.navigate('post', { postId: id })}>{moment(created_at).fromNow()}</CustomText>
                    </Box>
                </Box>
            </Box>
            <Ionicons name='ellipsis-vertical' size={20} color={theme.colors.textColor} />
        </Box>

        {/* CONTENT SECTION */}
        <Box marginVertical='m'>

            <CustomText variant='body'>{description?.length > 100 ? description?.substring(0, 100) + '...' : description}  { description?.length > 100 && (
                <CustomText variant='body' >Read More</CustomText>
            )} </CustomText>

            {/* IMAGE OR VIDEO SECTION */}
        </Box>

        {/* REACTION SECTION */}

        <Box width='100%' borderTopWidth={2} borderTopColor='secondaryBackGroundColor' paddingVertical='m'>

            <Box flexDirection='row' alignItems='center'>
                <Ionicons name='eye-outline' size={25} color={theme.colors.grey} />
                <CustomText variant='body' marginLeft='s'>{view_count} Views</CustomText>
            </Box>

            {/* REACTIONS */}

            <Box flexDirection='row' justifyContent='space-between' width='100%' marginTop='m'>

                {/* VOTING SECTION */}
                <Box flex={1} flexDirection='row' width='100%' alignItems='center'>
                    <Box width='45%' flexDirection='row' height={40} borderRadius={20} borderWidth={2} borderColor='secondaryBackGroundColor'>
                        <Box flexDirection='row' justifyContent='center' alignItems='center' flex={0.8}>
                            <Ionicons name='arrow-up-outline' size={20} color={theme.colors.textColor} />
                            <CustomText variant='body'>{upvotes_count} Upvote</CustomText>
                        </Box>
                        <Box width={15} flex={0.2} height='100%' borderLeftWidth={2} borderLeftColor='secondaryBackGroundColor' justifyContent='center' alignItems='center'>
                            <Ionicons name='arrow-down-outline' size={20} color={theme.colors.textColor} />
                        </Box>
                    </Box>

                    <Box flexDirection='row' alignItems='center' marginHorizontal='s'>
                        <Ionicons name='heart-outline' size={25} color={theme.colors.textColor} />
                        <CustomText variant='body'>{reactions_count}</CustomText>
                    </Box>

                    <Box flexDirection='row' alignItems='center'>
                        <Ionicons name='chatbox-ellipses-outline' size={25} color={theme.colors.textColor} />
                        <CustomText variant='body'>{comments_count}</CustomText>
                    </Box>
                </Box>

                <Box width={30} flexDirection='row' alignItems='center'>
                        <Ionicons name='share-social-outline' size={25} color={theme.colors.textColor} />
                        <CustomText variant='body'>{repost_count}</CustomText>
                </Box>
            </Box>

        </Box>

    </Box>
  )
}

export default PostCard