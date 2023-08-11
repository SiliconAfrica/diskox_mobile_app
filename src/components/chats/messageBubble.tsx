import { View, Text } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import { IChatMessage } from '../../models/chatmessages'
import { useDetailsState } from '../../states/userState'
import CustomText from '../general/CustomText'
import moment from 'moment'

const MessageBubble = ({ created_at, message, sender_id, post_images, id: message_id, reactions }: IChatMessage) => {
    const { id } = useDetailsState((state) => state)
  return (
    <Box zIndex={10} width='70%' marginBottom='s' borderTopRightRadius={10} borderTopLeftRadius={10} borderBottomLeftRadius={sender_id !== id ? 0 : 10} borderBottomRightRadius={sender_id === id ? 0 : 10} alignSelf={ sender_id === id ? 'flex-end' : 'flex-start'} padding='s' backgroundColor={ sender_id === id ? 'secondaryBackGroundColor':'fadedButtonBgColor'}>
        <CustomText variant='body'>{message}</CustomText>
        <CustomText textAlign={ sender_id === id ? 'right':'left'} variant='xs' marginTop='s'>
            {moment(created_at).format("hh:mm:ss a")}
        </CustomText>
    </Box>
  )
}

export default MessageBubble