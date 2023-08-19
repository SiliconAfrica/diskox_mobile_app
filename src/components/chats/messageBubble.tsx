import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import { IChatMessage } from '../../models/chatmessages'
import { useDetailsState } from '../../states/userState'
import CustomText from '../general/CustomText'
import moment from 'moment'
import { Image } from 'expo-image'
import { IMAGE_BASE } from '../../utils/httpService'

const MessageBubble = ({ created_at, message, sender_id, post_images, id: message_id, reactions }: IChatMessage) => {
    const { id } = useDetailsState((state) => state)
    console.log(post_images)
  return (
    <Box zIndex={10} maxWidth='70%' minWidth='20%' marginBottom='s' borderTopRightRadius={10} borderTopLeftRadius={10} borderBottomLeftRadius={sender_id !== id ? 0 : 10} borderBottomRightRadius={sender_id === id ? 0 : 10} alignSelf={ sender_id === id ? 'flex-end' : 'flex-start'} padding='s' backgroundColor={ sender_id === id ? 'secondaryBackGroundColor':'fadedButtonBgColor'}>
        {post_images.length > 0 && post_images.map((item, i) => (
          (
            <Pressable style={{ width: 200, maxHeight: 140, overflow: 'hidden', borderRadius: 10, }} key={i.toString()}>
              <Image  source={{ uri: `${IMAGE_BASE}${item.image_path}`}} style={{ width: '100%', height: '100%' }} contentFit='cover' />
            </Pressable>
          )
        ))}
        <CustomText variant='body'>{message}</CustomText>
        <CustomText textAlign={ sender_id === id ? 'right':'left'} variant='xs' marginTop='s'>
            {moment(created_at).format("hh:mm a")}
        </CustomText>
    </Box>
  )
}

export default MessageBubble