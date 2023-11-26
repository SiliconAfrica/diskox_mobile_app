import { View, Text } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import { UNsentMessage } from '../../models/chatmessages'
import CustomText from '../general/CustomText'
import { useUtilState } from '../../states/util'
import moment from 'moment'

const UnsentMessageBubble = ({
    created_at,
    docs,
    files,
    message,
}: UNsentMessage) => {
    const { isDarkMode } = useUtilState((state) => state)
  return (
    <Box zIndex={10} maxWidth='70%' minWidth='30%' marginBottom='m' borderTopRightRadius={10} borderTopLeftRadius={10} borderBottomLeftRadius={10} borderBottomRightRadius={0} alignSelf={'flex-end'} padding='s' backgroundColor={'secondaryBackGroundColor'}>
        { docs.length > 0 && (
            <Box width={'100%'} height={50}>
                { docs.map((item) => (
                    <Box width={'40%'} height={30} borderRadius={10} justifyContent='center' alignItems='center'>
                        <CustomText variant='header' fontSize={14} style={{ backgroundColor: 'red' }}>{item.type.split('/')[1].toUpperCase()}</CustomText>
                    </Box>
                ))}
            </Box>
        )}
        {
            files.length > 0 && (
                <Box></Box>
            )
        }
         { message === '' && (
          <>
            <CustomText variant='body' fontSize={15} style={{ color: isDarkMode ?  'white':'black'}} color={'white'}>{message}</CustomText>
            <CustomText color='grey' textAlign={'right'} variant='xs' marginTop='s'>
                {moment(created_at).format("hh:mm a")}
            </CustomText>
          </>
        )}
    </Box>
  )
}

export default UnsentMessageBubble